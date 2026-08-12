import { ReactNode } from "react";
import css from "./Dashboard.module.css";

interface DashboardProps {
  children: ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  return (
    <aside className={css.dashboard}>
      {children}
    </aside>
  );
}
