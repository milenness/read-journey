"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Loader.module.css";

export default function Loader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={css.loaderWrapper}>
      <span className={css.spinner}></span>
    </div>,
    document.body,
  );
}
