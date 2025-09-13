"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "data/book";
import Head from "next/head";

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // 📌 Fetch book detail
  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("FETCH_ERROR");
        const data = await res.json();
        setBook(data);
      } catch (e) {
        console.error("❌ Failed to fetch book:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  // 📌 Submit edit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!book) return;

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(book),
      });

      if (!res.ok) throw new Error("UPDATE_ERROR");
      console.log("✅ Book updated successfully");
      alert("Cập nhật sách thành công!");
      router.push("/books/manage"); // Quay lại danh sách
    } catch (e) {
      console.error("❌ Failed to update book:", e);
      alert("Cập nhật sách thất bại!");
    }
  }

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (!book) return <p>❌ Không tìm thấy sách</p>;

  return (
    <>
      <Head>
        <title>Chỉnh sửa sách</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="mr-2">✏️</span> Chỉnh sửa sách
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã sách</label>
                <input
                  type="text"
                  value={book.code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBook({ ...book, code: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sách</label>
                <input
                  type="text"
                  value={book.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBook({ ...book, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={book.author}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBook({ ...book, author: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản</label>
                <input
                  type="number"
                  value={book.year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setBook({ ...book, year: parseInt(e.target.value) || '' })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhà xuất bản</label>
                <input
                  type="text"
                  value={book.publisher}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBook({ ...book, publisher: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  type="number"
                  value={book.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setBook({ ...book, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                <input
                  type="number"
                  step="0.01"
                  value={book.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setBook({ ...book, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={book.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBook({ ...book, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <span className="mr-2">💾</span> Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
