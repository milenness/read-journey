"use client";

import { useId } from "react";
import css from "./Filters.module.css";

export default function Filters() {
  const titleId = useId();
  const authorId = useId();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Дістаємо значення з форми
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const author = formData.get("author");

    console.log("Фільтруємо за:", { title, author });
    // TODO: Тут буде логіка оновлення стану або запит на бекенд
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
          />
        </div>

        <button type="submit" className={css.submitBtn}>
          To apply
        </button>
      </form>
    </div>
  );
}
