'use client';

import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { NewNoteData, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

// Масив допустимих тегів для випадаючого списку (select)
const TAGS: NoteTag[] = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];

interface NoteFormProps {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Встановлюємо дефолтне значення з першого елемента масиву TAGS
  const [tag, setTag] = useState<NoteTag>(TAGS[0]);

  const mutation = useMutation({
    mutationFn: (newNote: NewNoteData) => createNote(newNote),
    onSuccess: () => {
      // Оновлюємо кеш запиту нотаток, щоб нова нотатка одразу з'явилася в списку
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel(); // Закриваємо модалку
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    mutation.mutate({
      title,
      content,
      tag,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.field}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={css.field}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={tag}
          // Явно кастуємо значення e.target.value до типу NoteTag
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.field}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelBtn}
          onClick={onCancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitBtn}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}