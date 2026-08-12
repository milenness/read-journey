import css from "./Quote.module.css";
import Image from "next/image";
import bookImage from "@/public/images/books.png";

export default function Quote() {
  return (
    <div className={css.quote}>
      <Image
        src={bookImage}
        alt="Books"
        className={css.books}
        loading="eager"
        width={40}
        height={40}
      />
      <p className={css.text}>
        &quotBooks are windows to the world, and reading is a journey into the
        unknown.&quot
      </p>
    </div>
  );
}
