"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Header.module.css";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { TbAlignJustified } from "react-icons/tb";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || "Reader";
  const firstLetter = userName.charAt(0).toUpperCase();

  const pathname = usePathname();

  return (
    <header className={css.header}>
      <div className="container">
        <div className={css.wrapper}>
          <Link href="/" className={css.logoLink}>
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={42}
              height={17}
              className={css.logoImage}
            />
            <span className={css.logoText}>read journey</span>
          </Link>

          <nav className={css.nav}>
            <ul className={css.navList}>
              {/* 👈 3. Додаємо перевірку: якщо шлях збігається, чіпляємо клас css.active */}
              <li
                className={`${css.navItem} ${pathname === "/recommended" ? css.active : ""}`}
              >
                <Link href="/recommended" className={css.navLink}>
                  Home
                </Link>
              </li>

              <li
                className={`${css.navItem} ${pathname === "/library" ? css.active : ""}`}
              >
                <Link href="/library" className={css.navLink}>
                  My library
                </Link>
              </li>
            </ul>
          </nav>

          <div className={css.userWrapper}>
            <div className={css.userLetter}>{firstLetter}</div>
            <h3 className={css.userName}>{userName}</h3>
          </div>

          <Link href="/login" className={css.logOut}>
            Log out
          </Link>

          <button type="button" className={css.burgerButton}>
            <TbAlignJustified size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}
