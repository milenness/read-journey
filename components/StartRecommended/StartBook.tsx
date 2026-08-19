"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addRecommendedBookById,
  removeBookFromLibrary,
  getMyLibraryBooks,
} from "@/lib/api";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import css from "./StartRecommended.module.css";
import { IBook } from "@/types/book";

interface StartBookProps {
  data: IBook;
}

const formatTitle = (text: string) => {
  if (!text) return "";
  let formatted = text.toLowerCase();
  formatted = formatted.replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) =>
    match.toUpperCase(),
  );
  formatted = formatted.replace(/\beurope\b/gi, "Europe");
  formatted = formatted.replace(/\bukraine\b/gi, "Ukraine");
  return formatted;
};

export default function StartBook({ data }: StartBookProps) {
  const { _id, title, author, imageUrl, totalPages } = data;
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedTitle = formatTitle(title);

  // Отримуємо список книг бібліотеки для перевірки, чи книга вже додана
  const { data: libraryBooksResponse } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const libraryBooks: IBook[] = Array.isArray(libraryBooksResponse)
    ? libraryBooksResponse
    : libraryBooksResponse?.results || [];

  // Шукаємо, чи є книга в бібліотеці (за _id або назвою)
  const existingBookInLibrary = libraryBooks.find(
    (b) =>
      b._id === _id ||
      b.title.toLowerCase().trim() === title.toLowerCase().trim(),
  );

  const libraryBookId = existingBookInLibrary?._id || _id;
  const isAlreadyInLibrary = Boolean(existingBookInLibrary);

  // Мутація для додавання
  const { mutate: addToLibrary, isPending: isAdding } = useMutation({
    mutationFn: () => addRecommendedBookById(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
      toast.success("Book was successfully added to your library!");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to add the book or it is already in your library.");
    },
  });

  // Мутація для видалення (якщо вже в бібліотеці)
  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => removeBookFromLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
      toast.success("Book was successfully removed from your library.");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to remove the book. Please try again.");
    },
  });

  return (
    <>
      <li className={css.startItem} onClick={() => setIsModalOpen(true)}>
        <div className={css.bookImageWrapper}>
          {imageUrl && imageUrl.trim() !== "" && (
            <Image
              src={imageUrl}
              alt={`Cover of the book ${title}`}
              width={71}
              height={107}
              className={css.bookImage}
              loading="eager"
              unoptimized
            />
          )}
        </div>
        <h4 className={css.bookTitle} title={formattedTitle}>
          {formattedTitle}
        </h4>
        <h5 className={css.bookAuthor} title={author}>
          {author}
        </h5>
      </li>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={css.modalImageWrapper}>
          {imageUrl && imageUrl.trim() !== "" && (
            <Image
              src={imageUrl}
              alt={title}
              width={137}
              height={208}
              className={css.modalImage}
              unoptimized
            />
          )}
        </div>
        <h2 className={css.modalTitle} title={formattedTitle}>
          {formattedTitle}
        </h2>
        <h3 className={css.modalAuthor} title={author}>
          {author}
        </h3>
        <span className={css.modalPages}>{totalPages} pages</span>

        {/* Динамічна кнопка залежно від того, чи є книга в бібліотеці */}
        {isAlreadyInLibrary ? (
          <button
            className={css.addButton}
            type="button"
            onClick={() => deleteBook(libraryBookId)}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader /> : "Remove from library"}
          </button>
        ) : (
          <button
            className={css.addButton}
            type="button"
            onClick={() => addToLibrary()}
            disabled={isAdding}
          >
            {isAdding ? <Loader /> : "Add to library"}
          </button>
        )}
      </Modal>
    </>
  );
}
