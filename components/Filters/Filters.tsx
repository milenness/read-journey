"use client";

import { useId } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import css from "./Filters.module.css";

export default function Filters() {
  const titleId = useId();
  const authorId = useId();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString().trim() || "";
    const author = formData.get("author")?.toString().trim() || "";

    const params = new URLSearchParams(searchParams.toString());

    if (title) {
      params.set("title", title);
    } else {
      params.delete("title");
    }

    if (author) {
      params.set("author", author);
    } else {
      params.delete("author");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={css.filtersContainer}>
      <p className={css.filtersTitle}>Filters:</p>

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.inputWrapper}>
          <label htmlFor={titleId} className={css.label}>
            Book title:
          </label>
          <input
            id={titleId}
            name="title"
            type="text"
            placeholder="Enter text"
            className={css.input}
            defaultValue={searchParams.get("title") || ""}
          />
        </div>

        <div className={css.inputWrapper}>
          <label htmlFor={authorId} className={css.label}>
            The author:
          </label>
          <input
            id={authorId}
            name="author"
            type="text"
            placeholder="Enter text"
            className={css.input}
            defaultValue={searchParams.get("author") || ""}
          />
        </div>

        <button type="submit" className={css.submitBtn}>
          To apply
        </button>
      </form>
    </div>
  );
}
