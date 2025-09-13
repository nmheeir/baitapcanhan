"use client";

import AccessDenied from "@/app/access-denied";
import { Book } from "data/book";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  async function fetchBooks() {
    try {
      console.log("📌 Fetching books...");
      const res = await fetch("/api/books/manage", {
        credentials: "include",
      });
      if (res.status === 403) {
        console.warn("❌ User does not have permission");
        setForbidden(true);
        return;
      }
      if (!res.ok) throw new Error("FETCH_ERROR");
      const data = await res.json();
      setBooks(data);
    } catch (e) {
      console.error("❌ Failed to fetch books:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function deleteBook(id: string) {
    if (!confirm("Bạn có chắc muốn xóa sách này?")) return;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("DELETE_ERROR");
      setBooks((prev) => prev.filter((b) => b.id !== id));
      console.log(`✅ Book ${id} deleted`);
    } catch (e) {
      console.error("❌ Failed to delete book:", e);
    }
  }

  if (loading) return <p>⏳ Đang tải sách...</p>;

  if (forbidden) return <AccessDenied />;

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-bold mb-4">📚 Quản lý sách</h1>

      <div className="mb-4">
        <Link
          href="/books/manage/add"
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Thêm sách
        </Link>
      </div>

      {books.length === 0 ? (
        <p>Không có sách nào.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Mã</th>
              <th className="border px-2 py-1">Tên sách</th>
              <th className="border px-2 py-1">Tác giả</th>
              <th className="border px-2 py-1">Năm</th>
              <th className="border px-2 py-1">Số lượng</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{book.code}</td>
                <td className="border px-2 py-1">
                  <Link
                    href={`/books/${book.id}`}
                    className="text-blue-600 underline"
                  >
                    {book.name}
                  </Link>
                </td>
                <td className="border px-2 py-1">{book.author}</td>
                <td className="border px-2 py-1">{book.year}</td>
                <td className="border px-2 py-1">{book.quantity}</td>
                <td className="border px-2 py-1">{book.price} đ</td>
                <td className="border px-2 py-1 space-x-2">
                  <Link
                    href={`/books/manage/edit/${book.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
