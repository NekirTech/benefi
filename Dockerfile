# --- build the website ---
FROM node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2 AS caddy

# --- runtime: Caddy + the Python menu converter ---
FROM python:3.13-slim
COPY --from=caddy /usr/bin/caddy /usr/bin/caddy

WORKDIR /app
COPY helper_skripts/menu_converter/requirements.txt helper_skripts/menu_converter/
RUN pip install --no-cache-dir -r helper_skripts/menu_converter/requirements.txt \
 && useradd --system --uid 10001 --home-dir /app benefi

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY helper_skripts/menu_converter/menu_converter.py helper_skripts/menu_converter/
COPY src/locales/menu*.json seed/
COPY --from=build /src/dist dist

# menu_converter.py works relative to the project root: it writes
# ./src/locales/*.json and checks ./public/menu_pics/ for pictures.
RUN mkdir -p src/locales \
 && cp seed/*.json src/locales/ \
 && ln -s dist public \
 && chown -R benefi helper_skripts/menu_converter src/locales

ENV XDG_CONFIG_HOME=/tmp XDG_DATA_HOME=/tmp MENU_REFRESH_MINUTES=15
USER benefi
EXPOSE 8080
VOLUME /app/src/locales
HEALTHCHECK --interval=30s --timeout=5s \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/data/menu.json')"
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
