"use client";

import { useId, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { addBookToLibrary } from "@/lib/api";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import css from "./AddBook.module.css";
import { useQueryClient } from "@tanstack/react-query";

export default function AddBook() {
  const titleId = useId();
  const authorId = useId();
  const pagesId = useId();

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString().trim() || "";
    const author = formData.get("author")?.toString().trim() || "";
    const pagesStr = formData.get("pages")?.toString().trim() || "";
    const pages = pagesStr ? Number(pagesStr) : undefined;

    if (!title || !author || !pages) {
      toast.error("Please fill in all fields to add a book.");
      return;
    }

    if (pages <= 0 || pages > 10000) {
      toast.error("Number of pages must be between 1 and 10000.");
      return;
    }

    try {
      setIsLoading(true);

      // Відправляємо напряму на бекенд на /books/add згідно з ТЗ та Swagger
      await addBookToLibrary({
        title,
        author,
        totalPages: pages,
      });

      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });

      setIsSuccessModalOpen(true);
      form.reset();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        "Oops! Something went wrong while adding the book.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={css.filtersContainer}>
        <h4 className={css.filtersTitle}>Create your library:</h4>

        <form onSubmit={handleSubmit} className={css.form}>
          <div className={css.inputWrapper}>
            <label htmlFor={titleId} className={css.label}>
              Book title:
            </label>
            <input
              id={titleId}
              name="title"
              type="text"
              placeholder="Enter text"
              className={css.input}
              maxLength={100}
              required
            />
          </div>

          <div className={css.inputWrapper}>
            <label htmlFor={authorId} className={css.label}>
              The author:
            </label>
            <input
              id={authorId}
              name="author"
              type="text"
              placeholder="Enter text"
              className={css.input}
              maxLength={100}
              required
            />
          </div>

          <div className={css.inputWrapper}>
            <label htmlFor={pagesId} className={css.label}>
              Number of pages:
            </label>
            <input
              id={pagesId}
              name="pages"
              type="number"
              min="1"
              max="10000"
              placeholder="Enter number"
              className={css.input}
              required
            />
          </div>

          <button type="submit" className={css.submitBtn} disabled={isLoading}>
            {isLoading ? <Loader /> : "Add book"}
          </button>
        </form>
      </div>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <span role="img" aria-label="Like" className={css.likeImg}>
          👍
        </span>
        <h2 className={css.modalTitle}>Good job</h2>
        <p className={css.modalText}>
          Your book is now in <span className={css.accent}>the library!</span>{" "}
          The joy knows no bounds and now you can start your training
        </p>
      </Modal>
    </>
  );
}
