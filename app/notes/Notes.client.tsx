'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import css from './Notes.module.css';

export default function NotesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedSearchQuery],
    queryFn: () => fetchNotes(1, debouncedSearchQuery),
  });

  return (
    <main className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <button 
          type="button" 
          className={css.button} 
          onClick={() => setIsModalOpen(true)}
        >
          Create Note
        </button>
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Could not fetch the list of notes.</p>}
      
      {data && <NoteList notes={data.notes} />}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </main>
  );
}