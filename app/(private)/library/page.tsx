"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

import Dashboard from "@/components/Dashboard";
import AddBook from "@/components/AddBook";
import StartRecommended from "@/components/StartRecommended";
import MyLibraryBooks from "@/components/MyLibraryBooks";

import css from "../page.module.css";

export default function LibraryPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <section className={css.pageSection}>
      <div className="container">
        <div className={css.pageWrapper}>
          <Dashboard>
            <AddBook />
            <StartRecommended />
          </Dashboard>

          <MyLibraryBooks />
        </div>
      </div>
    </section>
  );
}
