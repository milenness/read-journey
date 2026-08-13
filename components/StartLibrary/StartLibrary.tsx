import css from "./StartLibrary.module.css";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function ScreenBlock() {
  return (
    <div className={css.startBlock}>
      <h3 className={css.title}>Start your workout</h3>
      <ul className={css.startList}>
        <li className={css.startItem}>
          <div className={css.startNumber}>1</div>
          <p className={css.startText}>
            <span className={css.accent}>Create a personal library:</span> add
            the books you intend to read <br /> to it.
          </p>
        </li>
        <li className={css.startItem}>
          <div className={css.startNumber}>2</div>
          <p className={css.startText}>
            <span className={css.accent}>Create your first workout:</span>{" "}
            define a goal, choose a period, start training.
          </p>
        </li>
      </ul>

      <Link href="/library" className={css.libraryLink}>
        My library
        <FaArrowRight size={24} className={css.arrow} />
      </Link>
    </div>
  );
}
