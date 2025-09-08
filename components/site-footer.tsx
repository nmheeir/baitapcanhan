export default function SiteFooter() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          {/* Bản quyền */}
          <p className="mb-4 sm:mb-0">
            © {new Date().getFullYear()} MinhHai's Website. All rights reserved.
          </p>

          {/* Liên kết */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-600">Giới thiệu</a>
            <a href="#" className="hover:text-indigo-600">Liên hệ</a>
            <a href="#" className="hover:text-indigo-600">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
