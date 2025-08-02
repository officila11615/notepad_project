
'use client';

import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, Trash2, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function NotesPage() {
  const { notes, addNote, deleteNote, isLoaded } = useNotes();
  const router = useRouter();
  const { toast } = useToast();

  const handleAddNote = () => {
    const newNoteId = addNote();
    router.push(`/notes/${newNoteId}`);
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation(); // prevent card click
    deleteNote(id);
    toast({
      title: "Note Deleted",
      description: `"${title}" has been moved to trash.`,
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4 sm:mb-0">
            Your Notes
          </h1>
          <div className="flex items-center gap-4">
             <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
            </Button>
            <Button onClick={handleAddNote} className="glow-sm hover:glow-md transition-all">
              <FilePlus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
        </header>

        {isLoaded && notes.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">No notes yet.</h2>
            <p className="text-muted-foreground mb-4">Create your first note to get started.</p>
            <Button onClick={handleAddNote} size="lg" className="glow-md hover:glow-lg transition-all">
              Create a Note <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map(note => (
              <Card 
                key={note.id} 
                className="bg-card/80 hover:bg-card/100 border-border/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col glow-sm hover:glow-md"
                onClick={() => router.push(`/notes/${note.id}`)}
              >
                <CardHeader>
                  <CardTitle className="truncate">{note.title || 'Untitled Note'}</CardTitle>
                  <CardDescription>Last updated: {formatDate(note.updatedAt)}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDeleteNote(e, note.id, note.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete note</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
