"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import css from "./Book.module.css";
import { IBook } from "@/types/book";

interface BookProps {
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

export default function Book({ data }: BookProps) {
  const { title, author, imageUrl, totalPages } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedTitle = formatTitle(title);

  return (
    <>
      <li className={css.book} onClick={() => setIsModalOpen(true)}>
        <Image
          src={imageUrl}
          alt={`Cover of the book ${title}`}
          width={137}
          height={208}
          className={css.bookImage}
        />
        <h4 className={css.bookTitle} title={formattedTitle}>
          {formattedTitle}
        </h4>
        <h5 className={css.bookAuthor} title={author}>
          {author}
        </h5>
      </li>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Image
          src={imageUrl}
          alt={title}
          width={137}
          height={208}
          className={css.modalImage}
        />
        <h2 className={css.modalTitle} title={formattedTitle}>
          {formattedTitle}
        </h2>
        <h3 className={css.modalAuthor} title={author}>
          {author}
        </h3>

        <span className={css.modalPages}>{totalPages} pages</span>

        <button className={css.addButton} type="button">Add to library</button>
      </Modal>
    </>
  );
}
