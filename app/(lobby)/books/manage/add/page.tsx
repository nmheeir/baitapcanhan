"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

// Define the Form interface for TypeScript
interface BookForm {
  code: string;
  name: string;
  author: string;
  year: string;
  publisher: string;
  category_id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm] = useState<BookForm>({
    code: "",
    name: "",
    author: "",
    year: "",
    publisher: "",
    category_id: "",
    description: "",
    quantity: 0,
    price: 0,
  });
  const [error, setError] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          year: form.year ? parseInt(form.year) : null,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Có lỗi xảy ra khi thêm sách");
        return;
      }

      const newBook = await res.json();
      console.log("✅ Book added:", newBook);
      alert("Thêm sách thành công")
      router.push("/books/manage");
    } catch (err) {
      console.error("❌ Error adding book:", err);
      setError("Lỗi kết nối server");
    }
  }

  return (
    <>
      <Head>
        <title>Thêm sách mới</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="mr-2">➕</span> Thêm sách mới
          </h1>
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã sách</label>
                <input
                  name="code"
                  placeholder="Mã sách"
                  value={form.code}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sách</label>
                <input
                  name="name"
                  placeholder="Tên sách"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  name="author"
                  placeholder="Tác giả"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản</label>
                <input
                  name="year"
                  placeholder="Năm xuất bản"
                  type="number"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhà xuất bản</label>
                <input
                  name="publisher"
                  placeholder="Nhà xuất bản"
                  value={form.publisher}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID thể loại</label>
                <input
                  name="category_id"
                  placeholder="ID thể loại"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  placeholder="Mô tả"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  name="quantity"
                  placeholder="Số lượng"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                <input
                  name="price"
                  placeholder="Giá"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <span className="mr-2">💾</span> Lưu
            </button>
          </form>
        </div>
      </div>
    </>
  );
}