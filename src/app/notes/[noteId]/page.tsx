
'use client';

import { useNotes } from '@/hooks/use-notes';
import { NoteEditor } from '@/components/note-editor';
import { getSummary } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function NotePage({ params }: { params: { noteId: string } }) {
  const { notes, updateNote, deleteNote, isLoaded } = useNotes();
  const router = useRouter();

  const note = notes.find(n => n.id === params.noteId);

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
    router.replace('/notes');
    return null;
  }

  return (
    <main className="min-h-screen">
      <NoteEditor
        note={note ?? null}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
        onSummarize={handleSummarizeNote}
      />
    </main>
  );
}
