import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import { AlertTriangle } from 'lucide-react';
  
  export default function ChartPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Chart</span>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardTitle>
          <CardDescription>Advanced data extraction, visualization, and analysis tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is currently under construction. Once completed, you'll be able to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Extract key data points from vetted studies</li>
            <li>Create interactive visualizations and charts</li>
            <li>Save and share insights derived from the data</li>
          </ul>
        </CardContent>
      </Card>
    );
  }