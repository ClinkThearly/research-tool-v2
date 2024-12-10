import { Suspense } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticlesTable from './articles-table';
import { getArticles } from '@/lib/db';

export default async function AggregatePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const searchQuery = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q ?? '';
  const offsetStr = Array.isArray(searchParams.offset) ? searchParams.offset[0] : searchParams.offset ?? '0';
  const offset = parseInt(offsetStr, 10) || 0;
  const sortKey = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
  const sortDirection = Array.isArray(searchParams.direction) ? searchParams.direction[0] : searchParams.direction;

  const { articles, totalArticles } = await getArticles(searchQuery, offset, sortKey, sortDirection);

  return (
    <>
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Article
          </span>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ArticlesTable 
          articles={articles}
          offset={offset}
          totalArticles={totalArticles}
          sortKey={sortKey}
          sortDirection={sortDirection as 'asc' | 'desc' | undefined}
        />
      </Suspense>
    </>
  );
}
