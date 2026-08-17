"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import Dashboard from "@/components/Dashboard";
// Поки що ці компоненти ми створимо на наступних кроках:
import AddReading from "@/components/AddReading";
import Progress from "@/components/Progress";
// import MyBook from "@/components/MyBook";

import css from "@/app/(private)/page.module.css";
import MyReading from "@/components/MyReading";

export default function ReadingPage() {
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
            <AddReading />
            <Progress/>
          </Dashboard>


         <MyReading/>
        </div>
      </div>
    </section>
  );
}
