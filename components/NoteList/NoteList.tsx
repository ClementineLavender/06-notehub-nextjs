'use client';

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteNoteMutation } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });

  if (!notes || notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          
          <p className={css.content}>{note.content}</p>
          
          <div className={css.footer}>
            <span className={css.tag}>{note.tag || "General"}</span>

            <Link href={`/notes/${note.id}`}>View details</Link>
            
            <button 
              className={css.button} 
              onClick={() => deleteNoteMutation(note.id)} 
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}