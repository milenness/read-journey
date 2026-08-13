"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { getRecommendedBooks } from "@/lib/api";
import Book from "@/components/Book/Book";
import Loader from "@/components/Loader/Loader";
import css from "./RecommendedBooks.module.css";

export default function RecommendedBooks() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || undefined;
  const author = searchParams.get("author") || undefined;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [prevLimit, setPrevLimit] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  // Скидання сторінки при зміні ліміту
  if (limit !== prevLimit) {
    setPrevLimit(limit);
    setPage(1);
  }

  // Скидання сторінки при зміні параметрів пошуку
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [title, author]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const updateLimit = () => {
      if (window.innerWidth < 768) {
        setLimit(2);
      } else if (window.innerWidth < 1440) {
        setLimit(8);
      } else {
        setLimit(10);
      }
    };

    updateLimit();

    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const { data, isLoading, isError } = useQuery({
    // Додаємо title та author до ключа, щоб кеш оновлювався при пошуку
    queryKey: ["recommendedBooks", page, limit, title, author],
    queryFn: () => getRecommendedBooks({ page, limit, title, author }),
    enabled: isMounted,
  });

  const books = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  if (!isMounted) return null;

  return (
    <>
      {isLoading && <Loader />}

      <div className={css.wrapper}>
        <div className={css.headerWrapper}>
          <h2 className={css.title}>Recommended</h2>

          {totalPages > 1 && (
            <div className={css.pagination}>
              <button
                type="button"
                className={css.pageBtn}
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                <FiChevronLeft className={css.arrow} size={20} />
              </button>

              <button
                type="button"
                className={css.pageBtn}
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                <FiChevronRight className={css.arrow} size={20} />
              </button>
            </div>
          )}
        </div>

        {isError && (
          <p style={{ color: "var(--color-red, red)", marginTop: "20px" }}>
            Oops! Something went wrong while loading books.
          </p>
        )}

        {!isLoading && !isError && books.length > 0 && (
          <ul className={css.booksList}>
            {books.map((book) => (
              <Book key={book._id} data={book} />
            ))}
          </ul>
        )}

        {!isLoading && !isError && books.length === 0 && (
          <p style={{ color: "var(--color-gray)", marginTop: "20px" }}>
            No books found.
          </p>
        )}
      </div>
    </>
  );
}
