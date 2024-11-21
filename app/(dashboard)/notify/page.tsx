import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import { AlertTriangle } from 'lucide-react';
  
  export default function NotifyPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Notify</span>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardTitle>
          <CardDescription>Efficient internal communication of vetted studies.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is currently under construction. Once completed, you'll be able to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
            <li>Push notifications about newly vetted studies to team members</li>
            <li>Customize notification preferences and recipients</li>
            <li>Track engagement with shared research</li>
          </ul>
        </CardContent>
      </Card>
    );
  }