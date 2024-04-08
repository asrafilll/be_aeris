# Catatan BE

![Police](https://media1.tenor.com/m/eflsAfxgrssAAAAC/police-anime-police.gif)

# Table of Contents

- [Catatan BE](#catatan-be)
- [Table of Contents](#table-of-contents)
  - [Instalasi Error](#instalasi-error)
  - [Solusinya....](#solusinya)
    - [1. Buat Dulu Databasenya](#1-buat-dulu-databasenya)
    - [2. Coba Lagi Proses Impornya](#2-coba-lagi-proses-impornya)
  - [Setup Sequelize-cli](#setup-sequelize-cli)
  - [Bug-Jos-mantap](#bug-jos-mantap)
    - [1. Penggunaan `require()` pada ES Module](#1-penggunaan-require-pada-es-module)
      - [Masalah:](#masalah)
      - [Solusi dari GPT:](#solusi-dari-gpt)
    - [2. Scheme URL Tidak Didukung pada Import ESM](#2-scheme-url-tidak-didukung-pada-import-esm)
      - [Masalah:](#masalah-1)
      - [Solusi dari GPT:](#solusi-dari-gpt-1)
  - [Bisnis Flow:](#bisnis-flow)



## Instalasi Error

Ketemu eror kayak gini wuakakakak

```
ERROR 1049 (42000): Unknown database 'polisi'
```

## Solusinya....

### 1. Buat Dulu Databasenya

Sebelum impor file `.sql`, pastikan database `polisi` udah dibuat ya. Bisa kok bikin database lewat MySQL command line interface (CLI), gini caranya:

1. Buka MySQL CLI:
   - Dari PowerShell atau Command Prompt, ketik aja:
     ```powershell
     mysql -u root -p
     ```
   - Terus masukin password kamu.

2. Buat Database:
   - Di MySQL CLI, ketik perintah ini buat bikin database baru:
     ```sql
     CREATE DATABASE polisi;
     ```
   - Keluar dari MySQL CLI tinggal ketik `exit` atau `quit` terus pencet `Enter` deh.

### 2. Coba Lagi Proses Impornya

Habis database `polisi` berhasil dibuat, coba lagi proses impor pake PowerShell kayak tadi:

Karena saya Sobat Windows jadi kek gini
```powershell
Get-Content .\db_fleet.sql | mysql -u root -p polisi
```

kalo saudara adalah sobat unix, jadi pake ini aja deh
```
mysql -u root -p polisi < .\db_fleet.sql
```

Jangan lupa masukin password ya. Harusnya sekarang proses impor lancar jaya

## Setup Sequelize-cli

Pertama, install dulu `sequelize-cli` pake perintah ini:

```
npm install --save-dev sequelize-cli
```

Habis itu, tinggal jalanin:

```
npx sequelize-cli init
```

Nanti bakal muncul beberapa folder. Kita fokus ke folder `config` aja, terus isi file `config.json` dengan nama db, merk db, sama password kamu.

Karena di DB ada 9 tabel, kita bikin 9 migrasi per tabelnya pake perintah ini:

```
npx sequelize-cli migration:generate --name create-user
npx sequelize-cli migration:generate --name create-vehicle
npx sequelize-cli migration:generate --name create-vehicle-user
npx sequelize-cli migration:generate --name create-place-in
npx sequelize-cli migration:generate --name create-place-out
npx sequelize-cli migration:generate --name create-task
npx sequelize-cli migration:generate --name create-vehicle-perawatan
npx sequelize-cli migration:generate --name create-sent-wa
npx sequelize-cli migration:generate --name create-webhook-wa
```

Setelah folder-foldernya kebuat, tugas kita adalah nulis ulang schema yang udah dipikirin pas bikin database sebelumnya. Jangan lupa tulis tipe data, validasi, sama relasinya kayak contoh di folder `models`.

Kalau semuanya udah beres, tinggal gas aja pake perintah ini:

```
npx sequelize-cli db:migrate
```


## Bug-Jos-mantap

### 1. Penggunaan `require()` pada ES Module

#### Masalah:
Ketika mencoba menggunakan `require()` untuk mengimpor modul yang ditulis sebagai ES Module (ESM), Node.js mengembalikan error `ERR_REQUIRE_ESM`. Hal ini terjadi karena `require()` adalah sintaks CommonJS, sedangkan modul tersebut adalah ESM.

#### Solusi dari GPT:
Ubah cara mengimpor modul dari `require()` menjadi `import`. Misalnya, jika error terjadi saat mengimpor `task.js`:
- Sebelum: `const task = require('./models/task.js');`
- Sesudah: Ganti dengan dynamic import: `import task from './models/task.js';`

Catatan: `import()` bersifat asinkron, sehingga mungkin perlu menyesuaikan kode lebih lanjut untuk menangani ini.

### 2. Scheme URL Tidak Didukung pada Import ESM

#### Masalah:
Ketika melakukan import ESM dengan path yang tidak sesuai skema yang didukung (`file:`, `data:`, `node:`), Node.js mengembalikan error `ERR_UNSUPPORTED_ESM_URL_SCHEME`. Terutama pada Windows, path absolut harus diubah menjadi URL yang valid dengan skema `file://`.

#### Solusi dari GPT: 
Pastikan bahwa saat menggunakan `import` dengan path absolut, konversi path tersebut menjadi format URL yang valid dengan menambahkan `file://` di awal path. Ini umumnya berlaku untuk penggunaan `import()` dinamis dengan string sebagai path.

Misalnya, ubah path `E:\\be_aeris\\models\\task.js` menjadi format URL yang valid: `file:///E:/be_aeris/models/task.js` untuk penggunaan dalam dynamic import.

## Bisnis Flow:
1. User Management:
   - Aplikasi ini memiliki sistem manajemen user dengan tabel "users".
   - Setiap user memiliki username, password, level (administrator/petugas), nomor telepon, area, dan email.
   - User dapat dibuat oleh user lain (kemungkinan oleh admin) dilihat dari adanya kolom "createdBy".

2. Manajemen Kendaraan:
   - Aplikasi ini mengelola data kendaraan dengan tabel "vehicles".
   - Setiap kendaraan memiliki detail seperti ID kendaraan, merek, tipe, kondisi, nama, VIN, plat nomor, ID perangkat, status daya, status pengapian, kecepatan, waktu operasi, penandaan (tagging), penugasan (assignment), dll.
   - Kendaraan dapat dihubungkan dengan user melalui tabel "vehicle_users".

3. Pelacakan Lokasi Kendaraan:
   - Aplikasi ini melacak lokasi kendaraan menggunakan tabel "place_ins" dan "place_outs".
   - Setiap kali kendaraan masuk atau keluar dari suatu tempat, data tersebut dicatat dalam tabel-tabel ini, termasuk ID kendaraan, tempat, tanggal, dan waktu.

4. Penugasan Pekerjaan:
   - Aplikasi ini mendukung penugasan pekerjaan menggunakan tabel "tasks".
   - Setiap tugas memiliki detail seperti deskripsi tugas, tanggal, waktu, alamat, koordinat (latitude/longitude), status, tipe, ID pengguna yang ditugaskan, koordinat pengguna, ID kendaraan yang terkait, koordinat kendaraan, deskripsi, file terkait, dll.

5. Perawatan Kendaraan:
   - Aplikasi ini mengelola data perawatan kendaraan dengan tabel "vehicle_perawatan".
   - Setiap record perawatan mencakup nama perawatan, ID kendaraan, nomor plat, tanggal STNK, perpanjangan STNK, odometer, tipe kendaraan, dan informasi ban.

6. Komunikasi WhatsApp:
   - Aplikasi ini memiliki fitur pengiriman pesan WhatsApp menggunakan tabel "sent_wa" dan "webhook_wa".
   - Tabel "sent_wa" mencatat pesan yang dikirim dari aplikasi, termasuk nomor tujuan, isi pesan, dan tanggal pengiriman.
   - Tabel "webhook_wa" mencatat pesan yang diterima melalui webhook WhatsApp, termasuk pengirim, isi pesan, file terkait (jika ada), dan stempel waktu.

UML (Class Diagram):


![Diagram Database Merch Store](https://www.plantuml.com/plantuml/png/hPNFRjim3CRlVWejfwr03XtGIq_T3WE27HPWwteq68krjUYF8T49YgBlFjaLuYuXVHXwAGB-HFAZzOczImIH1cUh3zIXGmNEj50r5b9IzmcZUgwKMYkZRvNnf9wttr-cm92P1uUtwW2nwI1-_7npysb2VSuzXgWPPF60balfQZ-u7SOth22829THT62uGar48DHVduhSRrdkIrNc-OsTQInA8nrUiU645rRl8lWbJayzBk0cU6t81C-S4RxcmN27hMdG9wnx2yHbQJpa4njEQX-E6Ej4G4DYi6cz35EFoDKCFKOWuzkQp3Y51iBnrmG9sZOZ9WrIokqSUfgkGhp1gRLnx3Z66wg33Wu9uvHpSU6YZ-LBBtsBqOq-5zFOyuovwzP2WnilTJG-sq0lkEHU5jEFfTcFKEl926GS9WBNdydvCP2a9mpqle9AKLdHBqXxIGrbnjGRmwNW-7UEvVAboHm3hIEc99MnG28ANaBbJV2KU_UyUKgG5r4GAsBPgFC1eNAXGd6DgM4tENLC-D5O5BPLn6Q84JtzvsxUOeGZ48Yl9_S5URpDab6f_8_XzXhv_RorJg6wnzY3_mE-FQDbuN2r12lim4iBuoTwUlWYJPmohIam9Hsc12tNBEVeqtCfia_j7d3NXR2NEpx6uEHsl26OyFpq_rKnhUFLzKgjrsfrjPhMmKMm-A6goW-6ZIaSBlkNHMKNpkpgbLqN6MAtsPbLDPvycpa9kKEl1sV_0W00)


Penjelasan hubungan antar tabel:
- Tabel `User` memiliki hubungan dengan tabel `Vehicle` melalui kolom `createdBy`, yang menunjukkan bahwa setiap kendaraan dapat dibuat oleh seorang pengguna.
- Tabel `Vehicle` memiliki hubungan dengan tabel `VehicleUser` melalui kolom `vehicleid`, yang menunjukkan bahwa setiap kendaraan dapat dihubungkan dengan satu atau beberapa pengguna.
- Tabel `Vehicle` juga memiliki hubungan dengan tabel `PlaceIn` dan `PlaceOut` melalui kolom `vehicleUid`, yang menunjukkan catatan masuk dan keluar kendaraan dari suatu tempat.
- Tabel `Task` memiliki hubungan dengan tabel `User` melalui kolom `userid`, yang menunjukkan pengguna yang ditugaskan untuk suatu tugas, dan dengan tabel `Vehicle` melalui kolom `vehicleid`, yang menunjukkan kendaraan yang terkait dengan tugas tersebut.
- Tabel `VehiclePerawatan` memiliki hubungan dengan tabel `Vehicle` melalui kolom `vehicleId`, yang menunjukkan catatan perawatan untuk setiap kendaraan.

Tabel `SentWA` dan `WebhookWA` tidak memiliki hubungan langsung dengan tabel lainnya berdasarkan struktur database yang diberikan.
