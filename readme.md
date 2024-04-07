# Catatan BE

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

```
+---------------+
|     User      |
+---------------+
| - id          |
| - username    |
| - password    |
| - level       |
| - ph_number   |
| - area        |
| - email       |
| - createdBy   |
+---------------+
        |
        |
        |
+---------------+
|    Vehicle    |
+---------------+
| - id          |
| - vehicleid   |
| - brand       |
| - type        |
| - condition   |
| - name        |
| - vin         |
| - license_plate |
| - deviceId    |
| - power_status |
| - ign_status  |
| - speed       |
| - operating_time |
| - tagging     |
| - assignment  |
| - createdBy   |
+---------------+
        |
        |
        |
+---------------+
| VehicleUser   |
+---------------+
| - id          |
| - vehicleid   |
| - userid      |
| - sclid       |
+---------------+
        |
        |
        |
+---------------+
|   PlaceIn     |
+---------------+
| - id          |
| - in_code     |
| - vehicleUid  |
| - place       |
| - in_date     |
+---------------+
        |
        |
        |
+---------------+
|   PlaceOut    |
+---------------+
| - id          |
| - out_code    |
| - vehicleUid  |
| - place       |
| - out_date    |
+---------------+
        |
        |
        |
+---------------+
|     Task      |
+---------------+
| - id          |
| - task        |
| - task_date   |
| - task_time   |
| - task_address |
| - task_lat    |
| - task_lon    |
| - task_status |
| - task_type   |
| - userid      |
| - user_lat    |
| - user_lon    |
| - vehicleid   |
| - vehicle_lat |
| - vehicle_lon |
| - desc        |
| - path        |
| - filename    |
| - recurrent   |
| - createdBy   |
+---------------+
        |
        |
        |
+---------------+
| VehiclePerawatan |
+---------------+
| - id          |
| - nama        |
| - vehicleId   |
| - plat_number |
| - stnk        |
| - stnk_perpanjang |
| - odometer    |
| - type        |
| - ban         |
+---------------+

+---------------+
|    SentWA     |
+---------------+
| - id          |
| - sent_to     |
| - message     |
| - send_date   |
+---------------+

+---------------+
|   WebhookWA   |
+---------------+
| - id          |
| - from        |
| - message     |
| - file        |
| - timestamp   |
+---------------+
```

Penjelasan hubungan antar tabel:
- Tabel `User` memiliki hubungan dengan tabel `Vehicle` melalui kolom `createdBy`, yang menunjukkan bahwa setiap kendaraan dapat dibuat oleh seorang pengguna.
- Tabel `Vehicle` memiliki hubungan dengan tabel `VehicleUser` melalui kolom `vehicleid`, yang menunjukkan bahwa setiap kendaraan dapat dihubungkan dengan satu atau beberapa pengguna.
- Tabel `Vehicle` juga memiliki hubungan dengan tabel `PlaceIn` dan `PlaceOut` melalui kolom `vehicleUid`, yang menunjukkan catatan masuk dan keluar kendaraan dari suatu tempat.
- Tabel `Task` memiliki hubungan dengan tabel `User` melalui kolom `userid`, yang menunjukkan pengguna yang ditugaskan untuk suatu tugas, dan dengan tabel `Vehicle` melalui kolom `vehicleid`, yang menunjukkan kendaraan yang terkait dengan tugas tersebut.
- Tabel `VehiclePerawatan` memiliki hubungan dengan tabel `Vehicle` melalui kolom `vehicleId`, yang menunjukkan catatan perawatan untuk setiap kendaraan.

Tabel `SentWA` dan `WebhookWA` tidak memiliki hubungan langsung dengan tabel lainnya berdasarkan struktur database yang diberikan.