"use client";

import { useEffect, useState } from "react";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${params.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("FETCH_ERROR");
        const data = await res.json();
        setBook(data);

        // Fetch category name if category_id exists
        if (data.category_id) {
          const categoryRes = await fetch(`/api/categories/${data.category_id}`, {
            credentials: "include",
          });
          if (categoryRes.ok) {
            const categoryData = await categoryRes.json();
            setCategory(categoryData);
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch book:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-2">
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"></path>
        </svg>
        <p className="text-lg text-gray-700">Đang tải thông tin sách...</p>
      </div>
    </div>
  );

  if (error || !book) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-lg text-gray-700">Không tìm thấy sách hoặc bạn không có quyền truy cập.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
          </svg>
          {book.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Mã sách:</span>
              <p className="text-gray-800">{book.code}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Tác giả:</span>
              <p className="text-gray-800">{book.author}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Năm xuất bản:</span>
              <p className="text-gray-800">{book.year || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Nhà xuất bản:</span>
              <p className="text-gray-800">{book.publisher || '-'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Danh mục:</span>
              <p className="text-gray-800">{category ? category.name : '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Số lượng:</span>
              <p className="text-gray-800">{book.quantity}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Giá:</span>
              <p className="text-gray-800">{book.price ? `${book.price} VNĐ` : '-'}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <span className="text-sm font-medium text-gray-600">Mô tả:</span>
          <p className="text-gray-800 mt-1">{book.description || 'Không có mô tả.'}</p>
        </div>
      </div>
    </div>
  );
}