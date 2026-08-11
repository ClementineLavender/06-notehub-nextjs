import axios from "axios";
import type { Note, NewNoteData } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  searchQuery: string = ""
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    params: { page, search: searchQuery, perPage: 12 },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

export const createNote = async (newNote: NewNoteData): Promise<Note> => {
  const response = await axios.post<Note>(BASE_URL, newNote, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};