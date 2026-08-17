"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyLibraryBooks } from "@/lib/api";
import { IBook } from "@/types/book";
import Loader from "@/components/Loader/Loader";
import css from "./MyReading.module.css";

export default function MyReading() {
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("id");

  // Отримуємо список книг з бібліотеки
  const { data: booksResponse, isLoading: isBooksLoading } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const books: IBook[] = Array.isArray(booksResponse)
    ? booksResponse
    : booksResponse?.results || [];

  const currentBook = bookIdFromUrl
    ? books.find((b) => b._id === bookIdFromUrl)
    : books.find((b) => b.status === "in-progress") || books[0];

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

  const {
    title,
    author,
    imageUrl,
    progress = [],
    timeLeftToRead,
  } = currentBook;

  // 🎯 Визначаємо активність так само надійно, як і у формі (за наявністю незавершеного сеансу)
  const activeSession = progress.find(
    (p) => p.finishPage === undefined || p.finishPage === null,
  );
  const isReadingActive = Boolean(activeSession);

  const timeText = timeLeftToRead
    ? `${timeLeftToRead.hours} hours and ${timeLeftToRead.minutes} minutes left`
    : null;

  // При кліку на круглу кнопку сабмітимо форму зліва
  const handleActionClick = () => {
    const pageInput = document.querySelector(
      'input[name="page"]',
    ) as HTMLInputElement;
    const form = document.querySelector("form");

    if (!pageInput || !pageInput.value.trim()) {
      toast.error("Please enter a page number first!");
      pageInput?.focus();
      return;
    }

    if (form) {
      form.requestSubmit();
    } else {
      toast.error("Reading form not found on the page.");
    }
  };

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
            loading="eager"
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

        {/* Кнопка тепер миттєво змінює стан залежно від наявності активної сесії */}
        <div
          onClick={handleActionClick}
          className={`${css.actionButton} ${isReadingActive ? css.stopActive : ""}`}
          style={{ cursor: "pointer" }}
          title={
            isReadingActive ? "Click to stop reading" : "Click to start reading"
          }
        >
          <span className={isReadingActive ? css.stopIcon : css.playIcon} />
        </div>
      </div>
    </div>
  );
}
