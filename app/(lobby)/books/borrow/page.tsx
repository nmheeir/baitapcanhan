"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BorrowBooksPage () {
  const [allBooks, setAllBooks] = useState<any[]>( [] ); // Lưu danh sách sách gốc
  const [filteredBooks, setFilteredBooks] = useState<any[]>( [] ); // Danh sách sách sau khi lọc
  const [categories, setCategories] = useState<any[]>( [] );
  const [category, setCategory] = useState( "" );
  const [search, setSearch] = useState( "" );
  const [loading, setLoading] = useState( true );
  const [error, setError] = useState<string | null>( null );
  const [slipId, setSlipId] = useState<string | null>( null );

  useEffect( () => {
    fetchCategories();
    fetchBooks();
  }, [] );

  async function fetchCategories () {
    try {
      const res = await fetch( "/api/categories", { credentials: "include" } );
      if ( !res.ok ) throw new Error( "FETCH_CATEGORIES" );
      const data = await res.json();
      setCategories( data );
    } catch ( e ) {
      console.error( "❌ Failed to fetch categories:", e );
    }
  }

  async function fetchBooks () {
    setLoading( true );
    setError( null );
    try {
      const res = await fetch( "/api/books/manage", {
        credentials: "include",
      } );
      if ( !res.ok ) throw new Error( "FETCH_BOOKS" );
      const data = await res.json();
      setAllBooks( data );
      setFilteredBooks( data ); // Khởi tạo danh sách lọc bằng danh sách gốc
    } catch ( e ) {
      console.error( "❌ Failed to fetch books:", e );
      setError( "Không thể tải danh sách sách." );
    } finally {
      setLoading( false );
    }
  }

  // Hàm lọc sách dựa trên search và category
  useEffect( () => {
    let result = [...allBooks];

    // Lọc theo từ khóa tìm kiếm
    if ( search ) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        ( book ) =>
          book.name.toLowerCase().includes( lowerSearch ) ||
          book.author.toLowerCase().includes( lowerSearch ) ||
          book.code.toLowerCase().includes( lowerSearch )
      );
    }

    // Lọc theo danh mục
    if ( category ) {
      result = result.filter( ( book ) => book.category_id === category );
    }

    setFilteredBooks( result );
  }, [search, category, allBooks] );

  async function createDraft () {
    try {
      const res = await fetch( "/api/borrow-slips", {
        method: "POST",
        credentials: "include",
      } );
      if ( !res.ok ) throw new Error( "CREATE_DRAFT" );
      const data = await res.json();
      setSlipId( data.id );
      return data.id;
    } catch ( e ) {
      console.error( "❌ Failed to create draft:", e );
      throw e;
    }
  }

  async function addToCart ( bookId: string ) {
    try {
      const id = slipId || ( await createDraft() );
      const res = await fetch( `/api/borrow-slips/${ id }/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( { book_id: bookId, quantity: 1 } ),
      } );
      if ( !res.ok ) {
        const err = await res.json();
        alert( err.error || "Lỗi khi thêm sách vào phiếu mượn." );
        return;
      }
      alert( "Đã thêm sách vào phiếu mượn!" );
    } catch ( e ) {
      console.error( "❌ Failed to add to cart:", e );
      alert( "Lỗi khi thêm sách vào phiếu mượn." );
    }
  }

  if ( loading ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
            ></path>
          </svg>
          <p className="text-lg text-gray-700">Đang tải danh sách sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            ></path>
          </svg>
          Mượn sách
        </h1>

        {/* Link tới danh sách phiếu mượn */}
        <div className="mb-6">
          <Link
            href="/books/borrow/borrow-slips"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-6h13m-13 6l-7-7 7-7"
              ></path>
            </svg>
            Xem phiếu mượn
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Tìm kiếm
            </label>
            <input
              id="search"
              value={search}
              onChange={( e ) => setSearch( e.target.value )}
              placeholder="Tìm theo tên sách, tác giả hoặc mã sách..."
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Danh mục
            </label>
            <select
              id="category"
              value={category}
              onChange={( e ) => setCategory( e.target.value )}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map( ( cat ) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ) )}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Books Table */}
        {filteredBooks.length === 0 ? (
          <p className="text-gray-600 text-center py-6">
            Không tìm thấy sách nào.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                  <th className="px-4 py-3 text-left">Mã sách</th>
                  <th className="px-4 py-3 text-left">Tên sách</th>
                  <th className="px-4 py-3 text-left">Tác giả</th>
                  <th className="px-4 py-3 text-left">Số lượng</th>
                  <th className="px-4 py-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map( ( book ) => (
                  <tr
                    key={book.id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-3 text-gray-800">{book.code}</td>
                    <td className="px-4 py-3 text-gray-800">{book.name}</td>
                    <td className="px-4 py-3 text-gray-800">{book.author}</td>
                    <td className="px-4 py-3 text-gray-800">{book.quantity}</td>
                    <td className="px-4 py-3">
                      <button
                        disabled={book.quantity <= 0}
                        onClick={() => addToCart( book.id )}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          ></path>
                        </svg>
                        Thêm mượn
                      </button>
                    </td>
                  </tr>
                ) )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}