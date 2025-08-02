
'use client';

import { useState, useTransition, useEffect, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { FilePlus, Trash2, ArrowRight, Sparkles, Loader2, Image as ImageIcon, Video as VideoIcon, UploadCloud } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { getSummary } from '@/app/actions';
import { useAppState } from '@/context/app-state-context';

export default function NotesPage() {
  const { notes, addNote, deleteNote, isLoaded } = useNotes();
  const router = useRouter();
  const { toast } = useToast();
  const [isSummarizing, startSummarizeTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  
  // New Note State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteImage, setNewNoteImage] = useState<string | null>(null);
  const [newNoteVideo, setNewNoteVideo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { setIsBackgroundGlowing } = useAppState();

  useEffect(() => {
    setIsBackgroundGlowing(isNewNoteDialogOpen);
  }, [isNewNoteDialogOpen, setIsBackgroundGlowing]);
  
  const resetNewNoteFields = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteImage(null);
    setNewNoteVideo(null);
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        setNewNoteImage(dataUrl);
      } else if (file.type.startsWith('video/')) {
        setNewNoteVideo(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEvents = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
        processFile(file);
      } else if (file.type.startsWith('video/mp4') || file.type.startsWith('video/webm')) {
        processFile(file);
      } else {
        toast({
          variant: 'destructive',
          title: "Invalid File Type",
          description: "Please upload a JPG/PNG image or a MP4/WebM video.",
        });
      }
    }
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      toast({
        variant: 'destructive',
        title: "Cannot save note",
        description: "Please fill in both title and content.",
      });
      return;
    }
    const newNoteId = addNote(newNoteTitle, newNoteContent, newNoteImage, newNoteVideo);
    resetNewNoteFields();
    setIsNewNoteDialogOpen(false);
    toast({
      title: "Note Created",
      description: `"${newNoteTitle}" has been saved.`,
    });
    router.push(`/notes/${newNoteId}`);
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation(); // prevent card click
    deleteNote(id);
    toast({
      title: "Note Deleted",
      description: `"${title}" has been moved to the void.`,
    });
  };

  const handleSummarize = (e: React.MouseEvent, content: string) => {
    e.stopPropagation(); // prevent card click
    if (content.trim().length > 0) {
      setSummary(null);
      setIsSummaryDialogOpen(true);
      startSummarizeTransition(async () => {
        const result = await getSummary(content);
        setSummary(result);
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Cannot summarize",
        description: "Note is empty.",
      });
    }
  };
  
  const isSaveDisabled = !newNoteTitle.trim() || !newNoteContent.trim();

  return (
    <main className="min-h-screen bg-transparent text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4 sm:mb-0">
            Notes Hub
          </h1>
          <div className="flex items-center gap-4">
             <Button asChild variant="outline" className="btn-primary-glow">
                <Link href="/">Back to Home</Link>
            </Button>
            <Button onClick={() => setIsNewNoteDialogOpen(true)} className="btn-primary-glow">
              <FilePlus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
        </header>

        {isLoaded && notes.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">The void is empty.</h2>
            <p className="text-muted-foreground mb-4">Create your first note to populate the cosmos.</p>
            <Button onClick={() => setIsNewNoteDialogOpen(true)} size="lg" className="btn-primary-glow">
              <span>Create a Note <ArrowRight className="ml-2 h-5 w-5 inline" /></span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isLoaded && Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-card/80 border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                   <Skeleton className="h-8 w-8" />
                   <Skeleton className="h-8 w-8" />
                </CardFooter>
              </Card>
            ))}
            {notes.map(note => (
              <Card 
                key={note.id} 
                className="bg-card/80 hover:bg-card/100 border-border/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col glow-sm hover:glow-md"
                onClick={() => router.push(`/notes/${note.id}`)}
              >
                <CardHeader>
                  <CardTitle className="truncate flex items-center justify-between">
                    <span className="truncate">{note.title || 'Untitled Note'}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {note.imageUrl && <ImageIcon className="h-4 w-4" />}
                      {note.videoUrl && <VideoIcon className="h-4 w-4" />}
                    </div>
                  </CardTitle>
                  <CardDescription>Last updated: {formatDate(note.updatedAt)}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end items-center gap-2">
                   <Button
                      variant="ghost"
                      size="icon"
                      className="text-accent hover:text-accent hover:bg-accent/10"
                      onClick={(e) => handleSummarize(e, note.content)}
                      disabled={isSummarizing}
                      aria-label="Summarize note"
                   >
                     <Sparkles className="h-4 w-4" />
                   </Button>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDeleteNote(e, note.id, note.title)}
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

       <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-md border-primary glow-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> AI Summary</DialogTitle>
            <DialogDescription>
              Here is a summary of the note's contents.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4">
            {isSummarizing && !summary ? (
              <div className="space-y-2 pr-4 flex flex-col items-center">
                <Loader2 className="w-8 h-8 my-4 text-primary/50 animate-spin" />
                <p className="text-center text-muted-foreground">Generating summary...</p>
              </div>
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap pr-4">{summary}</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewNoteDialogOpen} onOpenChange={(isOpen) => {
          if (!isOpen) resetNewNoteFields();
          setIsNewNoteDialogOpen(isOpen);
        }}>
        <DialogContent className="sm:max-w-lg border-primary glow-sm" onDragEnter={handleDragEnter}>
          <DialogHeader>
            <DialogTitle>Create a New Note</DialogTitle>
            <DialogDescription>
              Fill in the details for your new note. You can also drag and drop media.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note-title" className="text-right">
                Title*
              </Label>
              <Input
                id="note-title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="col-span-3"
                placeholder="My awesome note title"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="note-content" className="text-right pt-2">
                Content*
              </Label>
              <Textarea
                id="note-content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="col-span-3 min-h-[120px]"
                placeholder="Start writing your note here..."
              />
            </div>
            
            <div 
              className={cn(
                "col-span-4 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors duration-300",
                isDragging && "border-primary glow-sm bg-primary/10"
              )}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragEvents}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <UploadCloud className="h-8 w-8" />
                <p className="font-semibold">Drag & drop image or video</p>
                <p className="text-xs">or click below to browse</p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                 <Input
                    id="note-image"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button asChild variant="outline" size="sm">
                    <Label htmlFor="note-image" className="cursor-pointer"><ImageIcon className="mr-2 h-4 w-4"/> Select Image</Label>
                  </Button>

                 <Input
                    id="note-video"
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button asChild variant="outline" size="sm">
                    <Label htmlFor="note-video" className="cursor-pointer"><VideoIcon className="mr-2 h-4 w-4"/> Select Video</Label>
                  </Button>
              </div>
            </div>
            
            {(newNoteImage || newNoteVideo) && (
              <div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {newNoteImage && (
                  <div className="relative group">
                    <p className="text-xs text-center mb-1 text-muted-foreground">Image Preview</p>
                    <Image src={newNoteImage} alt="Image preview" width={200} height={200} className="rounded-md object-cover w-full" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => setNewNoteImage(null)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
                {newNoteVideo && (
                  <div className="relative group">
                    <p className="text-xs text-center mb-1 text-muted-foreground">Video Preview</p>
                    <video src={newNoteVideo} controls className="rounded-md w-full" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => setNewNoteVideo(null)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAddNote} disabled={isSaveDisabled}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

