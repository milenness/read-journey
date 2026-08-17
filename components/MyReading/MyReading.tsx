"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getMyLibraryBooks, removeBookFromLibrary } from "@/lib/api";

import Loader from "@/components/Loader/Loader";
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

  // Фільтруємо дублікати за назвою, залишаючи лише першу унікальну книгу
  const uniqueBooks = books.filter(
    (book: IBook, index: number, self: IBook[]) =>
      index ===
      self.findIndex(
        (b) => b.title.toLowerCase().trim() === book.title.toLowerCase().trim(),
      ),
  );

  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => removeBookFromLibrary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libraryBooks"] });
      toast.success("Book was successfully deleted from library.");
    },
    onError: () => {
      toast.error("Failed to delete the book. Please try again.");
    },
  });

  const handleDelete = (id: string) => {
    deleteBook(id);
  };

  // Закриття випадаючого списку при кліку за межами компонента
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

        </div>
      </div>

  );
}
