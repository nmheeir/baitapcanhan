"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch session user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("❌ Failed to fetch session:", err);
      }
    }
    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
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

  // Handle change password
  const handleChangePassword = () => {
    router.push("/auth/change-password");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Title */}
          <Link href="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
            </svg>
            <h1 className="text-xl font-bold text-gray-900">Quản lý Thư viện</h1>
          </Link>

          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              {user?.role_name === "Admin" && (
                <>
                  <Link
                    href="/books/manage"
                    className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
                  >
                    Quản lý sách
                  </Link>
                  <Link
                    href="/users/manage"
                    className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
                  >
                    Quản lý người dùng
                  </Link>
                </>
              )}
              {user?.role_name === "Librarian" && (
                <Link
                  href="/books/manage"
                  className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
                >
                  Quản lý sách
                </Link>
              )}
            </nav>

            {/* User Info and Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <span className="text-gray-800 font-semibold">{user.username}</span>
                  <span className="text-sm text-gray-500">({user.role_name})</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {/* <Link href="/books/borrow">
                Mượn sách
                </Link> */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                    {/* Mobile Menu Links */}
                    <div className="md:hidden">
                      {user?.role_name === "Admin" && (
                        <>
                          <Link
                            href="/books/manage"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Quản lý sách
                          </Link>
                          <Link
                            href="/users/manage"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Quản lý người dùng
                          </Link>
                        </>
                      )}
                      {user?.role_name === "Librarian" && (
                        <Link
                          href="/books/manage"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Quản lý sách
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        handleChangePassword();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đổi mật khẩu
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      disabled={loading}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}