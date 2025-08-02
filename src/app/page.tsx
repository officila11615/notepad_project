import { Button } from '@/components/ui/button';
import { BookText } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <BookText className="w-12 h-12 text-primary glow-md" />
        </div>
        <h1 className="text-5xl font-bold">Welcome to NoteFlow</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Your modern notepad for seamless note-taking, powered by AI.
        </p>
        <Button asChild size="lg" className="glow-sm hover:glow-md transition-all">
          <Link href="/notes">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
