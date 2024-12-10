import { Suspense } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticlesTable from './articles-table';
import { getArticles } from '@/lib/db';

export default async function AggregatePage(
  props: {
    searchParams: Promise<{ q?: string; offset?: string; sort?: string; direction?: string }>
  }
) {
  // Await the incoming searchParams, as done in the original snippet.
  const searchParams = await props.searchParams;
  
  const search = searchParams.q ?? '';
  const offsetStr = searchParams.offset ?? '0';
  const offset = Number(offsetStr);

  const sortKey = searchParams.sort;
  const sortDirection = searchParams.direction;

  // Fetch articles based on the extracted params
  const { articles, totalArticles } = await getArticles(
    search,
    offset,
    sortKey,
    sortDirection
  );

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
