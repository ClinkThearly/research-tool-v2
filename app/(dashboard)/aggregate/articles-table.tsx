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
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';

type ArticlesTableProps = {
  articles: Article[];
  offset: number;
  totalArticles: number;
};

type SortConfig = {
  key: keyof Article | null;
  direction: 'asc' | 'desc' | null;
};

export default function ArticlesTable({ articles: initialArticles, offset, totalArticles }: ArticlesTableProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const productsPerPage = 10;

  // Update articles when initialArticles prop changes
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  function prevPage() {
    const newOffset = Math.max(0, offset - productsPerPage);
    router.push(`${pathname}?offset=${newOffset}`, { scroll: false });
  }

  function nextPage() {
    const newOffset = offset + productsPerPage;
    router.push(`${pathname}?offset=${newOffset}`, { scroll: false });
  }

  const sortData = (key: keyof Article) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortedArticles = () => {
    if (!sortConfig.key || !sortConfig.direction) return articles;

    return [...articles].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (columnKey: keyof Article) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="h-4 w-4 ml-2" />;
    if (sortConfig.direction === 'asc') return <ChevronUp className="h-4 w-4 ml-2" />;
    if (sortConfig.direction === 'desc') return <ChevronDown className="h-4 w-4 ml-2" />;
    return <ChevronsUpDown className="h-4 w-4 ml-2" />;
  };

  const sortedArticles = getSortedArticles();

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
            {sortedArticles.map((article) => {
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