import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import { AlertTriangle } from 'lucide-react';
  
  export default function CataloguePage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Catalogue</span>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardTitle>
          <CardDescription>Comprehensive research documentation and management.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is currently under construction. Once completed, you'll be able to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Upload research studies in PDF or PPT formats</li>
            <li>Add detailed metadata to each study for easy retrieval</li>
            <li>Have AI take a first pass at ingesting the study data</li>
            <li>Identify the most-chart worthy datapoints or interesting findings</li>
          </ul>
        </CardContent>
      </Card>
    );
  }