import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { eq, sql, desc, asc } from 'drizzle-orm';

// Updated article status enum
export const articleStatusEnum = pgEnum('article_status', [
  'Relevant',
  'Not Relevant',
  'Ungraded'
]);

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  published_date: timestamp('published_date').notNull(),
  relevance_score: integer('relevance_score').notNull(),
  status: articleStatusEnum('status').notNull(),
  url: text('url').notNull()
});

export type Article = typeof articles.$inferSelect;

const sqlClient = neon(process.env.POSTGRES_URL!);
const db = drizzle(sqlClient);

export async function getArticles(
  search: string, 
  offset: number,
  sortKey?: string,
  sortDirection?: string
) {
  const limit = 10;
  const whereClause = search ? sql`title ILIKE ${`%${search}%`}` : sql`TRUE`;

  let orderByClause;
  if (sortKey && sortDirection) {
    const isAsc = sortDirection.toLowerCase() === 'asc';
    
    switch (sortKey) {
      case 'title':
        orderByClause = isAsc ? asc(articles.title) : desc(articles.title);
        break;
      case 'published_date':
        orderByClause = isAsc ? asc(articles.published_date) : desc(articles.published_date);
        break;
      case 'relevance_score':
        orderByClause = isAsc ? asc(articles.relevance_score) : desc(articles.relevance_score);
        break;
      case 'status':
        orderByClause = isAsc ? asc(articles.status) : desc(articles.status);
        break;
      default:
        orderByClause = desc(articles.published_date);
    }
  } else {
    orderByClause = desc(articles.published_date);
  }

  const [articlesResult, countResult] = await Promise.all([
    db.select()
      .from(articles)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(orderByClause),
    db.select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .where(whereClause)
  ]);

  return {
    articles: articlesResult,
    totalArticles: countResult[0].count
  };
}

export async function updateArticleStatus(articleId: number, newStatus: Article['status']) {
  await db.update(articles)
    .set({ status: newStatus })
    .where(eq(articles.id, articleId));
}

export async function deleteArticle(articleId: number) {
  await db.delete(articles).where(eq(articles.id, articleId));
}

export async function insertArticle(article: Omit<Article, 'id'>) {
  const result = await db.insert(articles).values(article).returning();
  return result[0];
}