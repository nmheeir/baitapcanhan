"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role_name: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Fetch session error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Bạn chưa đăng nhập
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Main layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Thông tin sinh viên */}
        <div className="grid grid-cols-3 gap-4 bg-white shadow rounded-lg p-4">
          {/* Ảnh sinh viên */}
          <div className="col-span-1 flex items-center justify-center border relative w-40 h-40">
            <Image
              src="/images/avatar.JPG"
              alt="Avatar image"
              fill
              className="object-cover rounded-full"
            />
          </div>

          {/* Thông tin */}
          <div className="col-span-2 border p-4 space-y-2">
            <p>
              Họ và tên:{" "}
              <span className="font-semibold">{user.username}</span>
            </p>
            <p>
              Email: <span className="font-semibold">{user.email}</span>
            </p>
            <p>
              Vai trò:{" "}
              <span className="font-semibold capitalize">{user.role_name}</span>
            </p>
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
            <p className="text-gray-600">
              Xin chào <span className="font-semibold">{user.username}</span>!  
              Đây là trang Dashboard của bạn.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
