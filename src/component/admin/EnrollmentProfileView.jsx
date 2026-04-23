import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

const InfoCard = ({ label, value }) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
      {label}
    </p>

    <p className="text-sm md:text-base font-semibold text-gray-900 break-words">
      {value || "N/A"}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <section className="rounded-3xl bg-white shadow-md border p-5 md:p-8">
    <h2 className="text-lg md:text-2xl font-bold mb-5">{title}</h2>

    {children}
  </section>
);

const EnrollmentProfileView = () => {
  const { enrollmentId } = useParams();

  const location = useLocation();

  const item = location.state?.enrollment;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-3">Enrollment Not Found</h1>

          <p className="text-gray-600">No data available for ID:</p>

          <p className="mt-2 font-semibold">{enrollmentId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO */}
        <div className="rounded-[30px] bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 md:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <img
              src={item.profileImage}
              alt={item.fullName}
              className="w-40 h-40 md:w-52 md:h-52 rounded-3xl object-cover border-4 border-white/30"
            />

            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm uppercase tracking-[3px] text-slate-300">
                Authorized Enrollment Profile
              </p>

              <h1 className="text-3xl md:text-5xl font-bold mt-3">
                {item.fullName}
              </h1>

              <p className="text-xl mt-3 font-medium">{item.officialRank}</p>

              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                <InfoCard label="Enrollment ID" value={item.enrollmentId} />

                <InfoCard label="PNO" value={item.pno} />

                <InfoCard label="Job Location" value={item.jobLocation} />
              </div>
            </div>
          </div>
        </div>

        {/* PERSONAL */}
        <Section title="Personal Information">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            <InfoCard label="National ID" value={item.brNoOrNid} />
            <InfoCard label="Blood Group" value={item.bloodGroup} />
            <InfoCard label="Category" value={item.userCategory} />
            <InfoCard label="Primary Mobile" value={item.primaryMobile} />
            <InfoCard
              label="Alternative Mobile"
              value={item.alternativeMobile}
            />
            <InfoCard label="Email" value={item.email} />
            <InfoCard label="Permanent Address" value={item.permanentAddress} />
          </div>
        </Section>

        {/* VEHICLE */}
        <Section title="Vehicle Information">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            <InfoCard label="Vehicle Type" value={item.vehicleType} />
            <InfoCard label="Vehicle Brand" value={item.vehicleBrand} />
            <InfoCard label="Vehicle Model" value={item.vehicleModel} />
            <InfoCard label="Registration No" value={item.registrationNo} />
            <InfoCard label="Registration Info" value={item.registrationInfo} />
            <InfoCard label="Chassis Number" value={item.chassisNumber} />
            <InfoCard label="Engine Number" value={item.engineNumber} />
            <InfoCard label="Driving Type" value={item.drivingType} />
          </div>
        </Section>

        {/* VALIDITY */}
        <Section title="Legal Validity & Documents">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            <InfoCard label="Issue Date" value={formatDate(item.issueDate)} />
            <InfoCard label="Tax Token" value={formatDate(item.taxToken)} />
            <InfoCard label="Validity" value={formatDate(item.validity)} />
            <InfoCard label="Fitness" value={formatDate(item.fitness)} />
            <InfoCard
              label="License Expiry"
              value={formatDate(item.licenseExpireDate)}
            />
          </div>
        </Section>

        {/* DRIVER */}
        <Section title="Driver Information">
          <div className="grid lg:grid-cols-[220px_1fr] gap-8 items-start">
            <div className="flex justify-center">
              <img
                src={item.driverImage}
                alt={item.driverName}
                className="w-52 h-52 rounded-3xl object-cover border shadow"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <InfoCard label="Driver Name" value={item.driverName} />
              <InfoCard label="Driver NID" value={item.driverNidNo} />
              <InfoCard label="License Number" value={item.drivingLicenseNo} />
            </div>
          </div>
        </Section>

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-500 pb-6">
          Last Updated:{" "}
          {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentProfileView;
