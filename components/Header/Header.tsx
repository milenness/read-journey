"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { TbAlignJustified } from "react-icons/tb";

import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/api";
import Loader from "@/components/Loader/Loader";
import css from "./Header.module.css";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  const clearUser = useAuthStore((state) => state.clearUser);

  const userName = user?.name || "Reader";
  const firstLetter = userName.charAt(0).toUpperCase();

  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      router.push("/login");
    },

    onError: (error) => {
      const errorMessage =
        (axios.isAxiosError(error) && error.response?.data?.error) ||
        "Logout failed. Please try again.";
      toast.error(errorMessage);
    },

    onSettled: () => {
      clearUser();
      setIsMobileMenuOpen(false);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {(logoutMutation.isPending || logoutMutation.isSuccess) && <Loader />}

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

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending || logoutMutation.isSuccess}
              className={css.logOut}
            >
              Log out
            </button>

            <button
              type="button"
              className={css.burgerButton}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <TbAlignJustified size={28} />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <MobileMenu
            pathname={pathname}
            onClose={() => setIsMobileMenuOpen(false)}
            onLogout={handleLogout}
            isLogoutPending={
              logoutMutation.isPending || logoutMutation.isSuccess
            }
          />
        )}
      </header>
    </>
  );
}