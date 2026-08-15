"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addRecommendedBookById } from "@/lib/api";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader/Loader";
import css from "./Book.module.css";
import { IBook } from "@/types/book";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedTitle = formatTitle(title);

  // Мутація для додавання (використовується, якщо книга з рекомендацій)
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

  const handleStartReading = () => {
    // Тут ти можеш прописати логіку переходу на сторінку читання або відкриття іншої модалки
    toast.success(`Starting to read "${formattedTitle}"!`);
    setIsModalOpen(false);
  };

  return (
    <>
      <li className={css.book} onClick={() => setIsModalOpen(true)}>
        <Image
          src={imageUrl}
          alt={`Cover of the book ${title}`}
          width={137}
          height={208}
          className={css.bookImage}
          unoptimized
        />
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
              className={css.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(_id);
              }}
            />
          )}
        </div>
      </li>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Image
          src={imageUrl}
          alt={title}
          width={137}
          height={208}
          className={css.modalImage}
          unoptimized
        />
        <h2 className={css.modalTitle} title={formattedTitle}>
          {formattedTitle}
        </h2>
        <h3 className={css.modalAuthor} title={author}>
          {author}
        </h3>

        <span className={css.modalPages}>{totalPages} pages</span>

   
        {showDeleteBtn ? (
          <button
            className={css.addButton}
            type="button"
            onClick={handleStartReading}
          >
            Start reading
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
