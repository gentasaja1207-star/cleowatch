# CleoWatch — Vercel

Project streaming/nonton film & series (frontend HTML/CSS/JS + backend Serverless Function), 100% dikonfigurasi untuk Vercel.

## Struktur folder
```
/
├── api/
│   ├── home.js      -> GET /api/home
│   ├── search.js    -> GET /api/search?q=...
│   └── detail.js    -> GET /api/detail?id=...&type=movie|tv
├── css/
│   └── cleowatch.css
├── js/
│   └── cleowatch.js
├── home.html
├── details.html
├── player.html
├── share.html
├── vercel.json
└── package.json
```

## Cara deploy

### Opsi 1 — Vercel CLI (paling cepat)
```bash
npm i -g vercel
cd cleowatch-vercel
vercel
```
Ikuti prompt-nya (login, pilih scope, project name), lalu jalankan `vercel --prod` untuk deploy production.

### Opsi 2 — Lewat GitHub + Dashboard Vercel
1. Push folder ini ke repo GitHub baru.
2. Buka https://vercel.com/new, import repo tersebut.
3. Framework preset: pilih **Other** (folder `api/` otomatis dikenali sebagai Serverless Functions).
4. Klik Deploy.

## Routing
`vercel.json` mengatur clean URL:
- `/` dan `/home` → `home.html`
- `/details` → `details.html`
- `/player` → `player.html`
- `/share` → `share.html`

Endpoint API (`/api/home`, `/api/search`, `/api/detail`) otomatis aktif karena berada di folder `api/` — tidak perlu konfigurasi tambahan di `vercel.json`.

## Catatan
- API key TMDB bisa dipindah ke Environment Variable `TMDB_KEY` di dashboard Vercel (Settings → Environment Variables). Kalau tidak diset, kode akan pakai key bawaan sebagai fallback.
- `player.html` memakai `vidsrc.sbs` sebagai sumber embed streaming pihak ketiga.
