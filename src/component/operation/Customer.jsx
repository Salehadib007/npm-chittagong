import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import EditModal from "./EditModal";
import { PrinterIcon } from "lucide-react";
import CreatedBy from "./CreatedBy";

export default function Customer() {
  // ===============================
  // Enrollment Data
  // ===============================
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const officerRanks = [
    "Admiral",
    "Vice Admiral",
    "Rear Admiral",
    "Commodore",
    "Captain",
    "Commander",
    "Lieutenant Commander",
    "Sub Lieutenant",
    "Acting Sub Lieutenant",
    "Midshipman",
  ];

  // ===============================
  // Search State
  // ===============================
  const [searchTerm, setSearchTerm] = useState("");

  // ===============================
  // Pagination
  // ===============================
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  // ===============================
  // Modal & Form State
  // ===============================
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  // console.log(selectedIds);
  const navigate = useNavigate();

  const toggleSelect = (id, serial) => {
    setSelectedIds((prev) => {
      const exists = prev.find((x) => x.id === id && x.serial === serial);

      if (exists) {
        return prev.filter((x) => !(x.id === id && x.serial === serial));
      }

      return [...prev, { id, serial }];
    });
  };

  const toggleSelectAll = () => {
    const allSelected = currentData.every((item, idx) =>
      selectedIds.some(
        (s) =>
          s.id === item._id &&
          s.serial === String(startIndex + idx + 1).padStart(4, "0"),
      ),
    );

    if (allSelected) {
      setSelectedIds([]);
    } else {
      const newSelected = currentData.map((item, idx) => ({
        id: item._id,
        serial: String(startIndex + idx + 1).padStart(4, "0"),
      }));

      setSelectedIds(newSelected);
    }
  };

  const generateQr = async () => {
    if (!selectedIds.length) return alert("Select enrollments first!");
    navigate("/enrollment-list", {
      state: { ids: selectedIds },
    });
  };

  // ===============================
  // Fetch enrollments
  // ===============================
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enrollment");
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ===============================
  // Search Filter
  // ===============================
  const filteredCustomers = [...customers].reverse().filter((item) => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return true;

    return (
      item.pno?.toLowerCase().includes(term) ||
      item.officialRank?.toLowerCase().includes(term) ||
      item.brNoOrNid?.toLowerCase().includes(term) ||
      item.fullName?.toLowerCase().includes(term) ||
      item.primaryMobile?.toLowerCase().includes(term) ||
      item.registrationNo?.toLowerCase().includes(term) ||
      item.chassisNumber?.toLowerCase().includes(term) ||
      item.engineNumber?.toLowerCase().includes(term) ||
      item.sticker?.toLowerCase().includes(term) ||
      item.driverName?.toLowerCase().includes(term) ||
      item.driverNidNo?.toLowerCase().includes(term) ||
      item.drivingLicenseNo?.toLowerCase().includes(term)
    );
  });
  // ===============================
  // Pagination (after filtering)
  // ===============================
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ===============================
  // Modal Controls
  // ===============================
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setForm({ ...customer });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedCustomer(null);
    setForm({});
  };

  const showDetails = async (id) => {
    const res = await api.get(`/enrollment/${id}`);
    console.log(res.data);
    navigate("/enrollment-details", {
      state: { enrollmentId: res?.data?._id },
    });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/enrollment/${selectedCustomer._id}`, form);
      alert("Updated successfully!");
      fetchCustomers();
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/enrollment/${id}`);
      fetchCustomers();
      alert("Deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  // ===============================
  // ESC closes modal
  // ===============================
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeEditModal();
    };
    if (isEditOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditOpen]);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b bg-white rounded-t-2xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Enrollment Entry
              </h2>

              <button
                onClick={generateQr}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md"
              >
                <PrinterIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by PNO, Registration No, or Sticker..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="md:ml-6 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full md:w-80"
            />
          </div>

          <Link
            to="/customerEntry"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-medium shadow-md transition duration-200"
          >
            +
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 text-lg">
            Loading...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          currentData.length > 0 &&
                          currentData.every((item, idx) => {
                            const serial = String(
                              startIndex + idx + 1,
                            ).padStart(4, "0");

                            return selectedIds.some(
                              (s) => s.id === item._id && s.serial === serial,
                            );
                          })
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-center">#</th>
                    <th className="px-4 py-3 text-center">Profile</th>
                    <th className="px-4 py-3 text-left">PNO</th>
                    <th className="px-4 py-3 text-left">Rank & Full Name</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-left">NID</th>
                    <th className="px-4 py-3 text-left">User Category</th>
                    <th className="px-4 py-3 text-left">Entry By</th>
                    <th className="px-4 py-3 text-center">Operation</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentData.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="hover:bg-indigo-50 transition duration-150"
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.some(
                            (itemSel) =>
                              itemSel.id === item._id &&
                              itemSel.serial ===
                                String(startIndex + idx + 1).padStart(4, "0"),
                          )}
                          onChange={() =>
                            toggleSelect(
                              item._id,
                              String(startIndex + idx + 1).padStart(4, "0"),
                            )
                          }
                          className="w-4 h-4"
                        />
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-gray-600">
                        {/* {startIndex + idx + 1} */}
                        {String(startIndex + idx + 1).padStart(4, "0") +
                          "/" +
                          new Date().getFullYear().toString().slice(-2)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <img
                          src={item.profileImage || "https://i.pravatar.cc/100"}
                          alt="profile"
                          className="w-11 h-11 rounded-full border-2 border-indigo-200 shadow-sm object-cover mx-auto"
                        />
                      </td>

                      <td
                        className="px-4 py-3 cursor-pointer text-indigo-600 font-medium hover:underline"
                        onClick={() => showDetails(item._id)}
                      >
                        {item.pno}
                      </td>

                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {
                          officerRanks.includes(item.officialRank)
                            ? `${item.officialRank} ${item.fullName}` // Rank before name
                            : `${item.fullName} ${item.officialRank}` // Rank after name
                        }
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.primaryMobile}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.brNoOrNid}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
                          {item.userCategory}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        <CreatedBy createdBy={item.createdBy} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-t bg-gray-50 rounded-b-2xl">
              <p className="text-gray-600 text-xs">
                Showing{" "}
                <span className="font-semibold">
                  {filteredCustomers.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredCustomers.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {filteredCustomers.length}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        page === p
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isEditOpen && (
        <EditModal
          enrollmentInfo={form}
          setEnrollmentInfo={setForm}
          onClose={closeEditModal}
          onUpdate={handleUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )}
    </div>
  );
}
