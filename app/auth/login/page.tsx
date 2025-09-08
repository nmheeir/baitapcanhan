'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from "@/components/password-input";

/**
 * Trang đăng nhập
 */
export default function LoginPage () {
  const router = useRouter();
  const [formData, setFormData] = useState( {
    email: '',
    password: '',
  } );
  const [loading, setLoading] = useState( false );
  const [error, setError] = useState( '' );

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
    setError( '' );

    try {
      const response = await fetch( '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( formData ),
      } );

      const data = await response.json();

      if ( response.ok ) {
        // Redirect to dashboard on successful login
        router.push( '/home' );
      } else {
        setError( data.error );
      }
    } catch ( error ) {
      console.error( 'Login error:', error );
      setError( 'Có lỗi xảy ra. Vui lòng thử lại.' );
    } finally {
      setLoading( false );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <PasswordInput
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}