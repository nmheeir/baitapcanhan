"use client";

import { useEffect, useState } from "react";

interface BorrowDetail {
  id: string;
  book_id: string;
  quantity: number;
  book_title: string;
}

interface BorrowSlip {
  id: string;
  created_date: string;
  submitted_date: string | null;
  status: "draft" | "submitted";
  details: BorrowDetail[];
}

export default function BorrowSlipsPage() {
  const [slips, setSlips] = useState<BorrowSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  async function fetchSlips() {
    try {
      const res = await fetch("/api/borrow-slips", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch borrow slips");
      const data = await res.json();
      setSlips(data);
    } catch (err) {
      console.error("❌ Failed to fetch borrow slips:", err);
      setError("Không thể tải danh sách phiếu mượn.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlips();
  }, []);

  async function handleSubmitSlip(id: string) {
    if (!confirm("Bạn có chắc muốn gửi phiếu mượn này không? Sau khi gửi sẽ không thể chỉnh sửa.")) {
      return;
    }
    setSubmittingId(id);
    try {
      const res = await fetch(`/api/borrow-slips/${id}/submit`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gửi phiếu thất bại");
      }
      await fetchSlips(); // refresh list
    } catch (err: any) {
      console.error("❌ Submit slip error:", err);
      setError(err.message || "Không thể gửi phiếu mượn.");
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleRemoveBook(slipId: string, detailId: string) {
    if (!confirm("Bạn có chắc muốn xóa cuốn sách này khỏi phiếu mượn?")) return;
    try {
      const res = await fetch(`/api/borrow-slips/${slipId}/details/${detailId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Xóa sách thất bại");
      }
      await fetchSlips(); // refresh list
    } catch (err: any) {
      console.error("❌ Remove book error:", err);
      setError(err.message || "Không thể xóa sách khỏi phiếu mượn.");
    }
  }

  const draftSlips = slips.filter((slip) => slip.status === "draft");
  const submittedSlips = slips.filter((slip) => slip.status === "submitted");

  if (loading) {
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
          <p className="text-lg text-gray-700">Đang tải danh sách phiếu mượn...</p>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Danh sách phiếu mượn
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Draft Slips Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Phiếu mượn nháp</h2>
          {draftSlips.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              Bạn chưa có phiếu mượn nháp nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                    <th className="px-4 py-3 text-left">Mã phiếu</th>
                    <th className="px-4 py-3 text-left">Ngày tạo</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Sách mượn</th>
                    <th className="px-4 py-3 text-left">Số lượng</th>
                    <th className="px-4 py-3 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {draftSlips.map((slip) => (
                    <tr
                      key={slip.id}
                      className="border-b hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-3 text-gray-800">{slip.id}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {new Date(slip.created_date).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">
                          Nháp
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {slip.details.length === 0 ? (
                          <span className="text-gray-500">Chưa có sách</span>
                        ) : (
                          <ul className="space-y-2">
                            {slip.details.map((d) => (
                              <li key={d.id} className="flex items-center justify-between">
                                <span>
                                  {d.book_title} <span className="text-sm text-gray-500">(SL: {d.quantity})</span>
                                </span>
                                <button
                                  onClick={() => handleRemoveBook(slip.id, d.id)}
                                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                                >
                                  Xóa
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {slip.details.length === 0
                          ? "-"
                          : slip.details.reduce(
                              (sum: number, d: BorrowDetail) => sum + d.quantity,
                              0
                            )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSubmitSlip(slip.id)}
                          disabled={submittingId === slip.id || slip.details.length === 0}
                          className={`px-3 py-1 rounded-md text-white transition duration-200 ${
                            submittingId === slip.id || slip.details.length === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {submittingId === slip.id ? "Đang gửi..." : "Gửi phiếu"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Submitted Slips Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Phiếu mượn đã gửi</h2>
          {submittedSlips.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              Bạn chưa có phiếu mượn đã gửi nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                    <th className="px-4 py-3 text-left">Mã phiếu</th>
                    <th className="px-4 py-3 text-left">Ngày tạo</th>
                    <th className="px-4 py-3 text-left">Ngày gửi</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Sách mượn</th>
                    <th className="px-4 py-3 text-left">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedSlips.map((slip) => (
                    <tr
                      key={slip.id}
                      className="border-b hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-3 text-gray-800">{slip.id}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {new Date(slip.created_date).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {slip.submitted_date
                          ? new Date(slip.submitted_date).toLocaleString("vi-VN")
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">
                          Đã gửi
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {slip.details.length === 0 ? (
                          <span className="text-gray-500">Chưa có sách</span>
                        ) : (
                          <ul className="space-y-2">
                            {slip.details.map((d) => (
                              <li key={d.id}>
                                {d.book_title} <span className="text-sm text-gray-500">(SL: {d.quantity})</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {slip.details.length === 0
                          ? "-"
                          : slip.details.reduce(
                              (sum: number, d: BorrowDetail) => sum + d.quantity,
                              0
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}