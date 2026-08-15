"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";
import css from "./StartRecommended.module.css"; // або твої стилі сайдбару
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
  const { title, author, imageUrl, totalPages } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedTitle = formatTitle(title);

  return (
    <>
      <li className={css.startItem} onClick={() => setIsModalOpen(true)}>
        <Image
          src={imageUrl}
          alt={`Cover of the book ${title}`}
          width={71}
          height={107}
          className={css.bookImage}
          loading="eager"
          unoptimized
          style={{ width: "auto" }}
        />
        <h4 className={css.bookTitle} title={formattedTitle}>
          {formattedTitle}
        </h4>
        <h5 className={css.bookAuthor} title={author}>
          {author}
        </h5>
      </li>

      {/* Якщо в сайдбарі теж потрібна модалка по кліку — вона тут є, аналогічно до Book */}
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
        <button className={css.addButton} type="button">
          Add to library
        </button>
      </Modal>
    </>
  );
}
