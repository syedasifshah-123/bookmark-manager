import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db/index.js';
import categoriesRouter from './routes/categories.js';
import bookmarksRouter from './routes/bookmarks.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/bookmarks', bookmarksRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ DB init failed:', err);
    process.exit(1);
});
