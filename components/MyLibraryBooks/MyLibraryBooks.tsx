"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineNearbyError } from "react-icons/md";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import toast from "react-hot-toast";

import { getMyLibraryBooks, removeBookFromLibrary } from "@/lib/api";
import Book from "@/components/Book";
import Loader from "@/components/Loader";
import { IBook } from "@/types/book";
import css from "./MyLibraryBooks.module.css";

const options = [
  { value: "", label: "All books" },
  { value: "unread", label: "Unread" }, 
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export default function MyLibraryBooks() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["libraryBooks", status],
    queryFn: () => getMyLibraryBooks(status || undefined),
  });

  const uniqueBooks = books.filter(
    (book: IBook, index: number, self: IBook[]) =>
      index ===
      self.findIndex(
        (b) => b.title.toLowerCase().trim() === book.title.toLowerCase().trim(),
      ),
  );

  const { mutateAsync: deleteBookAsync, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => removeBookFromLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
    },
    onError: () => {
      toast.error("Failed to delete the book. Please try again.");
    },
  });

  // Видаляємо всі дублікати цієї книги за назвою з бази
  const handleDeleteByTitle = async (bookTitle: string) => {
    try {
      const booksWithSameTitle = books.filter(
        (b: IBook) =>
          b.title.toLowerCase().trim() === bookTitle.toLowerCase().trim(),
      );

      // Видаляємо кожен знайдений дублікат послідовно
      for (const book of booksWithSameTitle) {
        await deleteBookAsync(book._id);
      }

      toast.success("Book was successfully deleted from library.");
    } catch {
      // Помилка вже оброблена в onError мутації
    }
  };

  // Закриття дропдауна при кліку за його межами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptionLabel =
    options.find((opt) => opt.value === status)?.label || "All books";

  return (
    <div className={css.wrapper}>
      <div className={css.headerWrapper}>
        <h2 className={css.title}>My library</h2>

        <div className={css.filterWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={`${css.selectToggle} ${isOpen ? css.open : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span>{selectedOptionLabel}</span>
            {isOpen ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
          </button>

          {isOpen && (
            <ul className={css.dropdownList}>
              {options.map((option, idx) => (
                <li
                  key={idx}
                  className={`${css.dropdownItem} ${
                    status === option.value ? css.active : ""
                  }`}
                  onClick={() => {
                    setStatus(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(isLoading || isDeleting) && <Loader />}

      {isError && (
        <div className={css.errorStub}>
          <p className={css.noText}>
            <MdOutlineNearbyError className={css.errorIcon} size={100} />
            Oops! Something went wrong while loading your books.
          </p>
        </div>
      )}

      {!isLoading && !isError && uniqueBooks.length > 0 && (
        <ul className={css.booksList}>
          {uniqueBooks.map((book: IBook) => (
            <Book
              key={book._id}
              data={book}
              showDeleteBtn={true}
              onDelete={() => handleDeleteByTitle(book.title)}
            />
          ))}
        </ul>
      )}

      {!isLoading && !isError && uniqueBooks.length === 0 && (
        <div className={css.noBlock}>
          <span role="img" aria-label="Books" className={css.booksImg}>
            📚
          </span>
          <p className={css.noText}>
            To start training, add{" "}
            <span className={css.accent}>some of your books </span>or from the
            recommended ones
          </p>
        </div>
      )}
    </div>
  );
}
