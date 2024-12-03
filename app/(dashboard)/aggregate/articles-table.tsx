'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Article } from "@/lib/db";
import ArticleComponent from "./article";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type ArticlesTableProps = {
  articles: Article[];
  offset: number;
  totalArticles: number;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
};

export default function ArticlesTable({ 
  articles: initialArticles, 
  offset, 
  totalArticles,
  sortKey: initialSortKey,
  sortDirection: initialSortDirection
}: ArticlesTableProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productsPerPage = 10;

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  function prevPage() {
    const params = new URLSearchParams(searchParams);
    const newOffset = Math.max(0, offset - productsPerPage);
    params.set('offset', newOffset.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function nextPage() {
    const params = new URLSearchParams(searchParams);
    const newOffset = offset + productsPerPage;
    params.set('offset', newOffset.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const sortData = (key: keyof Article) => {
    const params = new URLSearchParams(searchParams);
    const currentSortKey = params.get('sort');
    const currentDirection = params.get('direction');

    if (currentSortKey === key) {
      if (!currentDirection || currentDirection === 'desc') {
        params.delete('sort');
        params.delete('direction');
      } else {
        params.set('direction', 'desc');
      }
    } else {
      params.set('sort', key);
      params.set('direction', 'asc');
    }
    
    // Maintain the current offset
    if (offset) {
      params.set('offset', offset.toString());
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getSortIcon = (columnKey: keyof Article) => {
    const currentSortKey = searchParams.get('sort');
    const currentDirection = searchParams.get('direction');

    if (currentSortKey !== columnKey) return <ChevronsUpDown className="h-4 w-4 ml-2" />;
    if (currentDirection === 'asc') return <ChevronUp className="h-4 w-4 ml-2" />;
    if (currentDirection === 'desc') return <ChevronDown className="h-4 w-4 ml-2" />;
    return <ChevronsUpDown className="h-4 w-4 ml-2" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggregate</CardTitle>
        <CardDescription>
          Read through Feedly's daily articles, view AI relevance scores, and correct ratings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <Button 
                  variant="ghost" 
                  onClick={() => sortData('title')}
                  className="flex items-center hover:bg-transparent"
                >
                  Title {getSortIcon('title')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => sortData('published_date')}
                  className="flex items-center hover:bg-transparent"
                >
                  Published Date {getSortIcon('published_date')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => sortData('relevance_score')}
                  className="flex items-center hover:bg-transparent"
                >
                  Relevance Score {getSortIcon('relevance_score')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => sortData('status')}
                  className="flex items-center hover:bg-transparent"
                >
                  Status {getSortIcon('status')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {articles.map((article) => {
              const articleProps = {
                ...article,
                published_date: article.published_date.toISOString()
              };
              return <ArticleComponent key={article.id} {...articleProps} />;
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(offset + 1, totalArticles)}-{Math.min(offset + articles.length, totalArticles)} of {totalArticles} articles
          </div>
          <div className="flex gap-2">
            <Button
              onClick={prevPage}
              variant="outline"
              size="sm"
              disabled={offset === 0}
            >
              Previous
            </Button>
            <Button
              onClick={nextPage}
              variant="outline"
              size="sm"
              disabled={offset + productsPerPage >= totalArticles}
            >
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}