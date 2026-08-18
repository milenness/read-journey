"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyLibraryBooks } from "@/lib/api";
import { IBook } from "@/types/book";
import Loader from "@/components/Loader";
import css from "./MyReading.module.css";

export default function MyReading() {
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"diary" | "statistics">("diary");

  useEffect(() => {
    const handleTabClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button");
      if (!btn) return;

      const title = btn.getAttribute("title");
      if (title === "Diary") setActiveTab("diary");
      if (title === "Statistics") setActiveTab("statistics");
    };

    document.addEventListener("click", handleTabClick);
    return () => document.removeEventListener("click", handleTabClick);
  }, []);

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

  const totalMinutes = progress.reduce((acc, item) => {
    if (item.startReading && item.finishReading) {
      const startTime = new Date(item.startReading).getTime();
      const finishTime = new Date(item.finishReading).getTime();
      const mins =
        !isNaN(startTime) && !isNaN(finishTime)
          ? Math.round((finishTime - startTime) / (1000 * 60))
          : 0;
      return acc + mins;
    }
    return acc;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formattedReadTime = null;
  if (totalMinutes > 0) {
    if (hours > 0 && minutes === 0) {
      formattedReadTime = `${hours} hours read`;
    } else if (hours === 0 && minutes > 0) {
      formattedReadTime = `${minutes} minutes read`;
    } else if (hours > 0 && minutes > 0) {
      formattedReadTime = `${hours} hours and ${minutes} minutes read`;
    }
  }

  const timeText = timeLeftToRead
    ? `${timeLeftToRead.hours} hours and ${timeLeftToRead.minutes} minutes left`
    : formattedReadTime;

  const activeSession = progress.find(
    (p) => p.finishPage === undefined || p.finishPage === null,
  );
  const isReadingActive = Boolean(activeSession);

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

        {activeTab === "statistics" && timeText && (
          <span className={css.timeLeft}>{timeText}</span>
        )}
      </div>

      <div className={css.bookContent}>
        <div className={css.bookImageWrapper}>
          {imageUrl && imageUrl.trim() !== "" && (
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
        </div>

        <h3 className={css.bookTitle} title={title}>
          {title}
        </h3>
        <h4 className={css.bookAuthor} title={author}>
          {author}
        </h4>

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
