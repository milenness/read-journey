import ScreenBlock from "@/components/ScreenBlock/ScreenBlock";
import css from "./page.module.css";
import LogoLink from "@/components/LogoLink/LogoLink";

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

            <div className="form-container">{children}</div>
          </div>
          <ScreenBlock />
        </div>
      </section>
    </main>
  );
}