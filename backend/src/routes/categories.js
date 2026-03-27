import { Router } from 'express';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const all = await db.select().from(categories);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const result = await db.insert(categories).values({ name, icon, color });
    const newCat = await db.select().from(categories).where(eq(categories.id, Number(result.lastInsertRowid)));
    res.status(201).json(newCat[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    await db.update(categories).set({ name, icon, color }).where(eq(categories.id, parseInt(req.params.id)));
    const updated = await db.select().from(categories).where(eq(categories.id, parseInt(req.params.id)));
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.delete(categories).where(eq(categories.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
