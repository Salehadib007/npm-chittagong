import { useEffect, useMemo, useState } from "react";
import api from "../../../utils/api.js";
import { useSetup } from "../../../context/SetupContext.jsx"; // adjust path

export default function Users() {
  const { setup, loadingSetup } = useSetup();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // modals
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // search
  const [search, setSearch] = useState("");

  // edit form
  const [editForm, setEditForm] = useState({
    employee: "",
    department: "",
    designation: "",
    access: "",
    isActive: true,
  });

  // password form
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  // ==============================
  // Setup Options (from context)
  // ==============================
  const setupData = useMemo(() => {
    if (!setup) return null;
    // if backend returns array
    if (Array.isArray(setup)) return setup[0] || null;
    // if backend returns object
    return setup;
  }, [setup]);

  const setupOptions = (key) => {
    const arr = setupData?.[key];
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    return [];
  };

  // ==============================
  // Fetch users
  // ==============================
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/auth");
      setUsers(res.data || []);
    } catch (err) {
      // console.log("Fetch users error:", err);
      alert(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==============================
  // Filter users
  // ==============================
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();

    return users.filter((u) => {
      const accessText = Array.isArray(u?.access)
        ? u.access.join(", ")
        : u?.access;
      return (
        (u?.username || "").toLowerCase().includes(q) ||
        (u?.employee || "").toLowerCase().includes(q) ||
        (u?.department || "").toLowerCase().includes(q) ||
        (u?.designation || "").toLowerCase().includes(q) ||
        (accessText || "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  // ==============================
  // Open edit modal
  // ==============================
  const handleOpenEdit = (user) => {
    setSelectedUser(user);

    setEditForm({
      employee: user?.employee || "",
      department: user?.department || "",
      designation: user?.designation || "",
      access: Array.isArray(user?.access)
        ? user.access[0] || ""
        : user?.access || "",
      isActive: user?.isActive ?? true,
    });

    setOpenEdit(true);
  };

  // ==============================
  // Open password modal
  // ==============================
  const handleOpenPassword = (user) => {
    setSelectedUser(user);
    setPasswordForm({ password: "", confirmPassword: "" });
    setOpenPassword(true);
  };

  // ==============================
  // Update user
  // ==============================
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) return;

    try {
      const payload = {
        ...editForm,
        access: editForm.access ? [editForm.access] : [],
      };

      const res = await api.put(`/auth/${selectedUser._id}`, payload);

      alert(res?.data?.message || "User updated");
      setOpenEdit(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      // console.log("Update user error:", err);
      alert(err?.response?.data?.message || "Failed to update user");
    }
  };

  // ==============================
  // Delete user
  // ==============================
  const handleDeleteUser = async (user) => {
    if (!user?._id) return;
    const ok = confirm(`Delete user "${user.username}" ?`);
    if (!ok) return;

    try {
      const res = await api.delete(`/auth/${user._id}`);
      alert(res?.data?.message || "User deleted");
      await fetchUsers();
    } catch (err) {
      // console.log("Delete user error:", err);
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  };

  // ==============================
  // Update password
  // ==============================
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) return;

    if (!passwordForm.password || !passwordForm.confirmPassword) {
      return alert("Password and Confirm Password required");
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await api.patch(
        `/auth/${selectedUser._id}/password`,
        passwordForm,
      );

      alert(res?.data?.message || "Password updated");
      setOpenPassword(false);
      setSelectedUser(null);
      setPasswordForm({ password: "", confirmPassword: "" });
    } catch (err) {
      // console.log("Password update error:", err);
      alert(err?.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div style={page}>
      {/* Header */}
      <div style={headerRow}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
            User Management
          </h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
            Manage users, access, and passwords.
          </p>
        </div>

        <button onClick={fetchUsers} style={primaryBtn}>
          Refresh
        </button>
      </div>

      {/* Search */}
      <div style={card}>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      {/* Table */}
      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead className=" items-start">
              <tr>
                <th style={th}>Ser No</th>
                <th style={th}>Username</th>
                <th style={th}>Employee</th>
                <th style={th}>Department</th>
                <th style={th}>Designation</th>
                <th style={th}>Access</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingUsers ? (
                <tr>
                  <td style={td} colSpan={8}>
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td style={td} colSpan={8}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={td}>{idx + 1}</td>
                    <td style={td}>
                      <div style={{ fontWeight: 800 }}>{u.username}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {u._id}
                      </div>
                    </td>
                    <td style={td}>{u.employee || "-"}</td>
                    <td style={td}>{u.department || "-"}</td>
                    <td style={td}>{u.designation || "-"}</td>
                    <td style={td}>
                      <span style={pill}>
                        {Array.isArray(u.access)
                          ? u.access.join(", ")
                          : u.access || "-"}
                      </span>
                    </td>
                    <td style={td}>
                      {u.isActive ? (
                        <span
                          style={{
                            ...pill,
                            background: "#ecfdf5",
                            borderColor: "#a7f3d0",
                          }}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          style={{
                            ...pill,
                            background: "#fef2f2",
                            borderColor: "#fecaca",
                          }}
                        >
                          Inactive
                        </span>
                      )}
                    </td>

                    <td style={{ ...td, textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 8,
                        }}
                      >
                        <button
                          style={ghostBtn}
                          onClick={() => handleOpenEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          style={ghostBtn}
                          onClick={() => handleOpenPassword(u)}
                        >
                          Password
                        </button>
                        <button
                          style={dangerBtn}
                          onClick={() => handleDeleteUser(u)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {openEdit && (
        <Modal title="Edit User" onClose={() => setOpenEdit(false)}>
          {loadingSetup ? (
            <div style={{ padding: 10 }}>Loading setup...</div>
          ) : (
            <form onSubmit={handleUpdateUser}>
              <div style={modalGrid}>
                <Field label="Employee">
                  <select
                    style={input}
                    value={editForm.employee}
                    onChange={(e) =>
                      setEditForm({ ...editForm, employee: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {setupOptions("Employee").map((x, i) => (
                      <option key={i} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Department">
                  <select
                    style={input}
                    value={editForm.department}
                    onChange={(e) =>
                      setEditForm({ ...editForm, department: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {setupOptions("Department").map((x, i) => (
                      <option key={i} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Designation">
                  <select
                    style={input}
                    value={editForm.designation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, designation: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {setupOptions("Designation").map((x, i) => (
                      <option key={i} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Access">
                  <select
                    style={input}
                    value={editForm.access}
                    onChange={(e) =>
                      setEditForm({ ...editForm, access: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {(setupOptions("Access").length
                      ? setupOptions("Access")
                      : ["ADMIN", "USER", "OPERATOR"]
                    ).map((x, i) => (
                      <option key={i} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Active">
                  <select
                    style={input}
                    value={String(editForm.isActive)}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        isActive: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Field>
              </div>

              <div style={modalActions}>
                <button
                  type="button"
                  style={ghostBtn}
                  onClick={() => setOpenEdit(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={primaryBtn}>
                  Update User
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* ================= PASSWORD MODAL ================= */}
      {openPassword && (
        <Modal title="Update Password" onClose={() => setOpenPassword(false)}>
          <form onSubmit={handleUpdatePassword}>
            <div style={modalGrid}>
              <Field label="New Password">
                <input
                  type="password"
                  style={input}
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Confirm Password">
                <input
                  type="password"
                  style={input}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Field>
            </div>

            <div style={modalActions}>
              <button
                type="button"
                style={ghostBtn}
                onClick={() => setOpenPassword(false)}
              >
                Cancel
              </button>
              <button type="submit" style={primaryBtn}>
                Update Password
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================= UI Components ================= */

function Modal({ title, children, onClose }) {
  return (
    <div style={backdrop}>
      <div style={modal}>
        <div style={modalHeader}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              {title}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Update information and save changes.
            </p>
          </div>
          <button onClick={onClose} style={ghostBtn}>
            ✕
          </button>
        </div>

        <div style={{ marginTop: 14 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ================= Styles ================= */

const page = {
  padding: 20,
  background: "#f8fafc",
  minHeight: "100vh",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 16,
};

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 14,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  marginBottom: 14,
};

const searchInput = {
  width: "min(520px, 100%)",
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: 14,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "0px 10px",
  textAlign: "left",
  fontSize: 13,
  color: "#475569",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

const td = {
  padding: "0px 10px",
  fontSize: 14,
  color: "#0f172a",
  verticalAlign: "top",
};

const pill = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 10px",
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  background: "#f1f5f9",
  fontSize: 12,
  fontWeight: 800,
};

const input = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: 14,
};

const modalGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  marginBottom: 14,
};

const modalActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #0f172a",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const ghostBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};

const dangerBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #fecaca",
  background: "#fff1f2",
  cursor: "pointer",
  fontWeight: 900,
};

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  zIndex: 9999,
};

const modal = {
  width: "min(920px, 96vw)",
  background: "#fff",
  borderRadius: 18,
  padding: 16,
  border: "1px solid #e2e8f0",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "flex-start",
};
