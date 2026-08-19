"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addRecommendedBookById,
  removeBookFromLibrary,
  getMyLibraryBooks,
} from "@/lib/api";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import css from "./Book.module.css";
import { IBook } from "@/types/book";
import { RiDeleteBinLine } from "react-icons/ri";

interface BookProps {
  data: IBook;
  showDeleteBtn?: boolean;
  onDelete?: (id: string) => void;
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

export default function Book({ data, showDeleteBtn, onDelete }: BookProps) {
  const { _id, title, author, imageUrl, totalPages } = data;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedTitle = formatTitle(title);

  // Отримуємо список книг користувача з кешу або через запит, щоб перевірити, чи книга вже додана
  const { data: libraryBooksResponse } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const libraryBooks: IBook[] = Array.isArray(libraryBooksResponse)
    ? libraryBooksResponse
    : libraryBooksResponse?.results || [];

  // Шукаємо, чи є ця книга в бібліотеці користувача (за ід або за назвою)
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

  // Мутація для видалення (якщо вона вже в бібліотеці)
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

  const handleStartReading = () => {
    setIsModalOpen(false);
    router.push(`/library/reading?id=${libraryBookId}`);
  };

  return (
    <>
      <li className={css.book} onClick={() => setIsModalOpen(true)}>
        <div className={css.bookImageWrapper}>
          {imageUrl && imageUrl.trim() !== "" && (
            <Image
              src={imageUrl}
              alt={`Cover of the book ${title}`}
              width={137}
              height={208}
              className={css.bookImage}
              unoptimized
              loading="eager"
            />
          )}
        </div>

        <div className={css.infoContainer}>
          <div className={css.bookInfo}>
            <h4 className={css.bookTitle} title={formattedTitle}>
              {formattedTitle}
            </h4>
            <h5 className={css.bookAuthor} title={author}>
              {author}
            </h5>
          </div>
          {showDeleteBtn && (
            <button
              type="button"
              className={css.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete?.(_id);
              }}
            >
              <RiDeleteBinLine size={14} />
            </button>
          )}
        </div>
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
              loading="eager"
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

        {/* Логіка кнопок залежить від того, чи книга вже в бібліотеці */}
        {showDeleteBtn ? (
          <button
            className={css.addButton}
            type="button"
            onClick={handleStartReading}
          >
            Start reading
          </button>
        ) : isAlreadyInLibrary ? (
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
