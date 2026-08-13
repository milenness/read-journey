import css from "./Quote.module.css";

export default function Quote() {
  return (
    <div className={css.quote}>
      <span role="img" aria-label="Books" className={css.booksImg}>
        📚
      </span>
      <p className={css.text}>
        &quot;Books are <span className={css.accent}>windows</span> to the world, and reading is a journey into the
        unknown.&quot;
      </p>
    </div>
  );
}
