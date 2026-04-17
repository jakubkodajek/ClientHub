# ClientHub

Webová aplikace pro správu klientů a jejich servisních odkazů. Postavená na React + TypeScript + Firebase.

## Prerekvizity

- [Node.js](https://nodejs.org/) (v18+)
- npm (součástí Node.js)
- [Firebase CLI](https://firebase.google.com/docs/cli) — pro deploy na Firebase

```bash
npm install -g firebase-tools
```

## Nastavení projektu

```bash
cd clienthub-app
npm install
```

Vytvoř si `.env` soubor podle šablony:

```bash
cp .env.example .env
```

Vyplň hodnoty z Firebase konzole (Project Settings > General > Your apps):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Lokální vývoj

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173`. Změny v kódu se projeví okamžitě (hot reload).

## Build

```bash
npm run build
```

Výstup se vygeneruje do složky `dist/`.

Pro lokální náhled produkčního buildu:

```bash
npm run preview
```

## Deploy na Firebase Hosting

### Poprvé

1. Přihlaš se do Firebase:

```bash
firebase login
```

2. Ověř, že `firebase.json` ukazuje na správný projekt (již nastaveno na `clienthub-76209`).

### Při každé změně

```bash
npm run build
firebase deploy --only hosting
```

To je vše — build + deploy. Po dokončení se v terminálu zobrazí URL, kde je aplikace live.

### Deploy Firestore pravidel

Pokud měníš `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### Deploy všeho najednou

```bash
npm run build
firebase deploy
```

## Struktura projektu

```
clienthub-app/
├── src/
│   ├── components/    # UI komponenty (modály, sidebar, karty)
│   ├── hooks/         # React hooky (auth, clients, links, theme)
│   ├── lib/           # Firebase config, sdílené utility
│   ├── pages/         # Stránky (Login, Dashboard)
│   ├── types/         # TypeScript typy
│   ├── App.tsx        # Routing a providery
│   └── main.tsx       # Entry point
├── firestore.rules    # Bezpečnostní pravidla Firestore
├── firebase.json      # Firebase konfigurace
└── .env.example       # Šablona env proměnných
```
