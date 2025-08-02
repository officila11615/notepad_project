
import { Button } from '@/components/ui/button';
import { BookText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative w-full max-w-5xl flex flex-col items-center justify-center text-center">
        <div
          className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>

        <div className="relative z-10 space-y-6">
          <div className="inline-block p-4 bg-primary/10 rounded-full border border-primary/20 shadow-lg">
            <BookText className="w-16 h-16 text-primary glow-lg" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Welcome to <span className="text-primary">NoteFlow</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Your modern notepad for seamless note-taking, powered by AI. Unleash your creativity and let your ideas flow into the digital cosmos.
          </p>
          <Button asChild size="lg" className="btn-primary-glow group">
            <Link href="/notes">
              <span>Get Started <ArrowRight className="inline ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
