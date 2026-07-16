# Simple Task Management App

Aplikasi Task Management sederhana — technical test Front-End & Back-End Developer Intern (Moonlay Technologies).

Memungkinkan user login, melihat daftar task, menambah/mengedit/menghapus task, mengubah status, dan menetapkan assignee ke tiap task.

---

## Tech Stack

**Backend**

- Python 3.x + FastAPI
- PostgreSQL (via SQLAlchemy)
- JWT untuk autentikasi
- Dokumentasi otomatis: Swagger (`/docs`)

**Frontend**

- Next.js (React)
- Fetch API ke backend
- JWT disimpan di `localStorage`

**Dokumentasi**

- Postman Collection
- ERD (draw.io)

---

## Screenshot

<!--
Tempel screenshot aplikasi kamu di sini. Cara nambahin gambar di README:
1. Bikin folder `screenshots/` di root project ini
2. Simpan screenshot ke situ, misal: screenshots/login.png
3. Ganti baris di bawah ini sesuai nama file kamu

Kalau nggak sempat ambil screenshot, bagian ini boleh dihapus aja — tidak wajib diminta di soal.
-->

| Halaman          | Screenshot                |
| ---------------- | ------------------------- |
| Login            | _(tempel gambar di sini)_ |
| Daftar Task      | _(tempel gambar di sini)_ |
| Tambah/Edit Task | _(tempel gambar di sini)_ |

Contoh cara nempel gambar (hapus tanda `<!--` kalau sudah diisi):

```markdown
![Halaman Login](./screenshots/login.png)
![Daftar Task](./screenshots/tasks.png)
```

---

## Struktur Folder

```
task-management-app/
├── backend/                          # FastAPI + PostgreSQL
│   ├── app/
│   ├── seed.py
│   ├── requirements.txt
│   ├── docker-compose.yml            # opsional: jalankan PostgreSQL + pgAdmin via Docker
│   └── .env.example
├── frontend/                         # Next.js
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── .env.local.example
├── Task_Management_Aron.postman_collection.json
├── ERD_Simple_Task_Management_App.pdf
└── README.md                         # file ini
```

---

## Prasyarat

Pastikan sudah terinstall di komputer kamu:

- Python 3.10+
- Node.js (versi LTS) + npm
- PostgreSQL + pgAdmin
- Postman (untuk testing API)

Cek semua sudah terpasang:

```bash
python --version
node --version
npm --version
psql --version
```

---

## 1. Setup Database (PostgreSQL)

Pilih salah satu:

**Opsi A — Docker (lebih cepat)**

```bash
cd backend
docker compose up -d
```

Database `task_management_db` otomatis dibuat (user: `postgres`, password: `postgres`). pgAdmin juga ikut jalan di `http://localhost:5050` kalau mau lihat data secara visual (login: `admin@example.com` / `admin`).

**Opsi B — PostgreSQL lokal**

1. Buka pgAdmin, klik kanan **Databases** → **Create** → **Database**
2. Nama database: `task_management_db`

---

## 2. Setup & Jalankan Backend

```bash
cd backend
python -m venv venv

# Aktifkan virtual environment
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
```

Copy file environment:

```bash
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux
```

Edit `.env`:

- Kalau pakai **Docker (Opsi A)**: default `.env.example` sudah cocok, tidak perlu diubah.
- Kalau pakai **PostgreSQL lokal (Opsi B)**: ganti `password_kamu` di `DATABASE_URL` sesuai password PostgreSQL kamu.

```
DATABASE_URL=postgresql://postgres:password_kamu@localhost:5432/task_management_db
SECRET_KEY=isi-dengan-string-acak-panjang
```

Isi database dengan dummy user:

```bash
python seed.py
```

Jalankan server:

```bash
uvicorn app.main:app --reload
```

Backend berjalan di **http://localhost:8000**
Dokumentasi Swagger otomatis: **http://localhost:8000/docs**

**Dummy user untuk login** (password sama untuk semua): `password123`
| Email | Nama |
|---|---|
| aron@example.com | Aron |
| budi@example.com | Budi Santoso |
| citra@example.com | Citra Dewi |

---

## 3. Setup & Jalankan Frontend

Buka terminal baru (biarkan backend tetap berjalan di terminal sebelumnya):

```bash
cd frontend
npm install
```

Copy file environment:

```bash
copy .env.local.example .env.local     # Windows
cp .env.local.example .env.local       # Mac/Linux
```

Isi `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Jalankan:

```bash
npm run dev
```

Buka **http://localhost:3000** — otomatis redirect ke halaman login.

---

## 4. Testing API via Postman

1. Buka Postman → **Import** → pilih file `Task_Management_Aron.postman_collection.json`
2. Jalankan request **Auth Login** terlebih dahulu → token otomatis tersimpan
3. Lanjutkan ke request lain (User, List Tasks, Create Tasks, Get/Update/Delete Tasks by id, **Chatbot**) — semua otomatis menggunakan token dari langkah sebelumnya

---

## Daftar Endpoint API

| Method | Endpoint       | Auth | Deskripsi                                            |
| ------ | -------------- | :--: | ---------------------------------------------------- |
| POST   | `/auth/login`  |  ❌  | Login, mengembalikan JWT access token                |
| GET    | `/users/`      |  ✅  | Daftar semua user (untuk dropdown assignee)          |
| GET    | `/tasks/`      |  ✅  | Daftar semua task                                    |
| GET    | `/tasks/{id}`  |  ✅  | Detail satu task                                     |
| POST   | `/tasks/`      |  ✅  | Membuat task baru                                    |
| PUT    | `/tasks/{id}`  |  ✅  | Memperbarui task                                     |
| DELETE | `/tasks/{id}`  |  ✅  | Menghapus task                                       |
| POST   | `/chatbot/ask` |  ✅  | Tanya jawab seputar data task via AI Chatbot (bonus) |

Endpoint dengan ✅ butuh header `Authorization: Bearer <access_token>`.

---

## ERD

Lihat file `ERD_Simple_Task_Management_App.pdf` — terdiri dari 2 tabel:

- **users** (`id_user`, `name`, `email`, `password`, `created_at`)
- **tasks** (`id_task`, `title`, `description`, `status`, `deadline`, `assignee_id` → FK ke `users`, `created_at`, `updated_at`)

---

## AI Chatbot (Fitur Bonus)

Chatbot bisa menjawab pertanyaan seputar data task, contoh:

- "Tampilkan semua task yang statusnya belum selesai"
- "Berapa jumlah task yang sudah selesai?"
- "Tugas apa saja yang deadlinenya hari ini?"
- "Siapa assignee dari task [judul task]?"

Muncul sebagai tombol chat mengambang (💬) di pojok kanan bawah halaman `/tasks`.

### Cara kerja

1. Saat user mengirim pertanyaan, backend mengambil **seluruh data task** dari database (judul, status, deadline, assignee).
2. Data itu disusun jadi teks konteks yang rapi (list per task).
3. Konteks + pertanyaan user dikirim ke LLM dalam satu prompt, dengan instruksi: _"jawab hanya berdasarkan data ini, jangan mengarang."_
4. LLM membaca konteks dan menjawab pertanyaan (menghitung jumlah, memfilter status, mencocokkan tanggal hari ini, dsb) secara langsung dari teks yang diberikan.
5. Jawaban dikembalikan ke frontend dan ditampilkan di chat.

Pendekatan ini disebut **context stuffing** — seluruh data relevan dimasukkan langsung ke prompt. Ini cukup untuk skala data kecil/menengah seperti pada aplikasi ini. Untuk jumlah task yang sangat besar, pendekatan yang lebih tepat adalah **RAG (Retrieval-Augmented Generation)** dengan vector database, tapi untuk kebutuhan aplikasi ini context stuffing lebih sederhana dan tetap akurat.

### Library & Model yang dipakai

- **Library**: `openai` (Python SDK resmi)
- **Model default**: `gpt-4o-mini` (OpenAI)

SDK `openai` sengaja dipakai sebagai client karena mendukung parameter `base_url` custom — artinya SDK yang sama bisa dipakai untuk provider LLM lain yang **OpenAI-compatible**, tanpa ubah kode sama sekali, cukup ganti environment variable. Beberapa contoh:

| Provider       | LLM_BASE_URL                     | LLM_MODEL                                 | Keterangan                                          |
| -------------- | -------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| OpenAI         | _(kosongkan)_                    | `gpt-4o-mini`                             | Default, berbayar setelah free credit habis         |
| Groq           | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile`                 | Model open-source (Llama), gratis dengan rate limit |
| Together AI    | `https://api.together.xyz/v1`    | `meta-llama/Llama-3.3-70B-Instruct-Turbo` | Model open-source                                   |
| Ollama (lokal) | `http://localhost:11434/v1`      | `llama3.2`                                | Jalan 100% lokal, tanpa API key eksternal           |

### Cara menjalankan fitur chatbot

1. Pastikan `openai` sudah terinstall (sudah ada di `requirements.txt`):
   ```bash
   pip install -r requirements.txt
   ```
2. Buka `backend/.env`, isi:
   ```
   LLM_API_KEY=isi-dengan-api-key-kamu
   LLM_MODEL=gpt-4o-mini
   LLM_BASE_URL=
   ```
   (Kalau pakai Groq/Together/Ollama, isi `LLM_BASE_URL` dan `LLM_MODEL` sesuai tabel di atas. Ollama tidak butuh `LLM_API_KEY` asli, isi bebas misal `ollama`.)
3. Restart backend (`uvicorn app.main:app --reload`).
4. Buka `http://localhost:3000/tasks`, klik ikon 💬 di pojok kanan bawah, lalu ketik pertanyaan.

Endpoint API-nya sendiri: `POST /chatbot/ask` (butuh Bearer Token, sama seperti endpoint task lainnya), body:

```json
{ "question": "Berapa jumlah task yang sudah selesai?" }
```

---

## Catatan

- Field `status` pada task hanya menerima nilai: `Todo`, `In Progress`, `Done`.
