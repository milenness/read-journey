"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RiHourglassLine, RiDeleteBinLine } from "react-icons/ri";
import { HiOutlineChartPie } from "react-icons/hi2";
import toast from "react-hot-toast";
import axios from "axios";
import { getMyLibraryBooks, deleteReading } from "@/lib/api";
import { IBook } from "@/types/book";
import Loader from "@/components/Loader/Loader";
import css from "./Progress.module.css";

export default function Progress() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"diary" | "statistics">("diary");

  // Отримуємо список книг з бібліотеки
  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const books: IBook[] = Array.isArray(booksResponse)
    ? booksResponse
    : booksResponse?.results || [];

  // Шукаємо книгу за ID з URL, або активну, або першу
  const currentBook =
    books.find((b) => b._id === bookIdFromUrl) ||
    books.find((b) => b.status === "in-progress") ||
    books[0];

  const progress = currentBook?.progress || [];
  const totalPages = currentBook?.totalPages || 0;

  // Функція видалення сесії читання
  const handleDeleteReading = async (readingId: string) => {
    if (!currentBook) return;

    try {
      await deleteReading({ bookId: currentBook._id, readingId });
      toast.success("Reading record deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
    } catch (error: unknown) {
      let errorMessage = "Failed to delete reading record.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className={css.progressBlock}>
        <Loader />
      </div>
    );
  }

  // Якщо немає записів читання
  if (!progress || progress.length === 0) {
    return (
      <div className={css.noProgressBlock}>
        <h3 className={css.noProgressTitle}>Progress</h3>
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

  // Підрахунок загальної кількості прочитаних сторінок
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
            <RiHourglassLine className={css.tabIcon} size={16} />
          </button>
          <button
            type="button"
            className={`${css.iconBtn} ${activeTab === "statistics" ? css.active : ""}`}
            onClick={() => setActiveTab("statistics")}
            title="Statistics"
          >
            <HiOutlineChartPie className={css.tabIcon} size={16} />
          </button>
        </div>
      </div>

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

              // Перший елемент списку (або найсвіжіший) робимо активним (білий фон + чорний квадрат)
              const isActive = index === 0;

              return (
                <li
                  key={item._id || index}
                  className={`${css.diaryItem} ${isActive ? css.active : ""}`}
                >
                  {/* Кастомний маркер згідно з твоїм скріншотом (активний / сірий) */}
                  <div className={css.customPoint}>
                    <div className={css.customSquare}></div>
                  </div>

                  <div className={css.diaryItemLeft}>
                    <span className={css.dateText}>{dateStr}</span>
                    <span className={css.percentText}>{itemPercent}%</span>
                  </div>

                  <div className={css.diaryItemRight}>
                    <span className={css.pagesCount}>{pagesRead} pages</span>
                    <div className={css.speedBinWrapper}>
                      <div className={css.speedWrapper}>
                        {/* Одна універсальна SVG, розмір якої управляється в CSS */}
                        <svg
                          className={css.speedSvg}
                          viewBox="0 0 60 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M59.563 1L0.563034 9.42108V25H59.563V1Z"
                            fill="#30B94D"
                            fillOpacity="0.2"
                          />
                          <rect
                            width="60"
                            height="3"
                            rx="1"
                            transform="matrix(-0.987181 0.159606 0.159606 0.987181 59.0842 0)"
                            fill="#30B94D"
                          />
                        </svg>

                        {item.speed && (
                          <span className={css.speedText}>
                            {item.speed} pages per hour
                          </span>
                        )}
                      </div>

                      {item._id && (
                        <button
                          type="button"
                          className={css.deleteReadingBtn}
                          onClick={() => handleDeleteReading(item._id!)}
                          aria-label="Delete reading session"
                        >
                          <RiDeleteBinLine size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {activeTab === "statistics" && (
        <div className={css.statisticsContainer}>
          <p className={css.statsDescription}>
            Each page, each chapter is a new round of knowledge, a new step
            towards understanding. By rewriting statistics, we create our own
            reading history.
          </p>

          <div className={css.chartWrapper}>
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
