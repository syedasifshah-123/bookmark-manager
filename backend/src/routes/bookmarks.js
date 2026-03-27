import { Router } from 'express';
import { db } from '../db/index.js';
import { bookmarks } from '../db/schema.js';
import { eq, like, or } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    if (category) {
      const all = await db.select().from(bookmarks).where(eq(bookmarks.categoryId, parseInt(category)));
      return res.json(all);
    }

    if (search) {
      const all = await db.select().from(bookmarks).where(
        or(like(bookmarks.title, `%${search}%`), like(bookmarks.url, `%${search}%`))
      );
      return res.json(all);
    }

    const all = await db.select().from(bookmarks);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, url, description, favicon, categoryId, tags } = req.body;
    const faviconUrl = favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
    const result = await db.insert(bookmarks).values({
      title,
      url,
      description,
      favicon: faviconUrl,
      categoryId: categoryId || null,
      tags: JSON.stringify(tags || []),
    });
    const newBookmark = await db.select().from(bookmarks).where(eq(bookmarks.id, Number(result.lastInsertRowid)));
    res.status(201).json(newBookmark[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, url, description, favicon, categoryId, tags } = req.body;
    await db.update(bookmarks).set({
      title, url, description, favicon,
      categoryId: categoryId || null,
      tags: JSON.stringify(tags || [])
    }).where(eq(bookmarks.id, parseInt(req.params.id)));
    const updated = await db.select().from(bookmarks).where(eq(bookmarks.id, parseInt(req.params.id)));
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.delete(bookmarks).where(eq(bookmarks.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
