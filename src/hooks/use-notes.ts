
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/types';

const STORAGE_KEY = 'noteflow-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes).sort((a: Note, b: Note) => b.updatedAt - a.updatedAt));
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedNotes));
      } catch (error) {
        console.error("Failed to save notes to localStorage", error);
      }
    }
  }, [notes, isLoaded]);

  const addNote = useCallback((title: string, content: string) => {
    const timestamp = Date.now();
    const newNote: Note = {
      id: `note-${timestamp}`,
      title,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setNotes(prevNotes => [newNote, ...prevNotes].sort((a, b) => b.updatedAt - a.updatedAt));
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, title: string, content: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, title, content, updatedAt: Date.now() } : note
      ).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }, []);

  return { notes, isLoaded, addNote, updateNote, deleteNote };
}
