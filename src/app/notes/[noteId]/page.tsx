
'use client';

import { useNotes } from '@/hooks/use-notes';
import { NoteEditor } from '@/components/note-editor';
import { getSummary } from '@/app/actions';
import { useParams, useRouter } from 'next/navigation';

export default function NotePage() {
  const { notes, updateNote, deleteNote, isLoaded } = useNotes();
  const router = useRouter();
  const params = useParams();
  
  const noteId = params.noteId as string;
  const note = isLoaded ? notes.find(n => n.id === noteId) : undefined;

  const handleUpdateNote = (id: string, title: string, content: string) => {
    updateNote(id, title, content);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    router.push('/notes');
  };

  const handleSummarizeNote = async (content: string) => {
    return await getSummary(content);
  };
  
  if (isLoaded && !note) {
    // Redirect if the note doesn't exist after loading is complete
    router.replace('/notes');
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <NoteEditor
        note={note ?? null}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
        onSummarize={handleSummarizeNote}
      />
    </main>
  );
}
