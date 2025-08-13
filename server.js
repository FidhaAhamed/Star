import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(helmet()); // adds security headers
app.use(express.json({ limit: '5mb' })); // limit JSON payload size

// Allow frontend origin
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL] // e.g. https://yourfrontend.com
    : ['*'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ===== Cloudinary Config =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== GitHub OAuth Config =====
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.REDIRECT_URI || 'http://localhost:4000/api/callback';
const REPO_TO_CHECK = 'conductor-oss/conductor';

// GitHub Token for Star Check (unused but kept for future)
const MACHINE_GITHUB_TOKEN = process.env.MACHINE_GITHUB_TOKEN;

// ===== Multer Config (Temporary Uploads) =====
const upload = multer({ dest: 'uploads/' });

// ===== OAuth Callback =====
app.get('/api/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing OAuth code');
  }

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryEmail = emailRes.data.find((e) => e.primary)?.email;

    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?name=${encodeURIComponent(
        userRes.data.name
      )}&email=${encodeURIComponent(primaryEmail)}&github=${encodeURIComponent(
        userRes.data.login
      )}`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('OAuth failed');
  }
});

// ===== Upload Endpoint =====
app.post('/api/upload', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'starform_uploads',
    });

    fs.unlinkSync(req.file.path); // cleanup local file
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ===== Serve Frontend in Production =====
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('.*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// ===== Start Server =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ OAuth server running on http://localhost:${PORT}`);
});
