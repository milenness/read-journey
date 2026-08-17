"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMyLibraryBooks } from "@/lib/api";
import { IBook } from "@/types/book";
import Loader from "@/components/Loader/Loader";
import css from "./MyReading.module.css";

export default function MyReading() {
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("id");

  const { data: booksResponse, isLoading: isBooksLoading } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const books: IBook[] = Array.isArray(booksResponse)
    ? booksResponse
    : booksResponse?.results || [];

  // Шукаємо книгу за ID з URL, або активну, або першу
  const currentBook =
    books.find((b) => b._id === bookIdFromUrl) ||
    books.find((b) => b.status === "in-progress") ||
    books[0];

  if (isBooksLoading) {
    return (
      <div className={css.wrapper}>
        <div className={css.headerRow}>
          <h2 className={css.title}>My reading</h2>
        </div>
        <Loader />
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div className={css.wrapper}>
        <div className={css.headerRow}>
          <h2 className={css.title}>My reading</h2>
        </div>
        <p className={css.noBookText}>No book selected for reading.</p>
      </div>
    );
  }

  const { title, author, imageUrl, status, timeLeftToRead } = currentBook;
  const isReadingActive = status === "in-progress";

  // Форматуємо час, що залишився (якщо він є)
  const timeText = timeLeftToRead
    ? `${timeLeftToRead.hours} hours and ${timeLeftToRead.minutes} minutes left`
    : null;

  return (
    <div className={css.wrapper}>
      <div className={css.headerWrapper}>
        <h2 className={css.title}>My reading</h2>
        {timeText && <span className={css.timeLeft}>{timeText}</span>}
      </div>

      <div className={css.bookContent}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={137}
            height={208}
            className={css.bookImage}
            unoptimized
          />
        )}

        <h3 className={css.bookTitle} title={title}>
          {title}
        </h3>
        <h4 className={css.bookAuthor} title={author}>
          {author}
        </h4>

        <div
          className={`${css.actionButton} ${isReadingActive ? css.stopActive : ""}`}
          title={isReadingActive ? "Reading in progress" : "Reading stopped"}
        >
          <span className={isReadingActive ? css.stopIcon : css.playIcon} />
        </div>
      </div>
    </div>
  );
}
