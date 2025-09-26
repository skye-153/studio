'use client';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';

export function UserNav() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
  const { state, toggleSidebar } = useSidebar();


  return (
    <div className={cn(
      "flex w-full items-center",
       state === 'collapsed' && "justify-center"
    )}>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(
            "justify-start items-center gap-3 p-2",
            state === 'expanded' ? "w-full" : "size-8 p-0"
        )}>
           <Avatar className="h-8 w-8">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="@shadcn" data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>TV</AvatarFallback>
          </Avatar>
           <div className={cn(
               "flex flex-col items-start",
                state === 'collapsed' && "hidden"
           )}>
            <span className="text-sm font-medium leading-none">Test User</span>
            <span className="text-xs leading-none text-muted-foreground">
              test@example.com
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Test User</p>
            <p className="text-xs leading-none text-muted-foreground">
              test@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
     <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("size-8 shrink-0 text-muted-foreground transition-transform group-hover/sidebar:text-foreground",
            state === 'collapsed' && 'hidden'
          )}>
        <ChevronsLeft />
    </Button>
    </div>
  );
}
