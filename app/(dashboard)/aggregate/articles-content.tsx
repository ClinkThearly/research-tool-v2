'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TabsContent } from '@/components/ui/tabs';
import { ArticlesTable } from './articles-table';
import { Article } from '@/lib/db';

type ArticlesContentProps = {
  initialArticles: Article[];
  initialOffset: number;
  totalArticles: number;
};

export function ArticlesContent({ 
  initialArticles, 
  initialOffset, 
  totalArticles 
}: ArticlesContentProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [offset, setOffset] = useState(initialOffset);
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.get('q') ?? '';
    const newOffset = Number(searchParams.get('offset')) || 0;
    
    // In a real-world scenario, you might want to fetch new data here
    // based on the search params. For now, we'll just update the state
    // with the initial data.
    setArticles(initialArticles);
    setOffset(newOffset);
  }, [searchParams, initialArticles]);

  // Helper function to filter articles with type-safe status
  const filterArticles = (status: Article['status']) =>
    articles.filter((article) => article.status === status);

  return (
    <>
      <TabsContent value="all">
        <ArticlesTable
          articles={articles}
          offset={offset}
          totalArticles={totalArticles}
        />
      </TabsContent>
      <TabsContent value="relevant">
        <ArticlesTable
          articles={filterArticles('Relevant')}
          offset={offset}
          totalArticles={totalArticles}
        />
      </TabsContent>
      <TabsContent value="not-relevant">
        <ArticlesTable
          articles={filterArticles('Not Relevant')}
          offset={offset}
          totalArticles={totalArticles}
        />
      </TabsContent>
      <TabsContent value="ungraded">
        <ArticlesTable
          articles={filterArticles('Ungraded')}
          offset={offset}
          totalArticles={totalArticles}
        />
      </TabsContent>
    </>
  );
}