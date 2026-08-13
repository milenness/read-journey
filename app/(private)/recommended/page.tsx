"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

import Dashboard from "@/components/Dashboard";
import Filters from "@/components/Filters";
import StartLibrary from "@/components/StartLibrary";
// import RecommendedBooks from "@/components/RecommendedBooks/RecommendedBooks"; // Розкоментуєте, коли дійдете до нього

import css from "../page.module.css";
import Quote from "@/components/Quote";

export default function RecommendedPage() {
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
            <Filters />
            <StartLibrary />
            <Quote/>
          </Dashboard>
  
          <div style={{ flex: 1, color: "white" }}>
            Тут будуть рекомендовані книги...
          </div>
        </div>
     </div>
    </section>
  );
}
