'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotesRedirectPage() {
  const { notes, isLoaded, addNote } = useNotes();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (notes.length > 0) {
        const latestNote = notes.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        router.replace(`/notes/${latestNote.id}`);
      } else {
        const newNoteId = addNote();
        router.replace(`/notes/${newNoteId}`);
      }
    }
  }, [isLoaded, notes, router, addNote]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 w-1/2">
        <h1 className="text-2xl font-bold text-center">Loading your notes...</h1>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
