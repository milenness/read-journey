"use client";

import { useId, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import { getMyLibraryBooks, startReading, finishReading } from "@/lib/api";
import { IBook } from "@/types/book";
import css from "./AddReading.module.css";

export default function AddReading() {
  const pageInputId = useId();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data: booksResponse, isLoading: isBookLoading } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const books: IBook[] = Array.isArray(booksResponse)
    ? booksResponse
    : booksResponse?.results || [];

  const currentBook = bookIdFromUrl
    ? books.find((b) => b._id === bookIdFromUrl)
    : books.find((b) => b.status === "in-progress") || books[0];

  const bookId = currentBook?._id;
  const totalPages = currentBook?.totalPages || 0;
  const progress = currentBook?.progress || [];

  const activeSession = progress.find(
    (p) => p.finishPage === undefined || p.finishPage === null,
  );
  const isReadingActive = Boolean(activeSession);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookId) {
      toast.error("No book found to track reading.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const pageStr = formData.get("page")?.toString().trim() || "";
    const page = Number(pageStr);

    if (!pageStr || isNaN(page)) {
      toast.error("Please enter a valid page number.");
      return;
    }

    if (page <= 0 || (totalPages && page > totalPages)) {
      toast.error(`Page number must be between 1 and ${totalPages || 10000}.`);
      return;
    }

    if (isReadingActive) {
      const startPage = activeSession?.startPage || 1;

      if (page < startPage) {
        toast.error(
          `The finish page can't be less than the start page (${startPage}).`,
        );
        return;
      }
    }

    try {
      setIsLoading(true);

      if (!isReadingActive) {
        await startReading({ id: bookId, page });
        toast.success("Reading session started successfully!");
      } else {
        await finishReading({ id: bookId, page });
        toast.success("Reading session stopped.");

        if (page === totalPages) {
          setIsSuccessModalOpen(true);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
      form.reset();
    } catch (error: unknown) {
      let errorMessage = "Oops! Something went wrong. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isBookLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className={css.filtersContainer}>
        <h4 className={css.filtersTitle}>
          {isReadingActive ? "Stop page:" : "Start page:"}
        </h4>

        <form onSubmit={handleSubmit} className={css.form}>
          <div className={css.inputWrapper}>
            <label htmlFor={pageInputId} className={css.label}>
              Page number:
            </label>
            <input
              id={pageInputId}
              name="page"
              type="number"
              min="1"
              max={totalPages || 10000}
              placeholder="0"
              className={css.input}
              required
            />
          </div>

          <button type="submit" className={css.submitBtn} disabled={isLoading}>
            {isLoading ? <Loader /> : isReadingActive ? "To stop" : "To start"}
          </button>
        </form>
      </div>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <span role="img" aria-label="Like" className={css.likeImg}>
          🏆
        </span>
        <h2 className={css.modalTitle}>The book is read</h2>
        <p className={css.modalText}>
          It was an <span className={css.accent}>exciting journey</span>, where
          each page revealed new horizons, and the characters became inseparable
          friends.
        </p>
      </Modal>
    </>
  );
}
