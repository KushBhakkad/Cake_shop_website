import express from 'express';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

const db = new pg.Client({
  user: process.env.POSTGRESQL_ADDON_USER,
  host: process.env.POSTGRESQL_ADDON_HOST,
  database: process.env.POSTGRESQL_ADDON_DB,
  password: process.env.POSTGRESQL_ADDON_PASSWORD,
  port: process.env.POSTGRESQL_ADDON_PORT,
});

db.connect();

app.use(express.static(path.join(__dirname, '/public')));
const upload = multer();
app.use(upload.none());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/book-a-table', async (req, res) => {
  const { name, occasion, phone, date, time, size, message } = req.body;

  const query = `
    INSERT INTO bookings (name, occasion, phone, date, time, size, message)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  try {
    await db.query(query, [name, occasion, phone, date, time, size, message]);
    res.json({ success: true, message: 'Your booking request was sent. We will call back to confirm your Order. Thank you!' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'There was an error processing your request.' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
