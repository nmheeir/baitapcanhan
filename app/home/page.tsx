'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Trang dashboard - yêu cầu đăng nhập
 */
export default function DashboardPage () {
  const router = useRouter();
  const [loading, setLoading] = useState( false );

  // Handle logout
  const handleLogout = async () => {
    setLoading( true );

    try {
      const response = await fetch( '/api/auth/logout', {
        method: 'POST',
      } );

      if ( response.ok ) {
        router.push( '/auth/login' );
      } else {
        console.error( 'Logout failed' );
      }
    } catch ( error ) {
      console.error( 'Logout error:', error );
    } finally {
      setLoading( false );
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50">
    //   {/* Header */}
    //   <header className="bg-white shadow">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between items-center py-6">
    //         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
    //         <button
    //           onClick={handleLogout}
    //           disabled={loading}
    //           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //         >
    //           {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    //         </button>
    //       </div>
    //     </div>
    //   </header>

    //   {/* Main content */}
    //   <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    //     <div className="px-4 py-6 sm:px-0">
    //       <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
    //         <div className="text-center">
    //           <h2 className="text-2xl font-semibold text-gray-900 mb-4">
    //             Chào mừng bạn đến với Dashboard!
    //           </h2>
    //           <p className="text-gray-600 mb-6">
    //             Bạn đã đăng nhập thành công. Đây là khu vực được bảo vệ chỉ dành cho người dùng đã xác thực.
    //           </p>

    //           {/* Feature cards */}
    //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    //             <div className="bg-white p-6 rounded-lg shadow">
    //               <div className="text-indigo-600 mb-4">
    //                 <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    //                 </svg>
    //               </div>
    //               <h3 className="text-lg font-medium text-gray-900 mb-2">Hồ sơ cá nhân</h3>
    //               <p className="text-gray-600 text-sm">Quản lý thông tin tài khoản của bạn</p>
    //             </div>

    //             <div className="bg-white p-6 rounded-lg shadow">
    //               <div className="text-green-600 mb-4">
    //                 <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    //                 </svg>
    //               </div>
    //               <h3 className="text-lg font-medium text-gray-900 mb-2">Bảo mật</h3>
    //               <p className="text-gray-600 text-sm">Tài khoản của bạn được bảo vệ an toàn</p>
    //             </div>

    //             <div className="bg-white p-6 rounded-lg shadow">
    //               <div className="text-purple-600 mb-4">
    //                 <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    //                 </svg>
    //               </div>
    //               <h3 className="text-lg font-medium text-gray-900 mb-2">Cài đặt</h3>
    //               <p className="text-gray-600 text-sm">Tùy chỉnh trải nghiệm của bạn</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Thông tin sinh viên</h1>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Thông tin sinh viên */}
        <div className="grid grid-cols-3 gap-4 bg-white shadow rounded-lg p-4">
          {/* Ảnh sinh viên */}
          <div className="col-span-1 flex items-center justify-center border">
            <span className="text-gray-500">Ảnh sinh viên</span>
          </div>

          {/* Thông tin */}
          <div className="col-span-2 border p-4 space-y-2">
            <p>Số thứ tự trong danh sách lớp: <span className="font-semibold">01</span></p>
            <p>Họ và tên: <span className="font-semibold">Nguyễn Văn A</span></p>
            <p>Mã số sinh viên: <span className="font-semibold">SV123456</span></p>
          </div>
        </div>

        {/* Menu + Nội dung chính */}
        <div className="grid grid-cols-3 gap-4 flex-1">
          {/* Menu */}
          <div className="col-span-1 bg-white shadow rounded-lg p-4">
            <p className="font-semibold mb-2">Menu</p>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-indigo-600 cursor-pointer">Trang chủ</li>
              <li className="hover:text-indigo-600 cursor-pointer">Hồ sơ</li>
              <li className="hover:text-indigo-600 cursor-pointer">Kết quả học tập</li>
              <li className="hover:text-indigo-600 cursor-pointer">Cài đặt</li>
            </ul>
          </div>

          {/* Nội dung chính */}
          <div className="col-span-2 bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">Nội dung chính hiển thị tại đây...</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">
        Thông tin bản quyền của sinh viên
      </footer>
    </div>

  );
}