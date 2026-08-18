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
import Loader from "@/components/Loader";
import css from "./Progress.module.css";

interface GroupedProgressItem {
  dateKey: string;
  dateStr: string;
  totalDaysPages: number;
  sessions: Array<{
    _id?: string;
    pagesRead: number;
    itemPercent: string;
    readingMinutes: number;
    speed?: number;
  }>;
}

export default function Progress() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const bookIdFromUrl = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"diary" | "statistics">("diary");

  const { data: booksResponse, isLoading } = useQuery({
    queryKey: ["libraryBooks"],
    queryFn: () => getMyLibraryBooks(),
  });

  const books: IBook[] = Array.isArray(booksResponse)
    ? booksResponse
    : booksResponse?.results || [];

  const currentBook = bookIdFromUrl
    ? books.find((b) => b._id === bookIdFromUrl)
    : books.find((b) => b.status === "in-progress") || books[0];

  const progress = currentBook?.progress || [];
  const totalPages = currentBook?.totalPages || 0;
  const timeLeftToRead = currentBook?.timeLeftToRead;

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

  const totalReadPages = progress.reduce(
    (acc, item) =>
      acc + (item.finishPage ? item.finishPage - item.startPage : 0),
    0,
  );
  const percentageNum = totalPages ? (totalReadPages / totalPages) * 100 : 0;

  const percentageStr =
    percentageNum === 100
      ? "100"
      : percentageNum === 0
        ? "0"
        : percentageNum.toFixed(2);

 
  const groupedProgressMap = new Map<string, GroupedProgressItem>();

  const sortedProgress = [...progress].reverse();

  sortedProgress.forEach((item) => {
    const pagesRead = item.finishPage ? item.finishPage - item.startPage : 0;
    const itemPercent = totalPages
      ? ((pagesRead / totalPages) * 100).toFixed(1)
      : "0";

    const dateKey = item.finishReading
      ? new Date(item.finishReading).toISOString().split("T")[0]
      : "in-progress";

    const dateStr = item.finishReading
      ? new Date(item.finishReading).toLocaleDateString("uk-UA")
      : "In progress";

    let readingMinutes = 0;
    if (item.startReading && item.finishReading) {
      const startTime = new Date(item.startReading).getTime();
      const finishTime = new Date(item.finishReading).getTime();
      readingMinutes =
        !isNaN(startTime) && !isNaN(finishTime)
          ? Math.round((finishTime - startTime) / (1000 * 60))
          : 0;
    }

    if (!groupedProgressMap.has(dateKey)) {
      groupedProgressMap.set(dateKey, {
        dateKey,
        dateStr,
        totalDaysPages: 0,
        sessions: [],
      });
    }

    const group = groupedProgressMap.get(dateKey)!;
    group.totalDaysPages += pagesRead;
    group.sessions.push({
      _id: item._id,
      pagesRead,
      itemPercent,
      readingMinutes,
      speed: item.speed,
    });
  });

  const groupedProgress = Array.from(groupedProgressMap.values());

  return (
    <div className={css.progressBlock}>
      <div className={css.headerRow}>
        <h3 className={css.titleProgress}>
          {activeTab === "diary" ? "Diary" : "Statistics"}
        </h3>
        <div className={css.tabsIcons}>
          <button
            type="button"
            className={`${css.iconBtn} ${activeTab === "diary" ? css.activeTabBtn : ""}`}
            onClick={() => setActiveTab("diary")}
            title="Diary"
          >
            <RiHourglassLine className={css.tabIcon} size={16} />
          </button>
          <button
            type="button"
            className={`${css.iconBtn} ${activeTab === "statistics" ? css.activeTabBtn : ""}`}
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
            {groupedProgress.map((group, groupIndex) => {
              const firstSession = group.sessions[0];
              const additionalSessions = group.sessions.slice(1);
              const isActive = groupIndex === 0;

              return (
                <li
                  key={group.dateKey + groupIndex}
                  className={`${css.diaryItem} ${isActive ? css.active : ""}`}
                >
                  <div className={css.customPoint}>
                    <div className={css.customSquare}></div>
                  </div>

                  <div className={css.diaryItemLeft}>
                    <span className={css.dateText}>{group.dateStr}</span>
                    <span className={css.percentText}>
                      {firstSession.itemPercent}%
                    </span>
                    <span className={css.minutesText}>
                      {firstSession.readingMinutes > 0
                        ? `${firstSession.readingMinutes} minutes`
                        : "0 minutes"}
                    </span>

                    {additionalSessions.map((addSession, addIdx) => (
                      <div
                        key={addSession._id || addIdx}
                        className={css.additionalItemLeft}
                      >
                        <span className={css.percentText}>
                          {addSession.itemPercent}%
                        </span>
                        <span className={css.minutesText}>
                          {addSession.readingMinutes > 0
                            ? `${addSession.readingMinutes} minutes`
                            : "0 minutes"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={css.diaryItemRight}>
                    <span className={css.pagesCount}>
                      {group.totalDaysPages} pages
                    </span>
                    <div className={css.speedBinWrappers}>
                      <div className={css.speedBinWrapper}>
                        <div className={css.speedWrapper}>
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
                          {firstSession.speed && (
                            <span className={css.speedText}>
                              {firstSession.speed} pages <br /> per hour
                            </span>
                          )}
                        </div>
                        {firstSession._id && (
                          <button
                            type="button"
                            className={css.deleteReadingBtn}
                            onClick={() =>
                              handleDeleteReading(firstSession._id!)
                            }
                            aria-label="Delete reading session"
                          >
                            <RiDeleteBinLine
                              className={css.binIcon}
                              size={14}
                            />
                          </button>
                        )}
                      </div>

                      {additionalSessions.map((addSession, addIdx) => (
                        <div
                          key={addSession._id || addIdx}
                          className={css.additionalInfo}
                        >
                          <div className={css.speedBinWrapper}>
                            <div className={css.speedWrapper}>
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
                              {addSession.speed && (
                                <span className={css.speedText}>
                                  {addSession.speed} pages <br /> per hour
                                </span>
                              )}
                            </div>
                            {addSession._id && (
                              <button
                                type="button"
                                className={css.deleteReadingBtn}
                                onClick={() =>
                                  handleDeleteReading(addSession._id!)
                                }
                                aria-label="Delete reading session"
                              >
                                <RiDeleteBinLine
                                  className={css.binIcon}
                                  size={14}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
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
            <div className={css.circleProgressWrapper}>
              <svg
                className={css.circleSvg}
                viewBox="0 0 116 116"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="58"
                  cy="58"
                  r="50"
                  stroke="#1F1F1F"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="58"
                  cy="58"
                  r="50"
                  stroke="#30B94D"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={
                    2 * Math.PI * 50 * (1 - percentageNum / 100)
                  }
                  strokeLinecap="round"
                  transform="rotate(-90 58 58)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>

              <div className={css.circleInner}>
                <span className={css.circlePercent}>100%</span>
              </div>
            </div>

            <div className={css.statsFooter}>
              <span className={css.greenDot}></span>
              <div className={css.statsPagesRead}>
                <span className={css.statsPagesPercentage}>
                  {percentageStr}%
                </span>{" "}
                <span className={css.subText}>{totalReadPages} pages read</span>
              </div>
            </div>

            {timeLeftToRead && (
              <div className={css.timeLeftStats}>
                Time left: {timeLeftToRead.hours} hours and{" "}
                {timeLeftToRead.minutes} minutes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
