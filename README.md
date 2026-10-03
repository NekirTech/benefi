# Benefi Café

Website von https://benefi.cafe – Vue 3 + Vite, ausgeliefert in einem Docker-Container.

## Aufbau

- `src/` – Website (Startseite, Menü unter `/menu`)
- `src/locales/menu*.json` – Menüdaten, erzeugt von `helper_skripts/menu_converter/menu_converter.py`
  aus dem Google-Sheet. Das Format bleibt so, wie das Skript es schreibt.
- `src/locales/en.json`, `tr.json` – Texte der Seite
- `public/menu_pics/` – Produktbilder (`<name>_small.webp` / `<name>_large.webp`), erzeugt aus
  den Originalfotos in `helper_skripts/image_converter/input/`

## Bilder

Neues Foto als `<menü-schlüssel>.<heic|jpg|png>` (z.B. `iced_latte.heic`) nach
`helper_skripts/image_converter/input/` legen, dann:

```bash
pip install -r helper_skripts/image_converter/requirements.txt
python3 helper_skripts/image_converter/image_converter.py
```

Das Skript bearbeitet nur neue oder geänderte Fotos (`--force` für alle) und erzeugt je Foto
ein quadratisches Vorschaubild (192 px, ~5 kB) und ein großes Bild (max. 1200 px), richtig
gedreht und ohne EXIF/GPS-Daten. Außerdem entsteht `public/og_image.jpg` (1200 × 630) für
Link-Vorschauen – das Ausgangsfoto steht oben im Skript (`OG_SOURCE`). Nach Commit und Deploy
findet der Menü-Converter die neuen Bilder automatisch.

Die Seite lädt das Menü beim Öffnen von `/data/*.json`. Im Container schreibt der Converter
diese Dateien direkt in ein Volume, eine Preisänderung im Google-Sheet ist also ohne neuen
Build online (Standard: alle 15 Minuten). Die Kopie im Repo dient nur als Startwert für ein
neues Volume und als Fallback.

## SEO

`npm run build` rendert Startseite, Menü und 404-Seite zusätzlich als fertiges HTML vor
(`scripts/prerender.js`), damit Suchmaschinen und Link-Vorschauen (WhatsApp, Instagram …)
Inhalt sehen. Dabei werden automatisch erzeugt:

- Titel, Beschreibung, Canonical-Link und Open-Graph-Tags je Seite (Texte in
  `src/locales/*.json`, Schlüssel `meta…`)
- strukturierte Daten (schema.org `CafeOrCoffeeShop`: Adresse, Koordinaten, Öffnungszeiten,
  Menü-Link, Google-Maps-Eintrag, Instagram) aus `src/site.ts`
- `sitemap.xml` (mit Build-Datum) und `robots.txt`

Adresse, Telefon, Öffnungszeiten usw. nur in `src/site.ts` ändern – Seite und strukturierte
Daten übernehmen sie. Neue Seiten in `src/seo.ts` (`indexedPaths`, `pageMeta`) eintragen.

Die vorgerenderte Seite ist auf Türkisch; im Browser wechselt sie danach in die gespeicherte
bzw. Browsersprache, das Menü wird live geladen.

## Lokal entwickeln

```bash
npm install
npm run dev
```

Weitere Befehle: `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format`.

Menü manuell aktualisieren (schreibt nach `src/locales/`):

```bash
pip install -r helper_skripts/menu_converter/requirements.txt
python3 helper_skripts/menu_converter/menu_converter.py
```

## Docker

Ein Container enthält Caddy (Webserver, Port 8080) und den Python-Converter.

```bash
docker compose up -d --build
```

Einstellungen über Umgebungsvariablen:

| Variable               | Standard | Bedeutung                              |
| ---------------------- | -------- | -------------------------------------- |
| `HOST_PORT`            | `80`     | Port auf dem Server                    |
| `MENU_REFRESH_MINUTES` | `15`     | Abstand der Menü-Updates aus dem Sheet |

Logs: `docker logs benefi` zeigt bei jedem Lauf `[menu] updated …` oder bei Fehlern die
letzten Zeilen des Skripts. Schlägt ein Update fehl, bleibt das bisherige Menü online.

## Portainer

1. **Stacks → Add stack → Repository**
2. Repository URL: `https://github.com/NekirTech/benefi`, Reference: `refs/heads/main`,
   Compose path: `docker-compose.yml`
3. Optional unter Environment variables `HOST_PORT` / `MENU_REFRESH_MINUTES` setzen.
4. **GitOps updates** aktivieren (Mechanism: Polling, z.B. 5m), damit Portainer nach einem
   Push auf `main` den Stack neu baut und startet.
5. Deploy.

Nach dem ersten Push prüfen, ob die neue Version wirklich gebaut wurde (Stack → Images bzw.
Seite neu laden). Falls Portainer das alte Image weiterverwendet: im Stack
**Pull and redeploy** mit aktiviertem **Re-pull image** ausführen.

### Umstieg vom alten Server

Der Cronjob mit `update_server.sh` (git pull, `quasar build`, Kopie nach `/var/www/html`)
wird nicht mehr gebraucht und sollte deaktiviert werden. Läuft Apache noch auf Port 80,
muss er vorher gestoppt werden (`sudo systemctl disable --now apache2`), sonst kann der
Container den Port nicht belegen.
