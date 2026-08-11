"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./MobileMenu.module.css";
import { VscCloseCompact } from "react-icons/vsc";

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
  isLogoutPending: boolean;
  pathname: string;
}

export default function MobileMenu({
  onClose,
  onLogout,
  isLogoutPending,
  pathname,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          type="button"
          onClick={onClose}
          className={css.closeBtn}
          aria-label="Close menu"
        >
          <VscCloseCompact size={16} />
        </button>

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

        <button
          type="button"
          onClick={onLogout}
          disabled={isLogoutPending}
          className={css.logOutBtn}
        >
          Log out
        </button>
      </div>
    </div>,
    document.body,
  );
}
