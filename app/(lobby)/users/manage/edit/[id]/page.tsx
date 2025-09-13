"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, rolesRes] = await Promise.all([
          fetch(`/api/users/${id}`, { credentials: "include" }),
          fetch("/api/roles", { credentials: "include" }),
        ]);
        const userData = await userRes.json();
        const rolesData = await rolesRes.json();
        setForm(userData);
        setRoles(rolesData);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
    }
    fetchData();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("UPDATE_ERROR");
      alert("Cập nhật user thành công");
      router.push("/users/manage");
    } catch (err) {
      console.error("❌ Failed to update user:", err);
      alert("Không thể cập nhật user");
    }
  }

  if (!form) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-2">
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"></path>
        </svg>
        <p className="text-lg text-gray-700">Đang tải...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
          </svg>
          Chỉnh sửa thông tin người dùng
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              id="username"
              name="username"
              value={form.username || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              id="full_name"
              name="full_name"
              value={form.full_name || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
            <input
              id="student_id"
              name="student_id"
              value={form.student_id || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              id="phone"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Vai trò</label>
            <select
              id="role_id"
              name="role_id"
              value={form.role_id || ""}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="" disabled>Chọn vai trò</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              id="is_verified"
              type="checkbox"
              name="is_verified"
              checked={form.is_verified}
              onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-700">Đã xác thực</label>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}