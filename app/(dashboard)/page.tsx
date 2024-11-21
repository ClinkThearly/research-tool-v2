import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Database, Library, Bell, FileCheck, BarChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span>Aggregate</span>
          </CardTitle>
          <CardDescription>Collect and analyze research data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gather and process research data from various sources, providing a comprehensive overview of available information.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5" />
            <span>Catalogue</span>
          </CardTitle>
          <CardDescription>Organize and categorize studies</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Systematically arrange and classify research studies for easy access and reference.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span>Notify</span>
          </CardTitle>
          <CardDescription>Stay updated on research developments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Receive timely alerts and notifications about new studies, updates, and important research findings.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            <span>Vet Data</span>
          </CardTitle>
          <CardDescription>Verify and validate research data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Rigorously review and validate ingested studies to ensure data quality and accuracy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            <span>Chart</span>
          </CardTitle>
          <CardDescription>Visualize research trends and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create visual representations of research data to identify trends, patterns, and key insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}