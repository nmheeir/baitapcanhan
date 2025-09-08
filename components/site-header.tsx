"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SiteHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle change password (chuyển trang)
  const handleChangePassword = () => {
    router.push("/auth/change-password");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Thông tin sinh viên</h1>

          <div className="flex space-x-3">
            {/* Nút đổi mật khẩu */}
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Đổi mật khẩu
            </button>

            {/* Nút đăng xuất */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
