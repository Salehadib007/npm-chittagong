import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api.js";

const VehiclePass = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/enrollment/${id}`);
        setUser(res.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (!user) return <p className="text-center mt-10">No user found</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      {/* CARD / PAGE */}
      <div
        className="
          mx-auto bg-white text-black
          w-full max-w-3xl
          p-6 md:p-8 border border-black
          rounded-md shadow-md
          print:border-none print:shadow-none
        "
      >
        {/* HEADER */}
        <header className="text-center border-b border-black pb-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold uppercase">
            Official Enrollment Data
          </h1>
          <p className="text-sm mt-1">
            User Type:{" "}
            <span className="font-semibold">{user.userCategory}</span>
          </p>
        </header>

        {/* PERSONNEL INFORMATION */}
        <section className="mb-6">
          <h2 className="font-semibold border-b border-black mb-3">
            Personnel Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <span className="font-semibold">Full Name:</span>
            <span>{user.fullName}</span>

            <span className="font-semibold">Rank:</span>
            <span>{user.officialRank}</span>

            <span className="font-semibold">P No/ Official No:</span>
            <span>{user.pno}</span>

            <span className="font-semibold">Blood Group:</span>
            <span>{user.bloodGroup}</span>

            <span className="font-semibold">Mobile:</span>
            <span>{user.primaryMobile}</span>

            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
        </section>

        {/* VEHICLE INFORMATION */}
        <section className="mb-6">
          <h2 className="font-semibold border-b border-black mb-3">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <span className="font-semibold">Vehicle Type:</span>
            <span>{user.vehicleType}</span>

            <span className="font-semibold">Brand / Model:</span>
            <span>
              {user.vehicleBrand} / {user.vehicleModel}
            </span>

            <span className="font-semibold">Registration No:</span>
            <span>{user.registrationNo}</span>

            <span className="font-semibold">Chassis / Engine:</span>
            <span>
              {user.chassisNumber} / {user.engineNumber}
            </span>

            <span className="font-semibold">Job Location:</span>
            <span>{user.jobLocation}</span>
          </div>
        </section>

        {/* DRIVER INFORMATION */}
        <section className="mb-6">
          <h2 className="font-semibold border-b border-black mb-3">
            Driver Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <span className="font-semibold">Driver Name:</span>
            <span>{user.driverName}</span>

            <span className="font-semibold">Driving License:</span>
            <span>{user.drivingLicenseNo}</span>

            <span className="font-semibold">License Expiry:</span>
            <span>{user.licenseExpireDate}</span>
          </div>
        </section>

        {/* IMAGES */}
        <section className="mb-6">
          <h2 className="font-semibold border-b border-black mb-3">
            Attachments
          </h2>
          <div className="flex flex-wrap gap-4">
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-24 border border-black object-cover"
              />
            )}
            {user.taxTokenImage && (
              <img
                src={user.taxTokenImage}
                alt="Tax Token"
                className="h-24 border border-black object-cover"
              />
            )}
            {user.fitnessImage && (
              <img
                src={user.fitnessImage}
                alt="Fitness"
                className="h-24 border border-black object-cover"
              />
            )}
            {user.driverImage && (
              <img
                src={user.driverImage}
                alt="Driver"
                className="h-24 border border-black object-cover"
              />
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex flex-col md:flex-row justify-between items-start md:items-end text-xs mt-10 gap-4 md:gap-0">
          <div>
            <p>Issue Date: {user.issueDate}</p>
            <p>Document ID: {user._id}</p>
          </div>

          {user.qrImage && (
            <img src={user.qrImage} alt="QR Code" className="h-24" />
          )}
        </footer>
      </div>

      {/* PRINT BUTTON */}
      <div className="text-center mt-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 border border-black font-semibold hover:bg-black hover:text-white transition"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default VehiclePass;
