// ✅ Fully Working uploadBackend.js
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;

// ✅ Storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// ✅ Ensure folders exist
['uploads', 'downloads'].forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
});

let uploadedAssets = [];

app.post('/upload-assets', upload.single('file'), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: '❌ File not found in request.' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const allData = [];

    workbook.SheetNames.forEach(sheet => {
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
      sheetData.forEach(row => {
        row['Sheet Name'] = sheet;
        row['Uploaded At'] = new Date().toISOString();
        allData.push(row);
      });
    });

    uploadedAssets = [...uploadedAssets, ...allData];
    fs.writeFileSync('uploadedAssets.json', JSON.stringify(uploadedAssets, null, 2));
    fs.unlinkSync(req.file.path);

    res.json({ message: '✅ Upload and parsing successful.' });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Upload failed.' });
  }
});

app.get('/preview-uploaded-assets', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('uploadedAssets.json', 'utf-8'));
    res.json(data);
  } catch {
    res.json([]);
  }
});

app.get('/download-sheet/:sheetName', (req, res) => {
  try {
    const sheetName = decodeURIComponent(req.params.sheetName);
    const allAssets = JSON.parse(fs.readFileSync('uploadedAssets.json', 'utf-8'));
    const filtered = allAssets.filter(item => item['Sheet Name'] === sheetName);

    const ws = xlsx.utils.json_to_sheet(filtered);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, sheetName);

    const filePath = path.join(__dirname, 'downloads', `${sheetName}.xlsx`);
    xlsx.writeFile(wb, filePath);

    res.download(filePath, () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('❌ Download error:', err);
    res.status(500).send('Download failed');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Upload backend running at http://localhost:${PORT}`);
});
