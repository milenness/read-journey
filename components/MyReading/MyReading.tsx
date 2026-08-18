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
    totalPages = 0,
    progress = [],
    timeLeftToRead,
  } = currentBook;

  let leftHours = timeLeftToRead?.hours;
  let leftMinutes = timeLeftToRead?.minutes;

  if (leftHours === undefined || leftMinutes === undefined) {
    const maxReadPage = progress.reduce((max, p) => {
      const finish = p.finishPage || 0;
      return finish > max ? finish : max;
    }, 0);

    const pagesLeft = Math.max(0, totalPages - maxReadPage);

    let totalSpentMinutes = 0;
    let totalCoveredPages = 0;

    progress.forEach((item) => {
      if (
        item.startReading &&
        item.finishReading &&
        item.finishPage &&
        item.startPage
      ) {
        const sTime = new Date(item.startReading).getTime();
        const fTime = new Date(item.finishReading).getTime();
        const diffMins = (fTime - sTime) / (1000 * 60);
        const pCount = item.finishPage - item.startPage + 1;

        if (diffMins > 0 && pCount > 0) {
          totalSpentMinutes += diffMins;
          totalCoveredPages += pCount;
        }
      }
    });

    const minutesPerPage =
      totalCoveredPages > 0 ? totalSpentMinutes / totalCoveredPages : 1.5;
    const estimatedTotalLeftMinutes = Math.round(pagesLeft * minutesPerPage);

    leftHours = Math.floor(estimatedTotalLeftMinutes / 60);
    leftMinutes = estimatedTotalLeftMinutes % 60;
  }

  let timeText = null;
  if (leftHours > 0 && leftMinutes === 0) {
    timeText = `${leftHours} hours left`;
  } else if (leftHours === 0 && leftMinutes > 0) {
    timeText = `${leftMinutes} minutes left`;
  } else if (leftHours > 0 && leftMinutes > 0) {
    timeText = `${leftHours} hours and ${leftMinutes} minutes left`;
  } else {
    timeText = "0 minutes left";
  }

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
