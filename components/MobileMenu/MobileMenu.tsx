"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./MobileMenu.module.css";

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
  pathname: string;
}

export default function MobileMenu({
  onClose,
  onLogout,
  pathname,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  // 1. Логіка закриття по кліку на фон (бекдроп) з конспекту
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // 2. Логіка закриття по клавіші Escape з конспекту
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // 3. Заборона прокрутки фону з конспекту
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Повертаємо скрол як у конспекті
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    // Додали обробник кліку на фон та атрибути доступності (role, aria-modal)
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Внутрішній контейнер самого меню, щоб кліки по ньому не закривали вікно */}
      <div className={css.modal}>
        <button
          type="button"
          onClick={onClose}
          className={css.closeBtn}
          aria-label="Close menu"
        >
          &times;
        </button>

        {/* Навігація */}
        <nav className={css.nav}>
          <ul className={css.navList}>
            <li>
              <Link
                href="/recommended"
                onClick={onClose}
                className={`${css.navLink} ${
                  pathname === "/recommended" ? css.active : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/library"
                onClick={onClose}
                className={`${css.navLink} ${
                  pathname === "/library" ? css.active : ""
                }`}
              >
                My library
              </Link>
            </li>
          </ul>
        </nav>

        <button type="button" onClick={onLogout} className={css.logOutBtn}>
          Log out
        </button>
      </div>
    </div>,
    document.body,
  );
}
