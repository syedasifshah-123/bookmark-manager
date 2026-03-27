import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {

    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    icon: text('icon').notNull().default('📁'),
    color: text('color').notNull().default('#6366f1'),
    createdAt: text('created_at').notNull().default(new Date().toISOString()),

});

export const bookmarks = sqliteTable('bookmarks', {

    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    url: text('url').notNull(),
    description: text('description'),
    favicon: text('favicon'),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    tags: text('tags').default('[]'),
    createdAt: text('created_at').notNull().default(new Date().toISOString()),

});
