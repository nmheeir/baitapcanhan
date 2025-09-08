'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from "@/components/password-input";

/**
 * Trang đăng ký tài khoản
 */
export default function RegisterPage () {
  const router = useRouter();
  const [formData, setFormData] = useState( {
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  } );
  const [loading, setLoading] = useState( false );
  const [message, setMessage] = useState( "" );
  const [error, setError] = useState( "" );

  // Handle form input changes
  const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    setFormData( {
      ...formData,
      [e.target.name]: e.target.value,
    } );
  };

  // Handle form submission
  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();
    setLoading( true );
    setError( "" );
    setMessage( "" );

    // Check confirm password
    if ( formData.password !== formData.confirmPassword ) {
      setError( "Mật khẩu xác nhận không khớp" );
      setLoading( false );
      return;
    }

    try {
      const response = await fetch( "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( formData ),
      } );

      const data = await response.json();

      if ( response.ok ) {
        setMessage( data.message );
        // Reset form
        setFormData( {
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        } );
        // Redirect to login after 3 seconds
        setTimeout( () => {
          router.push( "/auth/login" );
        }, 3000 );
      } else {
        setError( data.error );
      }
    } catch ( error ) {
      console.error( "Registration error:", error );
      setError( "Có lỗi xảy ra. Vui lòng thử lại." );
    } finally {
      setLoading( false );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Username */}
            <div>
              <label htmlFor="username" className="sr-only">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="sr-only">
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
              />
            </div>
          </div>

          {/* Password requirements */}
          <div className="text-sm text-gray-600">
            <p className="font-medium">Yêu cầu mật khẩu:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Ít nhất 8 ký tự</li>
              <li>Có ít nhất 1 chữ hoa</li>
              <li>Có ít nhất 1 chữ thường</li>
              <li>Có ít nhất 1 số</li>
            </ul>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
