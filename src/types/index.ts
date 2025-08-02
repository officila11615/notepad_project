export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  imageUrl?: string | null;
  videoUrl?: string | null;
}
