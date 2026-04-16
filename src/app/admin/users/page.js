"use client";
import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI } from "@/lib/api";
import { unwrapList } from "@/lib/unwrapList";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, AlertCircle, X, CheckCircle2 } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState(null);

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    fetchUsers();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getUsers({ limit: 50 }),
        adminAPI.getStats()
      ]);
      
      if (!isMountedRef.current) return;
      
      setUsers(unwrapList(usersRes.data));
      setStats(statsRes.data);
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({ name: "", email: "", role: "user" });
    setFormError("");
    setFormSuccess("");
    setAddModal(true);
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user"
    });
    setFormError("");
    setFormSuccess("");
    setEditModal(user);
  };

  const handleAddUser = async () => {
    setFormError("");
    setFormSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and email are required");
      return;
    }

    setFormLoading(true);
    try {
      await adminAPI.createUser(formData);
      setFormSuccess("User created successfully!");
      setAddModal(false);
      setTimeout(() => fetchUsers(), 500);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async () => {
    setFormError("");
    setFormSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Name and email are required");
      return;
    }

    setFormLoading(true);
    try {
      await adminAPI.updateUser(editModal._id, formData);
      setFormSuccess("User updated successfully!");
      setEditModal(null);
      setTimeout(() => fetchUsers(), 500);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      await adminAPI.deleteUser(deleteModal._id);
      setFormSuccess("User deleted successfully!");
      setDeleteModal(null);
      setTimeout(() => fetchUsers(), 500);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Industrial standard user administration and control</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchUsers}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Sync
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Platform Users", value: stats?.totalUsers || 0, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
          { label: "Admin Accounts", value: users.filter(u => u.role === "admin").length || 0, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Regular Users", value: users.filter(u => u.role !== "admin").length || 0, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border ${item.bg} ${item.border} p-6 transition-transform hover:scale-[1.02] duration-300`}>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
            <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 font-black text-slate-600 uppercase text-[11px] tracking-wider">User</th>
                  <th className="text-left px-6 py-3 font-black text-slate-600 uppercase text-[11px] tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 font-black text-slate-600 uppercase text-[11px] tracking-wider">Joined</th>
                  <th className="text-right px-6 py-3 font-black text-slate-600 uppercase text-[11px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center text-xs font-black text-emerald-700 border border-emerald-200">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border ${user.role === "admin" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {user.role === "admin" && <CheckCircle2 size={12} />}
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100" 
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => setDeleteModal(user)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100" 
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(addModal || editModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">{editModal ? "Edit User" : "Add New User"}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{editModal ? "Update user information" : "Create a new user account"}</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700">{formSuccess}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-wide">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-wide">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-wide">User Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setAddModal(false);
                  setEditModal(null);
                  setFormError("");
                  setFormSuccess("");
                }}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editModal ? handleEditUser : handleAddUser}
                disabled={formLoading}
                className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2"
              >
                {formLoading && <Loader2 size={14} className="animate-spin" />}
                {editModal ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 py-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete User?</h3>
              <p className="text-sm text-slate-500 mb-2">
                Are you sure you want to permanently delete{" "}
                <span className="font-black text-slate-700">{deleteModal.name}</span>?
              </p>
              <p className="text-xs text-slate-400">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModal(null);
                  setFormError("");
                }}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={formLoading}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2"
              >
                {formLoading && <Loader2 size={14} className="animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
