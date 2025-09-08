
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Image from "next/image";

/**
 * Trang dashboard - yêu cầu đăng nhập
 */
export default function DashboardPage () {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <SiteHeader />

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
              className="object-cover"
            />
          </div>


          {/* Thông tin */}
          <div className="col-span-2 border p-4 space-y-2">
            <p>Số thứ tự trong danh sách lớp: <span className="font-semibold">15</span></p>
            <p>Họ và tên: <span className="font-semibold">Nguyễn Minh Hải</span></p>
            <p>Mã số sinh viên: <span className="font-semibold">CT07N0115</span></p>
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
      <SiteFooter />
    </div>

  );
}