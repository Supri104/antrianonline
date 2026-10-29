/**
 * Kode Google Apps Script untuk Aplikasi Antrian Online
 * SMP Negeri 104 Jakarta
 * 
 * URL Spreadsheet: https://docs.google.com/spreadsheets/d/1Jx6x4oufRZp73mcfuVkLl7EnnwTQxlSG_wPl_t1hEw0/edit
 * Created by: supry
 */

// Function untuk menangani request POST dari aplikasi antrian
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Kunci akses sementara selama 10 detik untuk mencegah tumpang tindih data saat tombol ditekan bersamaan
  lock.tryLock(10000);

  try {
    // Buka spreadsheet berdasarkan ID atau spreadsheet yang aktif
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Jika sheet masih kosong / baru, buat header tabel otomatis
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Input System", 
        "Nomor Antrian", 
        "Jenis Layanan", 
        "Waktu Tiket", 
        "Status", 
        "Loket"
      ]);
      
      // Format header agar rapi
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e3a8a");
      headerRange.setFontColor("#ffffff");
    }

    // Ambil data JSON yang dikirimkan oleh aplikasi
    var data = JSON.parse(e.postData.contents);
    
    // Tambahkan baris baru dengan data antrian
    sheet.appendRow([
      new Date(),           // Waktu Input
      data.code || "",      // Kode Antrian (contoh: A-001)
      data.service || "",   // Jenis Layanan (contoh: PPDB)
      data.time || "",      // Waktu Pengambilan Tiket
      data.status || "",    // Status Antrian (waiting, serving, dll)
      data.loket || "-"     // Nomor Loket
    ]);

    // Berikan respon sukses dalam format JSON
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Data antrian berhasil disimpan" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Berikan respon error jika terjadi kegagalan
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    // Lepaskan penguncian script
    lock.releaseLock();
  }
}

// Function pendukung untuk menangani request GET (pemeriksaan status Web App)
function doGet(e) {
  return ContentService
    .createTextOutput("Google Apps Script Antrian SMP Negeri 104 Jakarta Berjalan Aktif!")
    .setMimeType(ContentService.MimeType.TEXT);
}
