'use client';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className={css.container}>
      <input
        type="text"
        className={css.input}
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}