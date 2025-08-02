import { NoteFlowApp } from '@/components/note-flow-app';

export default function NotePage({ params }: { params: { noteId: string } }) {
  return (
    <main className="min-h-screen">
      <NoteFlowApp initialNoteId={params.noteId} />
    </main>
  );
}
