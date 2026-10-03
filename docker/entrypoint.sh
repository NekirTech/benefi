#!/bin/bash
# Runs the web server and refreshes the menu from Google Drive periodically.
set -u
cd /app

# A fresh volume (or bind mount) starts with the menu bundled in the image.
for file in seed/*.json; do
  [ -e "src/locales/${file#seed/}" ] || cp "$file" src/locales/
done

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &

interval=$(( ${MENU_REFRESH_MINUTES:-15} * 60 ))
(
  while true; do
    if timeout 300 python3 helper_skripts/menu_converter/menu_converter.py >/tmp/menu_converter.log 2>&1; then
      echo "[menu] updated $(date -Is)"
    else
      echo "[menu] update failed $(date -Is), keeping previous menu:"
      tail -n 20 /tmp/menu_converter.log
    fi
    sleep "$interval"
  done
) &

# Exit (and let Docker restart us) as soon as one of the two stops.
wait -n
exit $?
