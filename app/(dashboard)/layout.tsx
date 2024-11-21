import Link from 'next/link';
import { Database, Library, Bell, FileCheck, BarChart, PanelLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import { EMlogo } from '@/components/icons';
import Providers from './providers';
import { SearchInput } from './search';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-foreground transition-colors hover:bg-accent md:h-8 md:w-8"
        >
          <EMlogo className="h-full w-full" />
          <span className="sr-only">EM Dashboard</span>
        </Link>

        <Link href="/aggregate" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" title="Aggregate">
          <Database className="h-5 w-5" />
          <span className="sr-only">Aggregate</span>
        </Link>

        <Link href="/catalogue" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" title="Catalogue">
          <Library className="h-5 w-5" />
          <span className="sr-only">Catalogue</span>
        </Link>

        <Link href="/notify" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" title="Notify">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notify</span>
        </Link>

        <Link href="/vet-data" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" title="Vet Data">
          <FileCheck className="h-5 w-5" />
          <span className="sr-only">Vet Data</span>
        </Link>

        <Link href="/chart" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8" title="Chart">
          <BarChart className="h-5 w-5" />
          <span className="sr-only">Chart</span>
        </Link>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-foreground transition-colors hover:bg-accent"
          >
            <EMlogo className="h-full w-full" />
            <span className="sr-only">EM Dashboard</span>
          </Link>
          <Link
            href="/aggregate"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Database className="h-5 w-5" />
            Aggregate
          </Link>
          <Link
            href="/catalogue"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Library className="h-5 w-5" />
            Catalogue
          </Link>
          <Link
            href="/notify"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            Notify
          </Link>
          <Link
            href="/vet-data"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <FileCheck className="h-5 w-5" />
            Vet Data
          </Link>
          <Link
            href="/chart"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BarChart className="h-5 w-5" />
            Chart
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}