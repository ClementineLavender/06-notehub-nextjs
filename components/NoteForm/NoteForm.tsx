'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { NewNoteData, NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'];

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  tag: Yup.string()
    .oneOf(TAGS, 'Invalid tag')
    .required('Tag is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters'), 
});

interface NoteFormProps {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const initialValues: NewNoteData = {
    title: '',
    tag: TAGS[0],
    content: '',
  };

  const mutation = useMutation({
    mutationFn: (newNote: NewNoteData) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });

  const handleSubmit = (values: NewNoteData) => {
    mutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.field}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.field}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              {TAGS.map((tagOption) => (
                <option key={tagOption} value={tagOption}>
                  {tagOption}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.field}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={4}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelBtn}
              onClick={onCancel}
              disabled={mutation.isPending || isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitBtn}
              disabled={mutation.isPending || isSubmitting}
            >
              {mutation.isPending ? 'Saving...' : 'Create Note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}