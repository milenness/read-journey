"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaArrowRight } from "react-icons/fa6";

import { getRecommendedBooks } from "@/lib/api";
import StartBook from "./StartBook";
import Loader from "@/components/Loader";
import css from "./StartRecommended.module.css";

export default function StartRecommended() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["startRecommendedBooks"],
    queryFn: () => getRecommendedBooks({ page: 1, limit: 3 }),
    enabled: isMounted,
  });

  const books = data?.results || [];

  if (!isMounted) return null;

  return (
    <div className={css.startBlock}>
      <h3 className={css.title}>Recommended books</h3>

      {isLoading && <Loader />}

      {isError && (
        <p
          style={{
            color: "var(--color-red, red)",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          Oops! Something went wrong.
        </p>
      )}

      {!isLoading && !isError && books.length > 0 && (
        <ul className={css.startList}>
          {books.slice(0, 3).map((book) => (
            <StartBook key={book._id} data={book} />
          ))}
        </ul>
      )}

      <Link href="/recommended" className={css.libraryLink}>
        Home
        <FaArrowRight size={20} className={css.arrow} />
      </Link>
    </div>
  );
}
