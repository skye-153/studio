
'use client';

import Link from 'next/link';
import {
  Bell,
  Home,
  BarChart3,
  Database,
  BrainCircuit,
  SquareTerminal,
  PanelLeft,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation';
import { DashboardStateProvider } from './context/DashboardStateContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navLinks = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/analysis', icon: BarChart3, label: 'Analysis' },
    { href: '/dashboard/data-sources', icon: Database, label: 'Data Sources' },
    { href: '/dashboard/insights', icon: BrainCircuit, label: 'AI Insights' },
    { href: '/dashboard/query-tool', icon: SquareTerminal, label: 'Query Tool' },
  ];

  return (
    <DashboardStateProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-headline text-lg">Terminal Vision</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navLinks.map(link => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="flex md:hidden" />
            <div className="w-full flex-1">
              {/* Can add search here */}
            </div>
            <ThemeToggle />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardStateProvider>
  );
}
