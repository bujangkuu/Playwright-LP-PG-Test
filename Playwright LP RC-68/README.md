# Playwright LP - Test Automation Suite (LDP-51 Insert RC68)

Suite pengujian otomatis Playwright untuk seluruh 17 skenario kasus uji **LDP-51: Insert RC68** berdasarkan dokumen `docs/LDP-51_RC68_Automation_Test_Scenarios.xlsx`.

## Informasi Akun Pengujian
- **Akun Utama (Internal Admin)**:
  - **Username**: `internaladmin`
  - **Password**: `password123`
- **Akun Role Boundary (Khusus TC 014 & 015)**:
  - Organization Admin: `qaadminorg` / `Pass1234`
  - Merchant Admin: `qaadminmerch` / `Pass1234`

---

## Daftar File Pengujian (Per Test Case)

| No | File Test Case | TC ID | Tipe | Deskripsi Skenario |
|:---|:---|:---|:---|:---|
| 1 | `TC_LDP51_AUTO_001.spec.ts` | TC_LDP51_AUTO_001 | Positive | E2E Happy Path (Upload CSV valid -> Import -> Select All -> Proceed -> Confirm Process -> Verifikasi Popup Process Completed) |
| 2 | `TC_LDP51_AUTO_002.spec.ts` | TC_LDP51_AUTO_002 | Positive | Verifikasi transaksi RC68 tampil pada menu Monitoring > Transactions dengan filter toggle "Only RC68" aktif |
| 3 | `TC_LDP51_AUTO_003.spec.ts` | TC_LDP51_AUTO_003 | Positive | Verifikasi rincian atribut modal Detail Transaksi sesuai dengan data sumber CSV RC68 |
| 4 | `TC_LDP51_AUTO_004.spec.ts` | TC_LDP51_AUTO_004 | Positive | Verifikasi interlock status tombol Import (disabled saat kosong -> enabled saat CSV dipilih -> disabled saat file di-cancel) |
| 5 | `TC_LDP51_AUTO_005.spec.ts` | TC_LDP51_AUTO_005 | Positive | Verifikasi interlock status tombol Proceed (disabled saat 0 baris tercentang -> enabled saat >=1 baris tercentang -> disabled saat uncheck) |
| 6 | `TC_LDP51_AUTO_006.spec.ts` | TC_LDP51_AUTO_006 | Positive | Verifikasi toggle Master Checkbox memilih dan membatalkan seluruh centang baris transaksi |
| 7 | `TC_LDP51_AUTO_007.spec.ts` | TC_LDP51_AUTO_007 | Positive | Verifikasi tombol Cancel tabel mereset centang, dan tombol Cancel pada modal Confirm menutup dialog tanpa eksekusi |
| 8 | `TC_LDP51_AUTO_008.spec.ts` | TC_LDP51_AUTO_008 | Negative | Verifikasi upload file non-CSV (.xlsx, .pdf, .txt) ditolak dengan pesan error validasi |
| 9 | `TC_LDP51_AUTO_009.spec.ts` | TC_LDP51_AUTO_009 | Negative | Verifikasi file CSV dengan header invalid / kolom kurang dari 10 wajib ditolak |
| 10 | `TC_LDP51_AUTO_010.spec.ts` | TC_LDP51_AUTO_010 | Negative | Verifikasi file CSV kosong (0 KB atau header-only) ditolak sistem |
| 11 | `TC_LDP51_AUTO_011.spec.ts` | TC_LDP51_AUTO_011 | Negative | Verifikasi CSV dengan baris corrupt (Amount string / non-numeric) ditolak |
| 12 | `TC_LDP51_AUTO_012.spec.ts` | TC_LDP51_AUTO_012 | Negative | Verifikasi penolakan duplikasi transaksi (RRN + MTN identik) untuk mencegah double-crediting |
| 13 | `TC_LDP51_AUTO_013.spec.ts` | TC_LDP51_AUTO_013 | Positive | Verifikasi eksekusi batch parsial memisahkan hasil baris sukses ke tab Successful dan gagal ke tab Failed |
| 14 | `TC_LDP51_AUTO_014.spec.ts` | TC_LDP51_AUTO_014 | Negative | Verifikasi blokir hak akses role Organization Admin terhadap menu & URL `/monitoring/insert-rc68` (HTTP 403) |
| 15 | `TC_LDP51_AUTO_015.spec.ts` | TC_LDP51_AUTO_015 | Negative | Verifikasi blokir hak akses role Merchant Admin terhadap menu & URL `/monitoring/insert-rc68` (HTTP 403) |
| 16 | `TC_LDP51_AUTO_016.spec.ts` | TC_LDP51_AUTO_016 | Negative | Verifikasi request tanpa token sesi login dialihkan (redirect) ke halaman login (HTTP 401) |
| 17 | `TC_LDP51_AUTO_017.spec.ts` | TC_LDP51_AUTO_017 | Negative | Verifikasi pertahanan IDOR - Penolakan transaksi dengan MID/NMID di luar batas tenant organisasi |

---

## Cara Menjalankan Tes

### 1. Menjalankan Satu Test Case Tertentu:
```bash
# Contoh menjalankan TC 001 (Happy Path E2E)
cmd /c npx playwright test "Playwright LP/TC_LDP51_AUTO_001.spec.ts"

# Contoh mode headed (browser terlihat):
cmd /c npx playwright test "Playwright LP/TC_LDP51_AUTO_004.spec.ts" --headed
```

### 2. Menjalankan Seluruh Test Case dalam Folder:
```bash
cmd /c npx playwright test -c "Playwright LP/playwright.config.ts"
```

### 3. Melihat Laporan Hasil Uji (HTML Report):
```bash
cmd /c npx playwright show-report
```

#### note tambahan
# Menjalankan spesifik satu test case (contoh Happy Path):
cmd /c npx playwright test "Playwright LP/TC_LDP51_AUTO_001.spec.ts"

# Menjalankan spesifik test case dengan browser tampak di layar (headed):
cmd /c npx playwright test "Playwright LP/TC_LDP51_AUTO_004.spec.ts" --headed

# Menjalankan seluruh test case sekaligus:
cmd /c npx playwright test -c "Playwright LP/playwright.config.ts"

# Menjalankan seluruh test case sekaligus dengan UI:
npx playwright test --config="Anthem/Playwright LP RC-68/playwright.config.ts" --ui

# Menjalankan seluruh test case sekaligus dengan HTML Report:
npx playwright test --config="Anthem/Playwright LP RC-68/playwright.config.ts" --reporter=html
