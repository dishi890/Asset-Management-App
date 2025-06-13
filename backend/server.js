const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Folders & Files
const DATA_FOLDER = path.join(__dirname, 'data');
const UPLOAD_FOLDER = path.join(__dirname, 'uploads');
const SHEET_FOLDER = path.join(UPLOAD_FOLDER, 'sheets');
const ALLOCATED_FILE = path.join(DATA_FOLDER, 'allocatedAssets.json');
const UPLOADED_FILE = path.join(DATA_FOLDER, 'uploadedAssets.json');

// Ensure folders exist
[DATA_FOLDER, UPLOAD_FOLDER, SHEET_FOLDER].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

const upload = multer({ dest: 'temp/' });

// ✅ Upload and store each sheet separately
app.post('/upload-assets', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const timestamp = new Date().toISOString();

    const allParsed = [];

    workbook.SheetNames.forEach(sheetName => {
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      jsonData.forEach(row => {
        row["Sheet Name"] = sheetName;
        row["Uploaded At"] = timestamp;
      });

      // Write individual sheet file
      const outputPath = path.join(SHEET_FOLDER, `${sheetName}.xlsx`);
      const sheetWB = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(sheetWB, XLSX.utils.json_to_sheet(jsonData), sheetName);
      XLSX.writeFile(sheetWB, outputPath);

      allParsed.push(...jsonData);
    });

    // Append to master uploaded file
    let existing = [];
    if (fs.existsSync(UPLOADED_FILE)) {
      existing = JSON.parse(fs.readFileSync(UPLOADED_FILE, 'utf8'));
    }
    fs.writeFileSync(UPLOADED_FILE, JSON.stringify([...existing, ...allParsed], null, 2));

    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: 'Upload successful', sheets: workbook.SheetNames });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

// ✅ Preview uploaded assets (all sheets)
app.get('/preview-uploaded-assets', (req, res) => {
  try {
    if (!fs.existsSync(UPLOADED_FILE)) return res.json([]);
    const data = JSON.parse(fs.readFileSync(UPLOADED_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load preview' });
  }
});

// ✅ Download individual sheet by name
app.get('/download-sheet/:sheetName', (req, res) => {
  const { sheetName } = req.params;
  const sheetFile = path.join(SHEET_FOLDER, `${sheetName}.xlsx`);

  if (!fs.existsSync(sheetFile)) {
    return res.status(404).send('Sheet not found');
  }

  res.sendFile(sheetFile);
});

// ✅ Allocate (unchanged)
app.post('/allocate', (req, res) => {
  const newEntry = req.body;
  const requiredFields = ['name', 'empCode', 'department', 'uniqueId', 'assetType', 'onboardingDate'];
  const missing = requiredFields.filter(f => !newEntry[f]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
  }

  let data = [];
  if (fs.existsSync(ALLOCATED_FILE)) {
    const fileContent = fs.readFileSync(ALLOCATED_FILE, 'utf8');
    data = fileContent ? JSON.parse(fileContent) : [];
  }

  data.push(newEntry);
  fs.writeFileSync(ALLOCATED_FILE, JSON.stringify(data, null, 2));
  res.status(200).json({ message: '✅ Asset allocated successfully' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
