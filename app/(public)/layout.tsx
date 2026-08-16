import type { Metadata } from "next";
import ScreenBlock from "@/components/ScreenBlock";
import css from "./page.module.css";
import LogoLink from "@/components/Logo/Logo";

export const metadata: Metadata = {
  title: "Welcome to ReadJourney",
  description:
    "Log in or create an account to start tracking your reading progress, manage your personal library, and explore new books.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className={css.layoutWrapper}>
        <div className={`container ${css.blocksWrapper}`}>
          <div className={css.authBlock}>
            <LogoLink />

            <h1 className={css.title}>
              Expand your mind, reading
              <span className={css.accent}> a book</span>
            </h1>

            <>{children}</>
          </div>
          <ScreenBlock />
        </div>
      </section>
    </main>
  );
}
