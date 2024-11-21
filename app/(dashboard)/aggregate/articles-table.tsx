import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Article } from "@/lib/db"
import { Article as ArticleComponent } from "./article"

type ArticlesTableProps = {
  articles: Article[];
  offset: number;
  totalArticles: number;
};

export function ArticlesTable({ articles, offset, totalArticles }: ArticlesTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead>Relevance Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <ArticleComponent 
              key={article.id} 
              {...article} 
              published_date={article.published_date.toISOString()} 
            />
          ))}
        </TableBody>
      </Table>
      <div className="text-sm text-muted-foreground">
        Showing {offset + 1}-{Math.min(offset + articles.length, totalArticles)} of {totalArticles} articles
      </div>
    </div>
  )
}