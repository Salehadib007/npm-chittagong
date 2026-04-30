"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../utils/api.js"; // adjust path
import { useSetup } from "../../../context/SetupContext.jsx"; // adjust path

export default function Register() {
  /* =====================
     SETUP CONTEXT (DB OPTIONS)
  ===================== */
  const { setup, loadingSetup } = useSetup();

  const employees = useMemo(() => {
    const arr = setup?.Employee || [];
    return ["Select", ...arr];
  }, [setup]);

  const departments = useMemo(() => {
    const arr = setup?.Department || [];
    return ["Select", ...arr];
  }, [setup]);

  const designations = useMemo(() => {
    const arr = setup?.Designation || [];
    return ["Select", ...arr];
  }, [setup]);

  /* =====================
     USERS STATE (FROM BACKEND)
  ===================== */
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  /* =====================
     TABLE STATE
  ===================== */
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  /* =====================
     CREATE USER STATE
  ===================== */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    employee: "Select",
    department: "Select",
    designation: "Select",
    username: "",
    password: "",
    confirmPassword: "",
  });

  /* =====================
     EDIT USER STATE
  ===================== */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    employee: "Select",
    department: "Select",
    designation: "Select",
    username: "",
    isActive: true,
  });

  /* =====================
     RESET PASSWORD STATE
  ===================== */
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetForm, setResetForm] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
    showCharacter: false,
  });

  /* =====================
     API: FETCH USERS
  ===================== */
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      // Example: GET /auth
      // your backend should return array
      const res = await api.get("/auth");

      // If backend returns {data: []} adjust here
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsers(list);
    } catch (err) {
      // console.log("Users fetch error:", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =====================
     FILTER + PAGINATION
  ===================== */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const id = String(u._id || "");
      const username = String(u.username || "").toLowerCase();
      const designation = String(u.designation || "").toLowerCase();
      const department = String(u.department || "").toLowerCase();
      const employee = String(u.employee || "").toLowerCase();

      return (
        id.includes(q) ||
        username.includes(q) ||
        designation.includes(q) ||
        department.includes(q) ||
        employee.includes(q)
      );
    });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  /* =====================
     CREATE USER
  ===================== */
  const openCreateModal = () => setIsCreateOpen(true);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreateForm({
      employee: "Select",
      department: "Select",
      designation: "Select",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleRegister = async () => {
    try {
      if (
        createForm.department === "Select" ||
        createForm.designation === "Select" ||
        !createForm.username.trim()
      ) {
        alert("Required fields missing");
        return;
      }

      if (createForm.password !== createForm.confirmPassword) {
        alert("Password mismatch");
        return;
      }

      const payload = {
        employee: createForm.employee === "Select" ? "" : createForm.employee,
        department: createForm.department,
        designation: createForm.designation,
        username: createForm.username.trim(),
        password: createForm.password,
        confirmPassword: createForm.confirmPassword,
      };

      // POST /auth
      await api.post("/auth/register", payload);

      closeCreateModal();
      await fetchUsers();
      setPage(1);
    } catch (err) {
      // console.log("Create user error:", err);
      alert(err?.response?.data?.message || "Failed to create user");
    }
  };

  /* =====================
     EDIT USER
  ===================== */
  const openEditModal = (user) => {
    setEditForm({
      _id: user._id,
      employee: user.employee || "Select",
      department: user.department || "Select",
      designation: user.designation || "Select",
      username: user.username || "",
      isActive: user.isActive ?? true,
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditForm({
      _id: "",
      employee: "Select",
      department: "Select",
      designation: "Select",
      username: "",
      isActive: true,
    });
  };

  const handleUpdateUser = async () => {
    try {
      if (!editForm._id) return;

      if (
        editForm.department === "Select" ||
        editForm.designation === "Select" ||
        !editForm.username.trim()
      ) {
        alert("Required fields missing");
        return;
      }

      const payload = {
        employee: editForm.employee === "Select" ? "" : editForm.employee,
        department: editForm.department,
        designation: editForm.designation,
        username: editForm.username.trim(),
        isActive: editForm.isActive,
      };

      // PUT /auth/:id
      await api.put(`/auth/${editForm._id}`, payload);

      closeEditModal();
      await fetchUsers();
    } catch (err) {
      // console.log("Update user error:", err);
      alert(err?.response?.data?.message || "Failed to update user");
    }
  };

  /* =====================
     DELETE USER
  ===================== */
  const handleDeleteUser = async (user) => {
    try {
      const ok = confirm(`Delete user: ${user.username}?`);
      if (!ok) return;

      await api.delete(`/auth/${user._id}`);
      await fetchUsers();
    } catch (err) {
      // console.log("Delete user error:", err);
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  };

  /* =====================
     RESET PASSWORD
  ===================== */
  const openResetModal = (user) => {
    setSelectedUser(user);
    setResetForm({
      username: user.username,
      newPassword: "",
      confirmPassword: "",
      showCharacter: false,
    });
    setIsResetOpen(true);
  };

  const closeResetModal = () => {
    setIsResetOpen(false);
    setSelectedUser(null);
  };

  const handleResetSubmit = async () => {
    try {
      if (!selectedUser?._id) return;

      if (!resetForm.newPassword.trim()) {
        alert("New password required");
        return;
      }

      if (resetForm.newPassword !== resetForm.confirmPassword) {
        alert("Password mismatch");
        return;
      }

      await api.patch(`/auth/${selectedUser._id}/password`, {
        password: resetForm.newPassword,
        confirmPassword: resetForm.confirmPassword,
      });

      alert("Password updated successfully");
      closeResetModal();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reset password");
    }
  };
  /* =====================
     ESC CLOSE
  ===================== */
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        if (isCreateOpen) closeCreateModal();
        if (isEditOpen) closeEditModal();
        if (isResetOpen) closeResetModal();
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [isCreateOpen, isEditOpen, isResetOpen]);

  /* =====================
     UI
  ===================== */
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg">
        {/* HEADER */}
        <div className="px-4 py-4 border-b flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="w-10 h-10 rounded-full bg-sky-600 text-white text-xl"
            >
              +
            </button>
            <h2 className="font-semibold text-lg">User Create</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-50"
            >
              Refresh
            </button>

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="border px-3 py-2 rounded-lg text-sm w-72"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">Ser No</th>
                <th className="p-3 pl-0 text-left">Username</th>
                <th className="p-3 pl-0 text-left">Designation</th>
                <th className="p-3 pl-0 text-left">Department</th>
                <th className="p-3 pl-0 text-left">Employee</th>
                <th className="p-3 pl-1 text-left">Status</th>
                <th className="text-center">Options</th>
              </tr>
            </thead>

            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentData.map((u, idx) => (
                  <tr key={u._id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{startIndex + idx + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.designation}</td>
                    <td>{u.department}</td>
                    <td>{u.employee || "-"}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.isActive ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => openEditModal(u)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                        >
                          EDIT
                        </button>

                        <button
                          onClick={() => openResetModal(u)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                        >
                          RESET
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg text-xs font-semibold"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 flex justify-between items-center text-sm">
          <p>
            Showing {filtered.length ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + itemsPerPage, filtered.length)} of{" "}
            {filtered.length}
          </p>

          <div className="flex gap-1">
            <button
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">{safePage}</span>
            <button
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <ModalShell onClose={closeCreateModal}>
          <div className="bg-white p-6 rounded-xl max-w-xl w-full">
            <h3 className="text-xl font-semibold mb-4">Create User</h3>

            {loadingSetup && (
              <p className="text-sm text-gray-500 mb-3">Loading setup...</p>
            )}

            <FieldSelect
              label="Employee"
              options={employees}
              value={createForm.employee}
              onChange={(v) => setCreateForm((p) => ({ ...p, employee: v }))}
            />

            <FieldSelect
              label="Department"
              options={departments}
              value={createForm.department}
              onChange={(v) => setCreateForm((p) => ({ ...p, department: v }))}
            />

            <FieldSelect
              label="Designation"
              options={designations}
              value={createForm.designation}
              onChange={(v) => setCreateForm((p) => ({ ...p, designation: v }))}
            />

            <FieldInput
              label="Username"
              value={createForm.username}
              onChange={(v) => setCreateForm((p) => ({ ...p, username: v }))}
            />

            <FieldInput
              label="Password"
              type="password"
              value={createForm.password}
              onChange={(v) => setCreateForm((p) => ({ ...p, password: v }))}
            />

            <FieldInput
              label="Confirm Password"
              type="password"
              value={createForm.confirmPassword}
              onChange={(v) =>
                setCreateForm((p) => ({ ...p, confirmPassword: v }))
              }
            />

            <button
              onClick={handleRegister}
              className="mt-4 bg-sky-600 text-white px-6 py-2 rounded"
            >
              REGISTER
            </button>
          </div>
        </ModalShell>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && (
        <ModalShell onClose={closeEditModal}>
          <div className="bg-white p-6 rounded-xl max-w-xl w-full">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>

            <FieldSelect
              label="Employee"
              options={employees}
              value={editForm.employee}
              onChange={(v) => setEditForm((p) => ({ ...p, employee: v }))}
            />

            <FieldSelect
              label="Department"
              options={departments}
              value={editForm.department}
              onChange={(v) => setEditForm((p) => ({ ...p, department: v }))}
            />

            <FieldSelect
              label="Designation"
              options={designations}
              value={editForm.designation}
              onChange={(v) => setEditForm((p) => ({ ...p, designation: v }))}
            />

            <FieldInput
              label="Username"
              value={editForm.username}
              onChange={(v) => setEditForm((p) => ({ ...p, username: v }))}
            />

            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                value={String(editForm.isActive)}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    isActive: e.target.value === "true",
                  }))
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <button
              onClick={handleUpdateUser}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded"
            >
              UPDATE
            </button>
          </div>
        </ModalShell>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetOpen && (
        <ModalShell onClose={closeResetModal}>
          <div className="bg-white p-6 rounded-xl max-w-xl w-full">
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>

            <FieldInput label="User Name" value={resetForm.username} />

            <FieldInput
              label="New Password"
              type={resetForm.showCharacter ? "text" : "password"}
              value={resetForm.newPassword}
              onChange={(v) => setResetForm((p) => ({ ...p, newPassword: v }))}
            />

            <FieldInput
              label="Confirm Password"
              type={resetForm.showCharacter ? "text" : "password"}
              value={resetForm.confirmPassword}
              onChange={(v) =>
                setResetForm((p) => ({ ...p, confirmPassword: v }))
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={resetForm.showCharacter}
                onChange={(e) =>
                  setResetForm((p) => ({
                    ...p,
                    showCharacter: e.target.checked,
                  }))
                }
              />
              Show Character
            </label>

            <button
              onClick={handleResetSubmit}
              className="mt-4 bg-sky-600 text-white px-6 py-2 rounded"
            >
              SUBMIT
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* =====================
   MODAL SHELL
===================== */
function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl p-3">{children}</div>
    </div>
  );
}

/* =====================
   FIELD COMPONENTS
===================== */
function FieldInput({ label, value, onChange = () => {}, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
