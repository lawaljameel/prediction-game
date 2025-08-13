const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const path = require('path');

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

// Main handler for Vercel
module.exports = async (req, res) => {
  if (req.method === 'GET' && req.query.action === 'ping') {
    return res.status(200).json({ message: 'Server is running' });
  }

  if (req.method === 'GET' && req.query.action === 'data') {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });
      const rows = response.data.values || [];
      return res.status(200).json({ data: rows });
    } catch (error) {
      return res.status(500).json({ message: 'Error reading sheet', details: error.message });
    }
  }

  if (req.method === 'POST' && req.query.action === 'add') {
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

      return res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error adding data', details: error.message });
    }
  }

  // If route/method not found
  return res.status(404).json({ message: 'Route not found' });
};
