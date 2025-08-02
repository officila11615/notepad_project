"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { NoteList } from './note-list';
import { NoteEditor } from './note-editor';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus, BookText } from 'lucide-react';
import { getSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface NoteFlowAppProps {
  initialNoteId: string;
}

export function NoteFlowApp({ initialNoteId }: NoteFlowAppProps) {
  const { notes, isLoaded, addNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initialNoteId);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (initialNoteId) {
      setSelectedNoteId(initialNoteId);
    }
  }, [initialNoteId]);

  useEffect(() => {
    if (selectedNoteId && selectedNoteId !== initialNoteId) {
      router.push(`/notes/${selectedNoteId}`);
    }
  }, [selectedNoteId, initialNoteId, router]);


  const handleAddNote = () => {
    const newNoteId = addNote();
    setSelectedNoteId(newNoteId);
  };

  const handleDeleteNote = (id: string) => {
    const index = notes.findIndex(n => n.id === id);
    deleteNote(id);
    if (selectedNoteId === id) {
      const newNotes = notes.filter(n => n.id !== id);
      if (newNotes.length > 0) {
        // select the previous note or the first one
        const newSelectedId = newNotes[Math.max(0, index - 1)].id;
        setSelectedNoteId(newSelectedId);
      } else {
        setSelectedNoteId(null);
        // create a new one if all are deleted
        const newNoteId = addNote();
        setSelectedNoteId(newNoteId);
      }
    }
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    updateNote(id, title, content);
  };

  const handleSummarizeNote = async (content: string) => {
    const summary = await getSummary(content);
    return summary;
  };

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchTerm]);
  
  const selectedNote = useMemo(() => {
    return notes.find(note => note.id === selectedNoteId) ?? null;
  }, [selectedNoteId, notes]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <BookText className="w-6 h-6 text-primary glow-sm" />
              <h1 className="text-xl font-bold">NoteFlow</h1>
            </div>
          </div>
          <div className="px-2 pb-2 flex items-center gap-2">
            <Button onClick={handleAddNote} className="w-full glow-sm transition-all hover:glow-md">
              <FilePlus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
          <div className="p-2">
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NoteList
            notes={filteredNotes}
            isLoaded={isLoaded}
            activeNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="h-full w-full bg-card/50 backdrop-blur-sm border-l border-border/50">
          <NoteEditor
            note={selectedNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
            onSummarize={handleSummarizeNote}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
