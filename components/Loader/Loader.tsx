"use client";

import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <span className={css.spinner}></span>
    </div>
  );
}
