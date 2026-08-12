import css from "./StartLibrary.module.css";

export default function ScreenBlock() {
  return (
    <div className={css.startBlock}>
      <h3>Start your workout</h3>
      <ul className={css.startList}>
        <li className={css.startItem}>
          <div className={css.startNumber}>1</div>
          <p className={css.startText}>
            <span className={css.accent}>Create a personal library:</span> add
            the books you intend to read to it.
          </p>
        </li>
        <li className={css.startItem}>
          <div className={css.startNumber}>2</div>
          <p className={css.startText}>
            <span className={css.accent}>Create your first workout:</span> define a goal, choose a period, start
            training.
          </p>
        </li>
      </ul>
    </div>
  );
}
