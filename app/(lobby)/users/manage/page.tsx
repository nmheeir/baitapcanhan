"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccessDenied from "@/app/access-denied";
import { log } from "node:util";

export default function ManageUsersPage () {
  const [currentUser, setCurrentUser] = useState<any>( null );
  const [users, setUsers] = useState<any[]>( [] );
  const [filteredUsers, setFilteredUsers] = useState<any[]>( [] );
  const [loading, setLoading] = useState( true );
  const [forbidden, setForbidden] = useState( false );
  const [roles, setRoles] = useState<any[]>( [] );

  // Bộ lọc
  const [search, setSearch] = useState( "" );
  const [roleFilter, setRoleFilter] = useState( "" );
  const [statusFilter, setStatusFilter] = useState( "" );

  useEffect( () => {
    async function fetchMe () {
      const res = await fetch( "/api/auth/session", { credentials: "include" } );
      if ( res.ok ) {
        const data = await res.json();
        console.log( data );
        setCurrentUser( data );
      }
    }
    fetchMe();
  }, [] );

  useEffect( () => {
    async function fetchRoles () {
      try {
        const res = await fetch( "/api/roles", { credentials: "include" } );
        if ( !res.ok ) throw new Error( "FETCH_ROLES_ERROR" );
        const data = await res.json();
        setRoles( data );
      } catch ( e ) {
        console.error( "❌ Failed to fetch roles:", e );
      }
    }
    fetchRoles();
  }, [] );

  async function fetchUsers () {
    try {
      const res = await fetch( "/api/users/manage", { credentials: "include" } );
      if ( res.status === 403 ) {
        setForbidden( true );
        return;
      }
      if ( !res.ok ) throw new Error( "FETCH_ERROR" );
      const data = await res.json();
      console.log( data );

      setUsers( data );
      setFilteredUsers( data );
    } catch ( e ) {
      console.error( "❌ Failed to fetch users:", e );
    } finally {
      setLoading( false );
    }
  }

  async function deleteUser ( id: string ) {
    if ( !confirm( "Bạn có chắc muốn xóa user này?" ) ) return;
    try {
      const res = await fetch( `/api/users/${ id }`, {
        method: "DELETE",
        credentials: "include",
      } );
      if ( !res.ok ) throw new Error( "DELETE_ERROR" );
      setUsers( ( prev ) => prev.filter( ( u ) => u.id !== id ) );
    } catch ( e ) {
      console.error( "❌ Failed to delete user:", e );
      alert( "Không thể xóa user" );
    }
  }

  async function lockUser ( userId: string ) {
    if ( !confirm( "Bạn có chắc muốn khóa tài khoản này không?" ) ) return;

    try {
      const res = await fetch( `/api/users/${ userId }/lock`, {
        method: "PATCH",
        credentials: "include",
      } );

      if ( !res.ok ) {
        throw new Error( "Failed to lock user" );
      }

      alert( "✅ Tài khoản đã bị khóa" );
      // Có thể reload hoặc cập nhật lại danh sách người dùng
    } catch ( err ) {
      console.error( err );
      alert( "❌ Không thể khóa tài khoản" );
    }
  }


  // Apply filters
  useEffect( () => {
    let result = [...users];

    if ( search.trim() ) {
      const s = search.toLowerCase();
      result = result.filter(
        ( u ) =>
          u.username?.toLowerCase().includes( s ) ||
          u.email?.toLowerCase().includes( s ) ||
          u.full_name?.toLowerCase().includes( s )
      );
    }

    if ( roleFilter ) {
      result = result.filter( ( u ) => u.role_name === roleFilter );
    }

    if ( statusFilter ) {
      const verified = statusFilter === "verified";
      result = result.filter( ( u ) => !!u.is_verified === verified );
    }

    setFilteredUsers( result );
  }, [search, roleFilter, statusFilter, users] );

  useEffect( () => {
    fetchUsers();
  }, [] );

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <div className="flex items-center space-x-2">
  //         <svg
  //           className="animate-spin h-5 w-5 text-blue-600"
  //           xmlns="http://www.w3.org/2000/svg"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //         >
  //           <circle
  //             className="opacity-25"
  //             cx="12"
  //             cy="12"
  //             r="10"
  //             stroke="currentColor"
  //             strokeWidth="4"
  //           ></circle>
  //           <path
  //             className="opacity-75"
  //             fill="currentColor"
  //             d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
  //           ></path>
  //         </svg>
  //         <p className="text-lg text-gray-700">
  //           Đang tải danh sách người dùng...
  //         </p>
  //       </div>
  //     </div>
  //   );

  if ( forbidden ) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-8 lg:px-12">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Quản lý người dùng
          </h1>
          <Link
            href="/users/manage/add"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Thêm người dùng
          </Link>
        </div>

        {/* 🔍 Thanh tìm kiếm */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mb-6">
          <input
            type="text"
            placeholder="Tìm theo tên / email / họ tên"
            value={search}
            onChange={( e ) => setSearch( e.target.value )}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
          <select
            value={roleFilter}
            onChange={( e ) => setRoleFilter( e.target.value )}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map( ( role ) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ) )}
          </select>
          <select
            value={statusFilter}
            onChange={( e ) => setStatusFilter( e.target.value )}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="verified">Đã xác thực</option>
            <option value="unverified">Chưa xác thực</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-gray-600 text-center py-6">
            Không có người dùng nào.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                  <th className="px-4 py-3 text-left">Tên đăng nhập</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Họ và tên</th>
                  <th className="px-4 py-3 text-left">Mã sinh viên</th>
                  <th className="px-4 py-3 text-left">Số điện thoại</th>
                  <th className="px-4 py-3 text-left">Vai trò</th>
                  <th className="px-4 py-3 text-left">Xác thực</th>
                  <th className="px-4 py-3 text-left">Ngày tạo</th>
                  <th className="px-4 py-3 text-left">Trạng thái khóa</th>
                  <th className="px-4 py-3 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map( ( u ) => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-3 text-gray-800">{u.username}</td>
                    <td className="px-4 py-3 text-gray-800">{u.email}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {u.full_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {u.student_id || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{u.phone || "-"}</td>
                    <td className="px-4 py-3 text-gray-800">{u.role_name}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {u.is_verified ? "✔️" : "❌"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {new Date( u.created_at ).toLocaleDateString( "vi-VN" )}
                    </td>
                    {/* 🔥 Cột trạng thái khóa */}
                    <td className="px-4 py-3 text-gray-800">
                      {u.locked_until
                        ? new Date( u.locked_until ).toLocaleDateString( "vi-VN" )
                        : "Không"}
                    </td>
                    <td className="px-4 py-3 space-x-2 flex">
                      {/* Sửa */}
                      <Link
                        href={`/users/manage/edit/${ u.id }`}
                        className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Sửa
                      </Link>
                      {/* Xóa */}
                      {!( u.id === currentUser?.id && u.role_name === "Admin" ) && (
                        <button
                          onClick={() => deleteUser( u.id )}
                          className="inline-flex items-center px-3 py-1 rounded-md transition duration-200 bg-red-600 text-white hover:bg-red-700"
                        >
                          Xóa
                        </button>
                      )}

                      {/* Khóa */}
                      {!( u.id === currentUser?.id && u.role_name === "Admin" ) && (
                        <button
                          onClick={() => lockUser( u.id )}
                          className="inline-flex items-center px-3 py-1 rounded-md transition duration-200 bg-gray-600 text-white hover:bg-gray-700"
                        >
                          Khóa
                        </button>
                      )}

                    </td>


                  </tr>
                ) )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
