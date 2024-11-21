import { Suspense } from 'react';
import { use } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticlesTable } from './articles-table';
import { getArticles } from '@/lib/db';
import { headers } from 'next/headers';

export default function AggregatePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const headersList = use(headers());
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('x-forwarded-host') || '';
  const cookie = headersList.get('cookie') || '';

  const search = typeof searchParams.q === 'string' ? searchParams.q : '';
  const offsetParam = typeof searchParams.offset === 'string' ? searchParams.offset : '0';
  const offset = parseInt(offsetParam, 10) || 0;
  
  const { articles, totalArticles } = use(getArticles(search, offset));

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="relevant">Relevant</TabsTrigger>
          <TabsTrigger value="not-relevant">Not Relevant</TabsTrigger>
          <TabsTrigger value="ungraded">Ungraded</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
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
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ArticlesTable 
          articles={articles}
          offset={offset}
          totalArticles={totalArticles}
        />
      </Suspense>
    </Tabs>
  );
}

