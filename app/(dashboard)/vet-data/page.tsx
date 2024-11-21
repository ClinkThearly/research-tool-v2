import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import { AlertTriangle } from 'lucide-react';
  
  export default function VetDataPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Vet Data</span>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardTitle>
          <CardDescription>Rigorous verification and validation of ingested studies.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is currently under construction. Once completed, you'll be able to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Review and verify the accuracy of ingested studies</li>
            <li>Apply validation criteria to ensure data quality</li>
            <li>Flag and address potential issues in research data</li>
          </ul>
        </CardContent>
      </Card>
    );
  }