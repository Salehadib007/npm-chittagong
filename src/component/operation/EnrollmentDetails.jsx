// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import api from "../../../utils/api.js"; // your API utility
// import { formatDate } from "../../../utils/formatDate";

// const EnrollmentDetails = () => {
//   const location = useLocation();
//   const enrollmentId = location.state?.enrollmentId;
//   // console.log(enrollmentId);
//   // pass only ID when navigating
//   const [enrollment, setEnrollment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);

//   // Fetch enrollment data from API
//   useEffect(() => {
//     const fetchEnrollment = async () => {
//       if (!enrollmentId) return;
//       try {
//         setLoading(true);
//         const { data } = await api.get(`/enrollment/${enrollmentId}`);
//         // console.log(data);

//         setEnrollment(data[0]);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch enrollment data!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEnrollment();
//   }, [enrollmentId]);

//   if (loading) return <p className="p-4">Loading enrollment...</p>;
//   if (!enrollment) return <p className="p-4">Enrollment not found!</p>;

//   const registrationParts = enrollment.registrationInfo
//     ? enrollment.registrationInfo.split(".")
//     : [];

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-10">
//       <div className="w-full max-w-6xl mx-auto space-y-10">
//         {/* PROFILE HEADER */}
//         <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
//           {enrollment.profileImage && (
//             <img
//               src={enrollment.profileImage}
//               alt="Profile"
//               className="w-48 h-48 object-contain border border-gray-200 rounded-2xl cursor-pointer"
//               onClick={() => setSelectedImage(enrollment.profileImage)}
//             />
//           )}
//           <div className="text-center md:text-left space-y-2 flex-1">
//             <h1 className="text-3xl font-semibold text-gray-900">
//               {enrollment.fullName}
//             </h1>
//             <p className="text-blue-600 font-medium">
//               {enrollment.officialRank}
//             </p>
//             <p className="text-gray-500">PNO: {enrollment.pno}</p>
//           </div>
//         </div>

//         {/* PERSONAL INFO */}
//         <Section title="Personal Information">
//           <Info label="BR No / NID" value={enrollment.brNoOrNid} />
//           <Info label="User Category" value={enrollment.userCategory} />
//           <Info label="Blood Group" value={enrollment.bloodGroup} />
//           <Info label="Primary Mobile" value={enrollment.primaryMobile} />
//           <Info
//             label="Alternative Mobile"
//             value={enrollment.alternativeMobile}
//           />
//           <Info label="Email" value={enrollment.email} />
//           <Info label="Job Location" value={enrollment.jobLocation} />
//           <Info label="Permanent Address" value={enrollment.permanentAddress} />
//         </Section>

//         {/* VEHICLE INFO */}
//         <Section title="Vehicle Information">
//           <Info label="Vehicle Type" value={enrollment.vehicleType} />
//           <Info label="Vehicle Brand" value={enrollment.vehicleBrand} />
//           <Info label="Vehicle Model" value={enrollment.vehicleModel} />
//           <Info label="Registration Info" value={enrollment.registrationInfo} />
//           <Info label="Location" value={registrationParts[0] || "-"} />
//           <Info label="Unit" value={registrationParts[1] || "-"} />
//           <Info label="Serial" value={registrationParts[2] || "-"} />
//           <Info label="Year" value={registrationParts[3] || "-"} />
//           <Info label="Registration No" value={enrollment.registrationNo} />
//           <Info label="Chassis Number" value={enrollment.chassisNumber} />
//           <Info label="Engine Number" value={enrollment.engineNumber} />
//           <Info label="Issue Date" value={formatDate(enrollment.issueDate)} />
//           <Info label="Validity" value={formatDate(enrollment.validity)} />
//           <Info label="Fitness" value={formatDate(enrollment.fitness)} />
//           <Info label="Sticker" value={enrollment.sticker} />
//           <Info label="Tax Token" value={enrollment.taxToken} />

//           {/* IMAGES */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
//             {enrollment.taxTokenImage && (
//               <ImageCard
//                 title="Tax Token"
//                 src={enrollment.taxTokenImage}
//                 onClick={setSelectedImage}
//               />
//             )}
//             {enrollment.fitnessImage && (
//               <ImageCard
//                 title="Fitness"
//                 src={enrollment.fitnessImage}
//                 onClick={setSelectedImage}
//               />
//             )}
//             {enrollment.stickerImage && (
//               <ImageCard
//                 title="Sticker"
//                 src={enrollment.stickerImage}
//                 onClick={setSelectedImage}
//               />
//             )}
//           </div>
//         </Section>

//         {/* DRIVER INFO */}
//         <Section title="Driver Information">
//           <div className="flex flex-col md:flex-row gap-8 items-start">
//             {enrollment.driverImage && (
//               <div className="flex-shrink-0 w-full md:w-64">
//                 <ImageCard
//                   title="Driving License Image"
//                   src={enrollment.driverImage}
//                   onClick={setSelectedImage}
//                 />
//               </div>
//             )}
//             <div className="w-full md:w-[300px] flex flex-col gap-4">
//               <Info label="Driving Type" value={enrollment.drivingType} />
//               <Info label="Driver Name" value={enrollment.driverName} />
//               <Info label="Driver NID No" value={enrollment.driverNidNo} />
//               <Info
//                 label="Driving License No"
//                 value={enrollment.drivingLicenseNo}
//               />
//               <Info
//                 label="License Expiry"
//                 value={formatDate(enrollment.licenseExpireDate)}
//               />
//             </div>
//           </div>
//         </Section>

//         {/* DRIVER NID */}
//         <Section title="Driver's NID">
//           {enrollment.driverNidImage && (
//             <div className="mt-6 w-full md:w-1/2">
//               <ImageCard
//                 title="Driver NID"
//                 src={enrollment.driverNidImage}
//                 onClick={setSelectedImage}
//               />
//             </div>
//           )}
//         </Section>
//       </div>

//       {/* IMAGE MODAL */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 cursor-pointer"
//           onClick={() => setSelectedImage(null)}
//         >
//           <img
//             src={selectedImage}
//             alt="Full"
//             className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnrollmentDetails;

// /* Section wrapper */
// const Section = ({ title, children }) => (
//   <div className="bg-white border border-gray-200 rounded-2xl p-8">
//     <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
//       {children}
//     </div>
//   </div>
// );

// /* Reusable Info & ImageCard components */
// const Info = ({ label, value }) => (
//   <div className="flex flex-col space-y-1">
//     <span className="text-gray-500 text-xs uppercase tracking-wide">
//       {label}
//     </span>
//     <span className="text-gray-900 font-medium break-words">
//       {value || "-"}
//     </span>
//   </div>
// );

// const ImageCard = ({ title, src, onClick }) => {
//   if (!src) return null;
//   return (
//     <div className="space-y-2 cursor-pointer" onClick={() => onClick(src)}>
//       <p className="text-xs uppercase text-gray-500 tracking-wide">{title}</p>
//       <img
//         src={src}
//         alt={title}
//         className="w-full h-48 object-contain border border-gray-200 rounded-2xl"
//       />
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api.js";
import { formatDate } from "../../../utils/formatDate";

/* ---------------- UI COMPONENTS ---------------- */

const Label = ({ children, required = true, className = "" }) => (
  <label
    className={`whitespace-nowrap text-[12px] font-semibold text-[#2f2f2f] ${className}`}
  >
    {required ? <span className="mr-[2px] text-[#c43b2b]">*</span> : null}
    {children}
  </label>
);

const InputBox = ({ value = "", className = "" }) => (
  <div
    className={`h-[30px] w-full border border-[#cfcfcf] bg-white px-[8px] text-[12px] leading-[30px] text-[#2b2b2b] ${className}`}
  >
    {value || "-"}
  </div>
);

const SelectBox = ({ value = "", className = "" }) => (
  <div
    className={`relative h-[30px] w-full border border-[#cfcfcf] bg-white px-[8px] text-[12px] leading-[30px] text-[#2b2b2b] ${className}`}
  >
    <span>{value || "-"}</span>
    <span className="absolute right-[8px] top-1/2 -translate-y-1/2 text-[10px] text-[#555]">
      ▼
    </span>
  </div>
);

const TextAreaBox = ({ value = "", className = "" }) => (
  <div
    className={`min-h-[62px] w-full border border-[#cfcfcf] bg-white px-[8px] py-[7px] text-[12px] text-[#2b2b2b] ${className}`}
  >
    {value || "-"}
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="border-b border-[#bdbdbd] px-[10px] py-[4px] text-[13px] font-bold text-[#222]">
    {children}
  </div>
);

const ImageBox = ({ src, onClick }) =>
  src ? (
    <img
      src={src}
      alt=""
      onClick={() => onClick(src)}
      className="h-[90px] w-[75px] object-contain border border-[#98c4ff] cursor-pointer"
    />
  ) : null;

/* ---------------- MAIN COMPONENT ---------------- */

export default function EnrollmentDetails() {
  const location = useLocation();
  const enrollmentId = location.state?.enrollmentId;
  console.log(enrollmentId);

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!enrollmentId) return;
      try {
        setLoading(true);

        const { data } = await api.get(`/enrollment/${enrollmentId}`);
        console.log(data);

        setEnrollment(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch enrollment data!");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [enrollmentId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!enrollment) return <p className="p-4">No data found</p>;

  const regParts = enrollment.registrationInfo?.split(".") || [];

  return (
    <div className="w-full bg-[#f3f3f3] p-[6px] text-[#222]">
      <div className="w-full border border-[#cfcfcf] bg-[#f5f5f5]">
        {/* ---------------- PERSONAL SECTION ---------------- */}
        <SectionTitle>Personal Identification</SectionTitle>

        <div className="px-[12px] py-[8px]">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[500px_620px_240px]">
            {/* LEFT */}
            <div className="space-y-[10px]">
              <Field label="PNO" value={enrollment.pno} />
              <Field label="Official Rank" value={enrollment.officialRank} />
              <Field label="NID" value={enrollment.brNoOrNid} />
              <SelectField
                label="Job Location"
                value={enrollment.jobLocation}
              />
              <TextAreaField
                label="Permanent Address"
                value={enrollment.permanentAddress}
              />
            </div>

            {/* MIDDLE */}
            <div className="space-y-[10px]">
              <SelectField
                label="User Category"
                value={enrollment.userCategory}
              />
              <Field label="Full Name" value={enrollment.fullName} />

              <DoubleField
                label1="Primary Mobile"
                value1={enrollment.primaryMobile}
                label2="Alternative Mobile"
                value2={enrollment.alternativeMobile}
              />

              <DoubleField
                label1="Blood Group"
                value1={enrollment.bloodGroup}
                label2="Email"
                value2={enrollment.email}
              />
            </div>

            {/* RIGHT (IMAGE) */}
            <div className="flex items-end gap-4">
              <ImageBox
                src={enrollment.profileImage}
                onClick={setSelectedImage}
              />
            </div>
          </div>
        </div>

        {/* ---------------- VEHICLE SECTION ---------------- */}
        <SectionTitle>Vehicle Information</SectionTitle>

        <div className="px-[12px] py-[8px] grid gap-4 md:grid-cols-2">
          <SelectField label="Vehicle Type" value={enrollment.vehicleType} />
          <SelectField label="Vehicle Brand" value={enrollment.vehicleBrand} />

          <Field label="Vehicle Model" value={enrollment.vehicleModel} />
          <Field label="Registration No" value={enrollment.registrationNo} />

          <Field label="Location" value={regParts[0]} />
          <Field label="Unit" value={regParts[1]} />

          <Field label="Serial" value={regParts[2]} />
          <Field label="Year" value={regParts[3]} />

          <Field label="Chassis Number" value={enrollment.chassisNumber} />
          <Field label="Engine Number" value={enrollment.engineNumber} />

          <Field label="Issue Date" value={formatDate(enrollment.issueDate)} />
          <Field label="Validity" value={formatDate(enrollment.validity)} />

          <Field label="Fitness" value={formatDate(enrollment.fitness)} />
          <Field label="Tax Token" value={enrollment.taxToken} />
        </div>

        {/* ---------------- DRIVER SECTION ---------------- */}
        <SectionTitle>Driver Information</SectionTitle>

        <div className="px-[12px] py-[8px] grid gap-4 md:grid-cols-2">
          <SelectField label="Driving Type" value={enrollment.drivingType} />
          <Field label="Driver Name" value={enrollment.driverName} />

          <Field label="Driver NID" value={enrollment.driverNidNo} />
          <Field label="License No" value={enrollment.drivingLicenseNo} />

          <Field
            label="License Expiry"
            value={formatDate(enrollment.licenseExpireDate)}
          />
        </div>

        {/* ---------------- IMAGES ---------------- */}
        <SectionTitle>Documents</SectionTitle>

        <div className="px-[12px] py-[8px] flex gap-4 flex-wrap">
          <ImageBox src={enrollment.taxTokenImage} onClick={setSelectedImage} />
          <ImageBox src={enrollment.fitnessImage} onClick={setSelectedImage} />
          <ImageBox src={enrollment.stickerImage} onClick={setSelectedImage} />
          <ImageBox src={enrollment.driverImage} onClick={setSelectedImage} />
          <ImageBox
            src={enrollment.driverNidImage}
            onClick={setSelectedImage}
          />
        </div>
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- SMALL HELPERS ---------------- */

const Field = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr] items-center gap-x-[10px]">
    <Label>{label}</Label>
    <InputBox value={value} />
  </div>
);

const SelectField = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr] items-center gap-x-[10px]">
    <Label>{label}</Label>
    <SelectBox value={value} />
  </div>
);

const TextAreaField = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr] items-start gap-x-[10px]">
    <Label className="pt-[7px]">{label}</Label>
    <TextAreaBox value={value} />
  </div>
);

const DoubleField = ({ label1, value1, label2, value2 }) => (
  <div className="grid grid-cols-[120px_1fr_140px_1fr] items-center gap-x-[10px]">
    <Label>{label1}</Label>
    <InputBox value={value1} />
    <Label required={false}>{label2}</Label>
    <InputBox value={value2} />
  </div>
);
