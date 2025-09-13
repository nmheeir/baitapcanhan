"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    student_id: "",
    phone: "",
    password: "",
    role_id: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");

  useEffect(() => {
    fetch("/api/roles", { credentials: "include" })
      .then((res) => res.json())
      .then(setRoles)
      .catch((e) => console.error("❌ Failed to fetch roles:", e));
  }, []);

  function validatePassword(password: string): string {
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
    if (!/[0-9]/.test(password)) return "Mật khẩu phải chứa ít nhất 1 số";
    return "";
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const err = validatePassword(form.password);
    if (err) {
      setPasswordError(err);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, verification_token: "init-token" }),
      });
      if (!res.ok) throw new Error("CREATE_ERROR");
      router.push("/users/manage");
    } catch (err) {
      console.error("❌ Failed to create user:", err);
      alert("Không thể tạo user");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-green-600"
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
          Thêm người dùng mới
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              id="full_name"
              name="full_name"
              placeholder="Nhập họ và tên"
              value={form.full_name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
              Mã sinh viên
            </label>
            <input
              id="student_id"
              name="student_id"
              placeholder="Nhập mã sinh viên"
              value={form.student_id}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              className={`mt-1 w-full rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              id="role_id"
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              required
            >
              <option value="" disabled>
                Chọn vai trò
              </option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/users/manage")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
