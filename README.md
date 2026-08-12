# Schlaf- & Recovery-Tracking

Evidenzbasierte Nischenseite zu Schlaf- und Recovery-Tracking (Wearables, Schlaf-Apps,
HRV-/Recovery-basierte Trainingssteuerung). Gebaut mit [Astro](https://astro.build).

Verbindliche Projektregeln (Quellenpflicht, Zitierformat, KI-Personas, Affiliate-Kennzeichnung):
siehe [`CLAUDE.md`](./CLAUDE.md).

## Struktur

```
/
├── content/       # Redaktionelle Inhalte (Artikel, Vergleiche, Glossar) — siehe content/README.md
├── personas/      # ~10 KI-Personas — siehe personas/README.md
├── data/          # Rohdaten: Produkte, Studien-Register, Themeninventur — siehe data/README.md
├── agents/        # Arbeits-Agents für Recherche/Faktencheck/Redaktion — siehe agents/README.md
├── src/
│   ├── content.config.ts   # Content-Collections-Schema (Zod), bindet /content ein
│   └── pages/               # Astro-Seiten
└── public/
```

## Befehle

| Befehl | Aktion |
| :--- | :--- |
| `npm install` | Dependencies installieren |
| `npm run dev` | Dev-Server unter `localhost:4321` |
| `npm run build` | Produktions-Build nach `./dist/` |
| `npm run preview` | Build lokal ansehen |
| `npm run astro ...` | Astro-CLI (z. B. `astro check`) |

Für Agent-gestützte Entwicklung: Dev-Server im Hintergrund starten mit `astro dev --background`,
verwalten mit `astro dev stop` / `astro dev status` / `astro dev logs`.

## Deployment

Geplant: [Cloudflare Pages](https://pages.cloudflare.com/) (statischer Build, `npm run build`
→ `dist/`). Noch nicht eingerichtet — kein Cloudflare-Adapter im Projekt, solange nur statische
Seiten ausgeliefert werden (Astros Default-Output `static` reicht dafür aus).
