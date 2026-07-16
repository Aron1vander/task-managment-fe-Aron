# Task Management — Frontend (Next.js)

Frontend untuk Simple Task Management App. Login sederhana, papan task 3 kolom
(Todo / In Progress / Done), tambah/edit/hapus task, dan dropdown assignee
yang datanya diambil dari backend.

## Struktur

```
task-management-frontend/
├── app/
│   ├── layout.tsx        # root layout + font
│   ├── globals.css       # design tokens & styling
│   ├── page.tsx          # redirect ke /login
│   ├── login/page.tsx    # halaman login (hit POST /auth/login)
│   └── tasks/page.tsx    # papan task + CRUD
├── components/
│   └── TaskModal.tsx     # form tambah/edit task
├── lib/
│   ├── api.ts            # client fetch ke backend FastAPI
│   └── auth.ts           # simpan/ambil JWT token (localStorage)
```

## 1. Prasyarat

Pastikan **backend FastAPI** (task-management-backend) sudah jalan dulu di
`http://localhost:8000`, karena frontend ini langsung manggil API-nya.

## 2. Setup

```bash
cd task-management-frontend
npm install
cp .env.local.example .env.local
```

`.env.local` isinya:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Jalankan

```bash
npm run dev
```

Buka `http://localhost:3000` — otomatis redirect ke halaman login.

## 4. Login

Gunakan salah satu dummy user dari `seed.py` backend:
- aron@example.com / password123
- budi@example.com / password123
- citra@example.com / password123

Setelah login, kamu akan diarahkan ke `/tasks` — papan task dengan 3 kolom
status. Dari situ kamu bisa:
- **Tambah Task** — buka modal, isi judul/deskripsi/status/deadline/assignee
- **Edit** — ubah data task lewat modal yang sama
- **Hapus** — hapus task (dengan konfirmasi)
- **Ubah status** — langsung lewat dropdown status di tiap card, tanpa perlu buka modal

## Catatan alur autentikasi

Token JWT disimpan di `localStorage` (key: `task_management_token`) setelah
login berhasil, lalu dikirim sebagai header `Authorization: Bearer <token>`
di setiap request ke endpoint yang butuh auth (`/tasks`, `/users`). Kalau
token tidak ada / invalid, halaman `/tasks` otomatis redirect balik ke
`/login`.
