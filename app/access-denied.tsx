"use client";

import Head from 'next/head';

export default function AccessDenied() {
  return (
    <>
      <Head>
        <title>Không có quyền truy cập</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Không có quyền truy cập</h1>
          <p className="text-gray-700 text-lg mb-6">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    </>
  );
}