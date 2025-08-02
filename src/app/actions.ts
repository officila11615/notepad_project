"use server";

import { summarizeNote } from "@/ai/flows/summarize-note";

export async function getSummary(noteContent: string): Promise<string> {
  if (!noteContent.trim()) {
    return "Please provide some content to summarize.";
  }
  try {
    const { summary } = await summarizeNote({ noteContent });
    return summary;
  } catch (error) {
    console.error("Error summarizing note:", error);
    return "Sorry, I was unable to summarize the note at this time.";
  }
}
