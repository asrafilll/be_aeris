# Catatan BE

## Instalasi Error

Bila ketemu eror kayak gini

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

Moga lancar cepet cair

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

www.plantuml.com/plantuml/png/hPNFRjim3CRlVWejfwr03XtGIq_T3WE27HPWwteq68krjUYF8T49YgBlFjaLuYuXVHXwAGB-HFAZzOczImIH1cUh3zIXGmNEj50r5b9IzmcZUgwKMYkZRvNnf9wttr-cm92P1uUtwW2nwI1-_7npysb2VSuzXgWPPF60balfQZ-u7SOth22829THT62uGar48DHVduhSRrdkIrNc-OsTQInA8nrUiU645rRl8lWbJayzBk0cU6t81C-S4RxcmN27hMdG9wnx2yHbQJpa4njEQX-E6Ej4G4DYi6cz35EFoDKCFKOWuzkQp3Y51iBnrmG9sZOZ9WrIokqSUfgkGhp1gRLnx3Z66wg33Wu9uvHpSU6YZ-LBBtsBqOq-5zFOyuovwzP2WnilTJG-sq0lkEHU5jEFfTcFKEl926GS9WBNdydvCP2a9mpqle9AKLdHBqXxIGrbnjGRmwNW-7UEvVAboHm3hIEc99MnG28ANaBbJV2KU_UyUKgG5r4GAsBPgFC1eNAXGd6DgM4tENLC-D5O5BPLn6Q84JtzvsxUOeGZ48Yl9_S5URpDab6f_8_XzXhv_RorJg6wnzY3_mE-FQDbuN2r12lim4iBuoTwUlWYJPmohIam9Hsc12tNBEVeqtCfia_j7d3NXR2NEpx6uEHsl26OyFpq_rKnhUFLzKgjrsfrjPhMmKMm-A6goW-6ZIaSBlkNHMKNpkpgbLqN6MAtsPbLDPvycpa9kKEl1sV_0W00

![UML Database](./UML%20Database.png "UML Database")

Penjelasan hubungan antar tabel:

- Tabel `User` memiliki hubungan dengan tabel `Vehicle` melalui kolom `createdBy`, yang menunjukkan bahwa setiap kendaraan dapat dibuat oleh seorang pengguna.
- Tabel `Vehicle` memiliki hubungan dengan tabel `VehicleUser` melalui kolom `vehicleid`, yang menunjukkan bahwa setiap kendaraan dapat dihubungkan dengan satu atau beberapa pengguna.
- Tabel `Vehicle` juga memiliki hubungan dengan tabel `PlaceIn` dan `PlaceOut` melalui kolom `vehicleUid`, yang menunjukkan catatan masuk dan keluar kendaraan dari suatu tempat.
- Tabel `Task` memiliki hubungan dengan tabel `User` melalui kolom `userid`, yang menunjukkan pengguna yang ditugaskan untuk suatu tugas, dan dengan tabel `Vehicle` melalui kolom `vehicleid`, yang menunjukkan kendaraan yang terkait dengan tugas tersebut.
- Tabel `VehiclePerawatan` memiliki hubungan dengan tabel `Vehicle` melalui kolom `vehicleId`, yang menunjukkan catatan perawatan untuk setiap kendaraan.

Tabel `SentWA` dan `WebhookWA` tidak memiliki hubungan langsung dengan tabel lainnya berdasarkan struktur database yang diberikan.
