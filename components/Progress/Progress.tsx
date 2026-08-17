"use client";

import { useState } from "react";
import { FaRegHourglass } from "react-icons/fa6";
import { HiOutlineChartPie } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import { IReadingProgress } from "@/types/book";
import css from "./Progress.module.css";

interface MyBookProps {
  progress?: IReadingProgress[];
  totalPages: number;
  onDeleteReading?: (readingId: string) => void;
}

export default function MyBook({
  progress = [],
  totalPages,
  onDeleteReading,
}: MyBookProps) {
  // Стан для перемикання між щоденником ("diary") та графіком ("statistics")
  const [activeTab, setActiveTab] = useState<"diary" | "statistics">("diary");

  // 1. Стан, якщо ще немає жодних записів читання (показуємо заглушку зі зірочкою)
  if (!progress || progress.length === 0) {
    return (
      <div className={css.noProgressBlock}>
        <h3 className={css.titleProgress}>Progress</h3>
        <p className={css.text}>
          Here you will see when and how much you read. <br /> To record, click
          on the red button above.
        </p>
        <span role="img" aria-label="Star" className={css.starImg}>
          🌟
        </span>
      </div>
    );
  }

  // Підрахунок загальної кількості прочитаних сторінок для статистики
  const totalReadPages = progress.reduce(
    (acc, item) =>
      acc + (item.finishPage ? item.finishPage - item.startPage : 0),
    0,
  );
  const percentage = totalPages
    ? Math.round((totalReadPages / totalPages) * 100)
    : 0;

  return (
    <div className={css.progressBlock}>
      {/* Шапка з заголовком та перемикачем режимів */}
      <div className={css.headerRow}>
        <h3 className={css.titleProgress}>
          {activeTab === "diary" ? "Diary" : "Statistics"}
        </h3>
        <div className={css.tabsIcons}>
          <button
            type="button"
            className={`${css.iconBtn} ${activeTab === "diary" ? css.active : ""}`}
            onClick={() => setActiveTab("diary")}
            title="Diary"
          >
            <FaRegHourglass size={20} />
          </button>
          <button
            type="button"
            className={`${css.iconBtn} ${activeTab === "statistics" ? css.active : ""}`}
            onClick={() => setActiveTab("statistics")}
            title="Statistics"
          >
            <HiOutlineChartPie size={20} />
          </button>
        </div>
      </div>

      {/* РЕЖИМ 1: ЩОДЕННИК (DIARY) */}
      {activeTab === "diary" && (
        <div className={css.diaryContainer}>
          <ul className={css.diaryList}>
            {progress.map((item, index) => {
              const pagesRead = item.finishPage
                ? item.finishPage - item.startPage
                : 0;
              const itemPercent = totalPages
                ? ((pagesRead / totalPages) * 100).toFixed(1)
                : "0";
              const dateStr = item.finishReading
                ? new Date(item.finishReading).toLocaleDateString("uk-UA")
                : "In progress";

              return (
                <li key={item._id || index} className={css.diaryItem}>
                  <div className={css.diaryItemHeader}>
                    <span className={css.dateText}>{dateStr}</span>
                    <span className={css.pagesCount}>{pagesRead} pages</span>
                  </div>

                  <div className={css.diaryItemBody}>
                    <div className={css.leftInfo}>
                      <span className={css.percentText}>{itemPercent}%</span>
                      {item.speed && (
                        <span className={css.speedText}>
                          {item.speed} pages per hour
                        </span>
                      )}
                    </div>

                    {item._id && onDeleteReading && (
                      <button
                        type="button"
                        className={css.deleteReadingBtn}
                        onClick={() => onDeleteReading(item._id!)}
                      >
                        <RiDeleteBinLine size={16} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* РЕЖИМ 2: СТАТИСТИКА (STATISTICS) */}
      {activeTab === "statistics" && (
        <div className={css.statisticsContainer}>
          <p className={css.statsDescription}>
            Each page, each chapter is a new round of knowledge, a new step
            towards understanding. By rewriting statistics, we create our own
            reading history.
          </p>

          <div className={css.chartWrapper}>
            {/* Тут можна зробити круглий індикатор або використати SVG / CSS conic-gradient */}
            <div
              className={css.circleProgress}
              style={{
                background: `conic-gradient(var(--color-green, #20ad96) ${percentage * 3.6}deg, #2a2a2a 0deg)`,
              }}
            >
              <div className={css.circleInner}>
                <span className={css.circlePercent}>{percentage}%</span>
              </div>
            </div>

            <div className={css.statsFooter}>
              <span className={css.greenDot}></span>
              <span className={css.statsPagesRead}>
                {percentage}%{" "}
                <span className={css.subText}>{totalReadPages} pages read</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
