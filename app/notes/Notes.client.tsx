'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import css from './Notes.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['notes', page, debouncedSearchQuery],
    queryFn: () => fetchNotes(page, debouncedSearchQuery),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1); 
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <button 
          type="button" 
          className={css.button} 
          onClick={() => setIsModalOpen(true)}
        >
          Create Note
        </button>
      </div>

      <NoteList notes={notes} />

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          onPageChange={handlePageClick}
          forcePage={page - 1}
        />
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}