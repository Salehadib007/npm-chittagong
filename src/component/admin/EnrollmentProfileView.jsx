import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import { formatDate } from "../../../utils/formatDate";

const Field = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 border-b">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="font-semibold text-right">{value || "-"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-2xl p-5 mb-6 border">
    <h2 className="text-lg font-bold mb-3 border-b pb-2">{title}</h2>
    {children}
  </div>
);

const ImageBox = ({ label, src }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-sm text-gray-500">{label}</p>
    <img
      src={src}
      alt={label}
      className="w-32 h-32 object-cover rounded-xl border"
    />
  </div>
);

const EnrollmentProfileView = () => {
  const { enrollmentId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await api.get(`/enrollment/${enrollmentId}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [enrollmentId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Enrollment not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* HEADER CARD */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
          <img
            src={item.profileImage}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{item.fullName}</h1>
            <p className="text-gray-500">{item.officialRank}</p>
            <p className="text-sm text-gray-400 mt-1">
              Enrollment ID:{" "}
              <span className="font-semibold">{item.enrollmentId}</span>
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">PNO</p>
            <p className="text-xl font-bold">{item.pno}</p>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <Section title="Personal Information">
          <Field label="Full Name" value={item.fullName} />
          <Field label="Rank" value={item.officialRank} />
          <Field label="Email" value={item.email} />
          <Field label="Blood Group" value={item.bloodGroup} />
          <Field label="NID / BR No" value={item.brNoOrNid} />
          <Field label="Mobile" value={item.primaryMobile} />
          <Field label="Alternative Mobile" value={item.alternativeMobile} />
          <Field label="Category" value={item.userCategory} />
          <Field label="Permanent Address" value={item.permanentAddress} />
          <Field label="Job Location" value={item.jobLocation} />
        </Section>

        {/* VEHICLE INFO */}
        <Section title="Vehicle Information">
          <Field label="Vehicle Type" value={item.vehicleType} />
          <Field label="Brand" value={item.vehicleBrand} />
          <Field label="Model" value={item.vehicleModel} />
          <Field label="Registration No" value={item.registrationNo} />
          <Field label="Registration Info" value={item.registrationInfo} />
          <Field label="Chassis Number" value={item.chassisNumber} />
          <Field label="Engine Number" value={item.engineNumber} />
          <Field label="Driving Type" value={item.drivingType} />
        </Section>

        {/* DRIVER INFO */}
        <Section title="Driver Information">
          <Field label="Driver Name" value={item.driverName} />
          <Field label="NID No" value={item.driverNidNo} />
          <Field label="License No" value={item.drivingLicenseNo} />
          <Field
            label="License Expire"
            value={formatDate(item.licenseExpireDate)}
          />
        </Section>

        {/* IMPORTANT DATES */}
        <Section title="Validity & Dates">
          <Field label="Issue Date" value={formatDate(item.issueDate)} />
          <Field label="Validity" value={formatDate(item.validity)} />
          <Field label="Fitness" value={formatDate(item.fitness)} />
          <Field label="Tax Token" value={formatDate(item.taxToken)} />
        </Section>

        {/* IMAGES */}
        <Section title="Documents & Images">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ImageBox label="Profile" src={item.profileImage} />
            <ImageBox label="Driver" src={item.driverImage} />
            <ImageBox label="Tax Token" src={item.taxTokenImage} />
            <ImageBox label="Fitness" src={item.fitnessImage} />
            <ImageBox label="Sticker" src={item.stickerImage} />
          </div>
        </Section>

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-400 mt-6">
          Last updated: {formatDate(item.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentProfileView;
