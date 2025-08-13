const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Allow cross-origin requests (adjust if front-end is same origin)

// Spreadsheet setup
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1UGqxbpkFpR2-aRA-wyhp4WaIgS7LPYcHlsVgadwES30';
const RANGE = 'Sheet1!A1:K91';

// Google Sheets authentication
let auth;
if (process.env.GOOGLE_CREDENTIALS) {
  // Production: use environment variable
  auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else {
  // Local: use credentials.json file
  const credentialsPath = path.join(__dirname, 'credentials.json');
  auth = new GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

const sheets = google.sheets({ version: 'v4', auth });

// Routes
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values || [];
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Error reading sheet', details: error.message });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { username, values } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Username is required' });
    }
    if (!values || !Array.isArray(values)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const timestamp = new Date().toLocaleString();
    const finalRow = [username, ...values, timestamp];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:K',
      valueInputOption: 'RAW',
      requestBody: { values: [finalRow] },
    });

    res.json({ message: 'Data added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding data', details: error.message });
  }
});

// Export app for Vercel serverless function
module.exports = app;

// Local dev server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
