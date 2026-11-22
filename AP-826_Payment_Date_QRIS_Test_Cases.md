# Test Case Sederhana: AP-826 - Tambah Kolom Payment Date di Open API QRIS Transaction + Download Data

## 1. Informasi Tiket & Konteks Pengujian
- **Jira Issue Key**: [AP-826](https://aksesbayar.atlassian.net/browse/AP-826)
- **Sprint**: AP Sprint 20
- **Tipe Tiket**: Task
- **Assignee / Developer**: Restu Bumi Ryan Ramadhan
- **Reporter**: Alvin Indrawan
- **QA Tester**: Salman Arrasuli Jamil (`Salman`)
- **Status Tiket**: Testing
- **Modul**: Dashboard Aksesbayar $\rightarrow$ `OPEN API` $\rightarrow$ `QRIS TRANSACTION`

---

## 2. Ringkasan Perubahan & Acceptance Criteria
1. **Rename Header**: Kolom `Tanggal` diubah namanya menjadi **`Dibuat Pada`**.
2. **Kolom Baru**: Menambahkan kolom **`Dibayar Pada`** pada tabel transaksi QRIS (posisi di sebelah kanan kolom `Dibuat Pada` dan sebelum kolom `Aksi`).
3. **Data Display**:
   - Transaksi **`Paid`**: Menampilkan tanggal dan waktu pembayaran (format: `DD/MM/YYYY, HH.mm`, contoh: `11/09/2026, 09.53`).
   - Transaksi **`Unpaid`** / **`Pending`**: Menampilkan tanda strip (`-`).
4. **Export / Download Data**:
   - File hasil download (`.xlsx` / `.csv`) wajib menyertakan kolom `Dibuat Pada` dan `Dibayar Pada`.
   - Nilai data antara tampilan tabel web dengan file hasil unduhan harus **konsisten 100%**.
   - Tidak ada kolom existing yang bergeser (*no column shift*) atau rusak.

---

## 3. Matriks Test Cases (12 Test Cases)

| TC ID | Nama Test Case | Tipe | Pre-conditions | Test Steps | Expected Results | Status |
|---|---|:---:|---|---|---|:---:|
| **TC_AP826_UI_001** | Verify column header rename from "Tanggal" to "Dibuat Pada" | Positive | 1. User login sebagai Admin<br>2. Navigasi ke `OPEN API` > `QRIS TRANSACTION` | 1. Buka sub-menu `QRIS TRANSACTION`<br>2. Periksa header kolom tanggal pada tabel transaksi | 1. Kolom yang sebelumnya bernama "Tanggal" telah berubah nama menjadi **"Dibuat Pada"**.<br>2. Tidak ada lagi header "Tanggal". | Pending |
| **TC_AP826_UI_002** | Verify addition of new column "Dibayar Pada" on QRIS Transaction table | Positive | 1. Berada di halaman `QRIS TRANSACTION` | 1. Amati header tabel di sebelah kanan kolom "Dibuat Pada"<br>2. Verifikasi keberadaan dan urutan kolom baru | 1. Kolom baru **"Dibayar Pada"** tampil di antara kolom "Dibuat Pada" dan kolom "Aksi".<br>2. Urutan: *Tenant, Merchant, Reference Number, Merchant Reference Number, RRN, Jumlah, ID Pengirim, Nama Pengirim, Penerbit, Status, Dibuat Pada, Dibayar Pada, Aksi*. | Pending |
| **TC_AP826_UI_003** | Verify UI layout and table responsiveness with new column | Positive | 1. Berada di halaman `QRIS TRANSACTION` | 1. Periksa perataan teks (alignment) kolom "Dibuat Pada" dan "Dibayar Pada"<br>2. Resize viewport browser atau scroll tabel | 1. Teks tanggal rapi tanpa overlap.<br>2. Tombol Aksi (ikon sync/refresh) tetap utuh dan tidak terpotong. | Pending |
| **TC_AP826_DATA_001** | Verify "Dibayar Pada" displays accurate datetime for Paid transactions | Positive | 1. Terdapat transaksi berstatus "Paid" | 1. Cari transaksi dengan status "Paid"<br>2. Amati nilai pada kolom "Dibayar Pada" | 1. Kolom menampilkan tanggal dan jam pembayaran dengan format valid (misal: `11/09/2026, 09.53`).<br>2. Nilai sesuai dengan waktu riil pembayaran. | Pending |
| **TC_AP826_DATA_002** | Verify "Dibayar Pada" displays dash "-" for Unpaid transactions | Positive | 1. Terdapat transaksi berstatus "Unpaid" | 1. Cari transaksi dengan status "Unpaid"<br>2. Amati nilai pada kolom "Dibayar Pada" | 1. Kolom menampilkan tanda strip **`-`**.<br>2. Tidak menampilkan `null`, `undefined`, atau `00-00-0000`. | Pending |
| **TC_AP826_DATA_003** | Verify "Dibayar Pada" displays dash "-" for Pending / Expired transactions | Positive | 1. Terdapat transaksi berstatus "Pending" | 1. Filter status transaksi menjadi "Pending"<br>2. Amati nilai pada kolom "Dibayar Pada" | 1. Kolom menampilkan tanda strip **`-`** untuk transaksi yang belum selesai/sukses dibayar. | Pending |
| **TC_AP826_DATA_004** | Verify "Dibuat Pada" accurately reflects transaction creation datetime | Positive | 1. Terdapat transaksi di tabel | 1. Periksa nilai kolom "Dibuat Pada" untuk semua status<br>2. Cocokkan dengan field `created_at` | 1. Kolom "Dibuat Pada" terisi lengkap (misal: `11/09/2026, 16.50`) dan akurat sesuai waktu transaksi dibuat. | Pending |
| **TC_AP826_EXP_001** | Verify export file includes columns "Dibuat Pada" and "Dibayar Pada" | Positive | 1. Berada di halaman `QRIS TRANSACTION`<br>2. Tersedia data pada tabel | 1. Klik tombol **"Download"** di kanan atas tabel<br>2. Buka file hasil unduhan (.xlsx / .csv)<br>3. Periksa header kolom | 1. File berhasil diunduh.<br>2. Terdapat kolom **"Dibuat Pada"** dan **"Dibayar Pada"**.<br>3. Kolom lama "Tanggal" sudah tidak ada. | Pending |
| **TC_AP826_EXP_002** | Verify data consistency between UI Table and Downloaded File | Positive | 1. File download telah diunduh | 1. Ambil 3 sampel transaksi (Paid dan Unpaid) di UI<br>2. Bandingkan nilainya dengan data di file download | 1. Nilai "Dibuat Pada" dan "Dibayar Pada" di file download identik 100% dengan tampilan di dashboard web. | Pending |
| **TC_AP826_EXP_003** | Verify no column shifting or data corruption in exported file | Positive | 1. File download telah dibuka | 1. Periksa kolom existing (Tenant, Merchant, Ref No, RRN, Jumlah, dll.) | 1. Seluruh data berada pada kolom yang sesuai.<br>2. Tidak terjadi pergeseran kolom (*column shift*). | Pending |
| **TC_AP826_REG_001** | Verify Date Filter continues to work properly with "Dibuat Pada" | Positive | 1. Berada di halaman `QRIS TRANSACTION` | 1. Pilih tanggal pada filter "Tanggal Waktu"<br>2. Amati data transaksi yang ditampilkan | 1. Filter tanggal bekerja normal memfilter transaksi berdasarkan tanggal pembuatannya ("Dibuat Pada"). | Pending |
| **TC_AP826_REG_002** | Verify Status Filter and Reset Button functionality | Positive | 1. Berada di halaman `QRIS TRANSACTION` | 1. Filter status menjadi hanya "Paid"<br>2. Klik tombol "Reset" | 1. Saat filter "Paid", seluruh baris yang tampil berstatus Paid.<br>2. Tombol "Reset" mengembalikan filter dan data ke kondisi awal secara normal. | Pending |
| **TC_AP826_REG_003** | Verify pagination maintains correct column headers and values | Positive | 1. Total data > 10 entri (contoh: 11 entri) | 1. Klik tombol halaman "2" pada pagination<br>2. Periksa kolom pada baris data di halaman 2 | 1. Header dan nilai kolom "Dibuat Pada" serta "Dibayar Pada" tetap ter-render dengan rapi dan benar. | Pending |
