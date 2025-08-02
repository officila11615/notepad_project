"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import type { Note } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Sparkles, Loader2, NotebookPen } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onSummarize: (content: string) => Promise<string>;
}

export function NoteEditor({ note, onUpdate, onDelete, onSummarize }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSummarizing, startSummarizeTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const { toast } = useToast();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (note) {
      debounceTimeout.current = setTimeout(() => {
        onUpdate(note.id, title, content);
      }, 1000);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [title, content, note, onUpdate]);

  const handleDelete = () => {
    if (note) {
      onDelete(note.id);
      toast({
        title: "Note Deleted",
        description: `"${note.title}" has been moved to trash.`,
      });
    }
  };

  const handleSummarize = () => {
    if (note && note.content.trim().length > 0) {
      startSummarizeTransition(async () => {
        const result = await onSummarize(note.content);
        setSummary(result);
        setIsSummaryDialogOpen(true);
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Cannot summarize",
        description: "Please write some content before summarizing.",
      });
    }
  };

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
        <NotebookPen className="w-16 h-16 mb-4 text-primary/50" />
        <h2 className="text-xl font-medium">Select a note to view or edit</h2>
        <p className="text-sm">Or create a new one to get started.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDate(note.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSummarize} disabled={isSummarizing} className="text-accent hover:text-accent hover:bg-accent/10">
                  {isSummarizing ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Sparkles className="h-4 w-4" />}
                  <span className="sr-only">Summarize Note</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Summarize Note (AI)</p>
              </TooltipContent>
            </Tooltip>
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Note</span>
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Note</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your note titled "{note.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>
        <div className="flex-grow flex flex-col p-4 md:p-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="text-2xl md:text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto mb-4 bg-transparent"
          />
          <ScrollArea className="flex-grow">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="flex-grow w-full h-full resize-none border-none shadow-none focus-visible:ring-0 px-0 text-base leading-relaxed bg-transparent"
            />
          </ScrollArea>
        </div>
      </div>

      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-md border-primary glow-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> AI Summary</DialogTitle>
            <DialogDescription>
              Here's a summary of your note.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4">
            {isSummarizing ? (
              <div className="space-y-2 pr-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap pr-4">{summary}</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
