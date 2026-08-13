"use client";

import Image from "next/image";
import css from "./Book.module.css";
import { IBook } from "@/types/book";

interface BookProps {
  data: IBook;
}

export default function Book({ data }: BookProps) {
  const { title, author, imageUrl } = data;

  const formattedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  return (
    <li className={css.book}>
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
  );
}
