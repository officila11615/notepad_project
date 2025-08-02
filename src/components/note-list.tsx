"use client";

import type { Note } from '@/types';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NoteListProps {
  notes: Note[];
  isLoaded: boolean;
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
}

export function NoteList({ notes, isLoaded, activeNoteId, onSelectNote }: NoteListProps) {
  if (!isLoaded) {
    return (
      <div className="p-2 space-y-2">
        <SidebarMenuSkeleton showIcon={false} />
        <SidebarMenuSkeleton showIcon={false} />
        <SidebarMenuSkeleton showIcon={false} />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notes yet. Create one to get started!
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <SidebarMenu>
        {notes.map(note => (
          <SidebarMenuItem key={note.id}>
            <SidebarMenuButton
              isActive={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
              className={cn(
                "h-auto py-2 flex-col items-start transition-all",
                note.id === activeNoteId && "glow-sm"
              )}
            >
              <span className="font-semibold text-sm w-full truncate">{note.title || 'Untitled'}</span>
              <p className="text-xs text-muted-foreground w-full truncate">
                {note.content ? note.content.substring(0, 40) : 'No content'}
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </ScrollArea>
  );
}
