"use client";

import { useId, useState } from "react";
import toast from "react-hot-toast";
import {
  getRecommendedBooks,
  addRecommendedBookById,
  getMyLibraryBooks,
} from "@/lib/api";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import css from "./AddBook.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { IBook } from "@/types/book";

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

    if (!title && !author && !pages) {
      toast.error(
        "Please fill in at least one field to search and add a book.",
      );
      return;
    }

    if (pages !== undefined && (pages <= 0 || pages > 10000)) {
      toast.error("Number of pages must be between 1 and 10000.");
      return;
    }

    try {
      setIsLoading(true);

      const searchResult = await getRecommendedBooks({
        title: title || undefined,
        author: author || undefined,
        limit: 50,
      });

      const booksList = searchResult?.results || [];

      if (booksList.length === 0) {
        toast.error("Sorry, no books found matching your query.");
        setIsLoading(false);
        return;
      }

      const foundBook = booksList.find((book) => {
        const matchTitle = title
          ? book.title.toLowerCase().includes(title.toLowerCase())
          : true;
        const matchAuthor = author
          ? book.author.toLowerCase().includes(author.toLowerCase())
          : true;
        const matchPages = pages ? book.totalPages === pages : true;

        return matchTitle && matchAuthor && matchPages;
      });

      if (!foundBook) {
        toast.error(
          "No exact match found in recommendations. Please check the spelling.",
        );
        setIsLoading(false);
        return;
      }

      const response = await getMyLibraryBooks();
      const currentBooks = Array.isArray(response)
        ? response
        : response.results || [];

      const normalizedFoundTitle = foundBook.title
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      const isAlreadyInLibrary = currentBooks.some((b: IBook) => {
        const normalizedExistingTitle = b.title
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();
        return (
          b._id === foundBook._id ||
          normalizedExistingTitle === normalizedFoundTitle
        );
      });

      if (isAlreadyInLibrary) {
        toast.error("This book is already in your library!");
        setIsLoading(false);
        return;
      }

      await addRecommendedBookById(foundBook._id);

      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });

      setIsSuccessModalOpen(true);
      form.reset();
    } catch (error) {
      toast.error("Oops! Something went wrong while adding the book.");
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
