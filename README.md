# Sistem Akuntansi Piutang dan Penerimaan Kas pada Usaha Homestay

Aplikasi web sederhana untuk mencatat **piutang** dan **penerimaan kas** pada usaha homestay, lengkap dengan **jurnal otomatis**, **buku besar**, dan **laporan**. Proyek ini dibuat sebagai tugas kuliah akuntansi dan bertujuan menunjukkan hubungan antara transaksi, pencatatan akuntansi, dan pelaporan dalam satu sistem informasi.

**Demo aplikasi:** https://bintangrifqi1-bit.github.io/Apk-Web-Sistem-Piutang-HomeStay/

---

## Latar Belakang

Pada usaha homestay, tamu sering menginap terlebih dahulu dan membayar kemudian, sehingga timbul piutang usaha. Pencatatan manual rawan salah: saldo piutang tidak sinkron dengan pembayaran, jurnal tidak seimbang, dan laporan sulit disusun. Sistem ini mengotomatiskan alur tersebut:

```text
Transaksi Homestay → Piutang → Penerimaan Kas → Jurnal → Buku Besar → Laporan
```

---

## Fitur Utama

| Modul | Fungsi |
|---|---|
| **Dashboard** | Ringkasan Total Piutang, Piutang Jatuh Tempo, Piutang Lewat Jatuh Tempo (>30 hari), Penerimaan Kas Bulan Ini, serta tabel piutang dan penerimaan kas terbaru |
| **Pelanggan** | Kelola data pelanggan: kode, nama, telepon, email, alamat |
| **Kamar** | Kelola data kamar: kode, nama, tipe, harga per malam, status |
| **Akun** | Daftar akun sederhana (chart of accounts) |
| **Invoice (Piutang)** | Mencatat transaksi menginap. Jumlah malam dan total dihitung otomatis |
| **Penerimaan Kas** | Mencatat pembayaran per invoice. Saldo piutang ditampilkan, dan pembayaran melebihi saldo ditolak |
| **Laporan Piutang** | Total, dibayar, outstanding, dan status setiap invoice |
| **Aging Piutang** | Pengelompokan piutang berdasarkan umur keterlambatan |
| **Laporan Penerimaan Kas** | Daftar kas masuk beserta total |
| **Jurnal Umum** | Jurnal otomatis dari setiap invoice dan penerimaan kas, dengan pengecekan Debit = Kredit |
| **Buku Besar** | Per akun, dengan filter tanggal dan saldo berjalan |

---

## Konsep Input - Process - Output

| Input | Process | Output |
|---|---|---|
| Data pelanggan dan data kamar | Jumlah malam = check out - check in; Total = jumlah malam x harga per malam | Laporan piutang |
| Transaksi homestay (invoice) | Jurnal otomatis: **D** Piutang Usaha / **K** Pendapatan Jasa Homestay | Aging piutang |
| Penerimaan kas | Jurnal otomatis: **D** Kas / **K** Piutang Usaha | Laporan penerimaan kas |
| | Outstanding = Total Invoice - Total Pembayaran; penentuan status piutang | Jurnal umum |
| | Saldo buku besar = saldo sebelumnya +/- mutasi debit dan kredit | Buku besar dan dashboard |

---

## Logika Akuntansi

### Akun yang digunakan

| Kode | Nama Akun | Tipe |
|---|---|---|
| 1101 | Kas | Aset |
| 1102 | Piutang Usaha | Aset |
| 4101 | Pendapatan Jasa Homestay | Pendapatan |
| 5101 | Beban Operasional | Beban |

### Jurnal otomatis

**Saat invoice dibuat** (contoh: 3 malam x Rp500.000):

```text
Piutang Usaha                  1.500.000
    Pendapatan Jasa Homestay           1.500.000
```

**Saat pembayaran diterima** (contoh: Rp1.000.000):

```text
Kas                            1.000.000
    Piutang Usaha                      1.000.000
```

### Status piutang

| Status | Kondisi |
|---|---|
| Belum Bayar | Belum ada pembayaran dan belum lewat jatuh tempo |
| Sebagian | Sudah ada pembayaran, outstanding masih tersisa |
| Lunas | Outstanding = 0 |
| Jatuh Tempo | Outstanding masih ada dan tanggal jatuh tempo sudah terlewat |

### Aging piutang

Belum Jatuh Tempo, 1-30 hari, 31-60 hari, 61-90 hari, dan lebih dari 90 hari, dihitung dari selisih hari antara tanggal hari ini dan tanggal jatuh tempo.

---

## Contoh Skenario Pengujian

1. Buat invoice: 3 malam Standard Room x Rp500.000 = **Rp1.500.000**. Jurnal terbentuk: D Piutang Usaha / K Pendapatan.
2. Terima pembayaran **Rp1.000.000**. Jurnal terbentuk: D Kas / K Piutang Usaha. Sisa **Rp500.000**, status **Sebagian**.
3. Terima pembayaran **Rp500.000**. Sisa **Rp0**, status **Lunas**.
4. Cek Jurnal Umum, Buku Besar, Dashboard, dan Laporan. Seluruhnya ikut berubah secara otomatis.

---

## Teknologi dan Arsitektur

| Lapisan | Teknologi |
|---|---|
| Frontend | HTML5, CSS3, JavaScript murni (tanpa framework) |
| Backend | Supabase: PostgreSQL, Supabase Auth, Row Level Security |
| Logika akuntansi | Fungsi SQL `create_invoice()` dan `create_receipt()`, serta view `v_invoice_status`, `v_receipts`, `v_ledger` |
| Hosting | GitHub Pages (situs statis, deploy via GitHub Actions) |

```text
Pengguna → GitHub Pages (HTML + CSS + JS) → Supabase → PostgreSQL
```

Tidak ada server perantara. Browser berhubungan langsung dengan Supabase memakai publishable/anon key, dan akses data diatur oleh Row Level Security.

### Mengapa jurnal dibuat di database?

Penyimpanan invoice atau pembayaran dan pembuatan jurnalnya dijalankan dalam **satu transaksi database**. Jika salah satu gagal, keduanya dibatalkan, sehingga data transaksi dan jurnal selalu konsisten dan jurnal selalu seimbang.

### Tabel database

`profiles`, `customers`, `rooms`, `accounts`, `invoices`, `invoice_items`, `cash_receipts`, `journal_entries`, `journal_lines`.

---

## Struktur Proyek

```text
homestay-accounting-system/
├── index.html                  Halaman utama
├── README.md
├── SETUP.md                    Panduan instalasi langkah demi langkah
├── config/
│   └── supabase-config.js      Satu-satunya file yang diedit (URL dan key Supabase)
├── css/
│   └── style.css
├── js/
│   ├── app.js                  Navigasi dan dashboard
│   ├── auth.js                 Autentikasi
│   ├── customers.js            Modul pelanggan
│   ├── rooms.js                Modul kamar
│   ├── invoices.js             Modul invoice (piutang)
│   ├── receipts.js             Modul penerimaan kas
│   ├── journal.js              Jurnal umum
│   ├── ledger.js               Buku besar
│   ├── reports.js              Laporan piutang, aging, dan kas
│   └── utils.js                Fungsi bantu
├── supabase/
│   ├── supabase_setup.sql      Tabel, fungsi, view, dan RLS
│   ├── seed.sql                Data contoh
│   └── README_SUPABASE.md
└── .github/workflows/
    └── deploy-pages.yml        Deploy otomatis ke GitHub Pages
```

---

## Cara Menjalankan

Ringkasan singkat (versi lengkap ada di [SETUP.md](SETUP.md)):

1. Buat project di Supabase, lalu jalankan `supabase/supabase_setup.sql` dan `supabase/seed.sql` di SQL Editor.
2. Isi `SUPABASE_URL` dan `SUPABASE_KEY` di `config/supabase-config.js`.
3. Jalankan lokal dengan Live Server atau `python -m http.server 8000`.
4. Push ke GitHub, lalu aktifkan **Settings > Pages > Source: GitHub Actions**.

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit - Homestay Accounting System"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

---

## Batasan Sistem

Proyek ini adalah **prototipe pembelajaran**, bukan software akuntansi komersial. Sistem sengaja tidak mencakup multi-cabang, perpajakan, persediaan, aset tetap, rekonsiliasi bank, penutupan periode, maupun pembayaran online. Fitur edit dan hapus transaksi juga belum tersedia, sehingga koreksi dilakukan lewat jurnal baru.

**Catatan keamanan:** publishable/anon key memang aman berada di frontend selama Row Level Security aktif. Jangan pernah memasukkan `service_role` key ke repository.
