const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const path = require('path');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = 'Sheet1!A1:K91';

// Google Sheets authentication
let auth;
if (process.env.GOOGLE_CREDENTIALS) {
  auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else {
  const credentialsPath = path.join(process.cwd(), 'credentials.json');
  auth = new GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

const sheets = google.sheets({ version: 'v4', auth });

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Leaderboard data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });
      return res.status(200).json({ data: response.data.values || [] });
    }

    if (req.method === 'POST') {
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
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
