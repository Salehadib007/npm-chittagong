// import { useState, useEffect } from "react";
// import { uploadImage } from "../../../utils/uploadImages.js";
// import { useSetup } from "../../../context/SetupContext";
// import { useVehicle } from "../../../context/VehicleContext.jsx";
// import { useRegistration } from "../../../context/RegistrationContext";

// export default function EditModal({
//   enrollmentInfo,
//   setEnrollmentInfo,
//   onClose,
//   onUpdate,
//   uploading,
//   setUploading,
// }) {
//   const { setup, loadingSetup } = useSetup();
//   const { vehicles } = useVehicle();
//   const { registrations } = useRegistration();

//   // registrationParts for building registrationInfo
//   const [registrationParts, setRegistrationParts] = useState({
//     location: "",
//     unit: "",
//     serial: "",
//     year: "",
//   });

//   useEffect(() => {
//     if (enrollmentInfo?.registrationInfo) {
//       const parts = enrollmentInfo.registrationInfo.split(".");
//       setRegistrationParts({
//         location: parts[0] || "",
//         unit: parts[1] || "",
//         serial: parts[2] || "",
//         year: parts[3] || "",
//       });
//     }
//   }, [enrollmentInfo]);

//   const locationOptions = registrations.flatMap((r) => r.location || []);
//   const unitOptions = registrations.flatMap((r) => r.unit || []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEnrollmentInfo((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleRegistrationChange = (field, value) => {
//     setRegistrationParts((prev) => {
//       const updated = { ...prev, [field]: value };
//       const { location, unit, serial, year } = updated;

//       const combined =
//         (location || "") +
//         (unit ? "." + unit : "") +
//         (serial ? "." + serial : "") +
//         (year ? "." + year : "");

//       setEnrollmentInfo((prevEnroll) => ({
//         ...prevEnroll,
//         registrationInfo: combined,
//       }));

//       return updated;
//     });
//   };

//   const handleImageUpload = async (fieldName, file) => {
//     if (!file) return;
//     try {
//       setUploading(true);
//       const url = await uploadImage(file);
//       setEnrollmentInfo((prev) => ({ ...prev, [fieldName]: url }));
//     } catch (err) {
//       console.error(err);
//       alert("Image upload failed!");
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!enrollmentInfo) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50 overflow-auto">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative">
//         <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-lg"
//         >
//           ×
//         </button>

//         <div className="space-y-6 max-h-[80vh] overflow-auto">
//           {/* ---------------- PERSONAL ---------------- */}
//           <section className="border-b border-gray-300 pb-4">
//             <h3 className="font-semibold text-sm mb-2">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <Input
//                 label="PNO"
//                 name="pno"
//                 value={enrollmentInfo.pno}
//                 onChange={handleChange}
//               />
//               <Select
//                 label="User Category"
//                 name="userCategory"
//                 value={enrollmentInfo.userCategory}
//                 onChange={handleChange}
//                 options={setup?.UserCategory || []}
//               />
//               <Select
//                 label="Official Rank"
//                 name="officialRank"
//                 value={enrollmentInfo.officialRank}
//                 onChange={handleChange}
//                 options={setup?.Rank || []}
//               />
//               <Input
//                 label="Full Name"
//                 name="fullName"
//                 value={enrollmentInfo.fullName}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Primary Mobile"
//                 name="primaryMobile"
//                 value={enrollmentInfo.primaryMobile}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Alternative Mobile"
//                 name="alternativeMobile"
//                 value={enrollmentInfo.alternativeMobile}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="BR NO / NID"
//                 name="brNoOrNid"
//                 value={enrollmentInfo.brNoOrNid}
//                 onChange={handleChange}
//               />
//               <Select
//                 label="Job Location"
//                 name="jobLocation"
//                 value={enrollmentInfo.jobLocation}
//                 onChange={handleChange}
//                 options={setup?.JobLocation || []}
//               />
//               <Select
//                 label="Blood Group"
//                 name="bloodGroup"
//                 value={enrollmentInfo.bloodGroup}
//                 onChange={handleChange}
//                 options={setup?.BloodGroup || []}
//               />
//               <Input
//                 label="Email"
//                 name="email"
//                 value={enrollmentInfo.email}
//                 onChange={handleChange}
//               />
//               <Textarea
//                 label="Permanent Address"
//                 name="permanentAddress"
//                 value={enrollmentInfo.permanentAddress}
//                 onChange={handleChange}
//                 className="md:col-span-3"
//               />
//               <Upload
//                 label="Profile Image"
//                 onUpload={(file) => handleImageUpload("profileImage", file)}
//               />
//             </div>
//           </section>

//           {/* ---------------- VEHICLE ---------------- */}
//           <section className="border-b border-gray-300 pb-4">
//             <h3 className="font-semibold text-sm mb-2">Vehicle Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <Select
//                 label="Vehicle Type"
//                 name="vehicleType"
//                 value={enrollmentInfo.vehicleType}
//                 onChange={handleChange}
//                 options={vehicles?.map((v) => v.type) || []}
//               />
//               <Select
//                 label="Vehicle Brand"
//                 name="vehicleBrand"
//                 value={enrollmentInfo.vehicleBrand}
//                 onChange={handleChange}
//                 options={setup?.VehicleBrand?.map((v) => v.split(".")[1]) || []}
//               />
//               <Select
//                 label="Vehicle Model"
//                 name="vehicleModel"
//                 value={enrollmentInfo.vehicleModel}
//                 onChange={handleChange}
//                 options={setup?.VehicleModel || []}
//               />

//               {/* Registration Info */}
//               <div className="border rounded-xl p-4 space-y-3 bg-gray-50 md:col-span-3">
//                 <h4 className="font-medium text-gray-700">
//                   Registration Information
//                 </h4>
//                 <div className="grid md:grid-cols-4 gap-3">
//                   <Select
//                     value={registrationParts.location}
//                     onChange={(e) =>
//                       handleRegistrationChange("location", e.target.value)
//                     }
//                     options={locationOptions}
//                   />
//                   <Select
//                     value={registrationParts.unit}
//                     onChange={(e) =>
//                       handleRegistrationChange("unit", e.target.value)
//                     }
//                     options={unitOptions}
//                   />
//                   <Input
//                     value={registrationParts.serial}
//                     onChange={(e) =>
//                       handleRegistrationChange(
//                         "serial",
//                         e.target.value.toUpperCase(),
//                       )
//                     }
//                   />
//                   <Input
//                     value={registrationParts.year}
//                     onChange={(e) =>
//                       handleRegistrationChange("year", e.target.value)
//                     }
//                   />
//                 </div>
//                 <Input
//                   label="Sticker"
//                   name="sticker"
//                   value={enrollmentInfo.sticker}
//                   onChange={handleChange}
//                 />
//                 <Upload
//                   label="Sticker Image"
//                   onUpload={(file) => handleImageUpload("stickerImage", file)}
//                 />
//               </div>

//               <Input
//                 label="Registration No"
//                 name="registrationNo"
//                 value={enrollmentInfo.registrationNo}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Chassis Number"
//                 name="chassisNumber"
//                 value={enrollmentInfo.chassisNumber}
//                 onChange={handleChange}
//               />
//               <Input
//                 label="Engine Number"
//                 name="engineNumber"
//                 value={enrollmentInfo.engineNumber}
//                 onChange={handleChange}
//               />
//               <Input
//                 type="date"
//                 label="Issue Date"
//                 name="issueDate"
//                 value={enrollmentInfo.issueDate}
//                 onChange={handleChange}
//               />
//               <Input
//                 type="date"
//                 label="Validity"
//                 name="validity"
//                 value={enrollmentInfo.validity}
//                 onChange={handleChange}
//               />
//               <Input
//                 type="date"
//                 label="Tax Token"
//                 name="taxToken"
//                 value={enrollmentInfo.taxToken}
//                 onChange={handleChange}
//               />
//               <Upload
//                 label="Tax Token Image"
//                 onUpload={(file) => handleImageUpload("taxTokenImage", file)}
//               />
//             </div>
//           </section>

//           {/* ---------------- DRIVING ---------------- */}
//           <section>
//             <h3 className="font-semibold text-sm mb-2">Driving Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               <div>
//                 <label className="block mb-1">Driving Type</label>
//                 <div className="flex gap-4">
//                   <label>
//                     <input
//                       type="radio"
//                       name="drivingType"
//                       value="OWN"
//                       checked={enrollmentInfo.drivingType === "OWN"}
//                       onChange={handleChange}
//                     />{" "}
//                     OWN
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="drivingType"
//                       value="HIRED"
//                       checked={enrollmentInfo.drivingType === "HIRED"}
//                       onChange={handleChange}
//                     />{" "}
//                     HIRED
//                   </label>
//                 </div>
//               </div>

//               <Input
//                 label="Driver NID NO"
//                 name="driverNidNo"
//                 value={enrollmentInfo.driverNidNo}
//                 onChange={handleChange}
//               />
//               <Upload
//                 label="Driver NID Image"
//                 onUpload={(file) => handleImageUpload("driverNidImage", file)}
//               />
//               <Input
//                 label="Driver Full Name"
//                 name="driverName"
//                 value={enrollmentInfo.driverName}
//                 onChange={handleChange}
//               />
//               <Upload
//                 label="Driver Image"
//                 onUpload={(file) => handleImageUpload("driverImage", file)}
//               />
//               <Input
//                 label="Driving License No"
//                 name="drivingLicenseNo"
//                 value={enrollmentInfo.drivingLicenseNo}
//                 onChange={handleChange}
//               />
//               <Input
//                 type="date"
//                 label="License Expire Date"
//                 name="licenseExpireDate"
//                 value={enrollmentInfo.licenseExpireDate}
//                 onChange={handleChange}
//               />
//             </div>
//           </section>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={onUpdate}
//               disabled={uploading}
//               className="px-6 py-2 bg-blue-700 text-white rounded-lg"
//             >
//               Update
//             </button>
//             <button
//               onClick={onClose}
//               className="px-6 py-2 bg-gray-500 text-white rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= Reusable Components ================= */
// function Input({
//   label,
//   type = "text",
//   name,
//   value,
//   onChange,
//   className = "",
// }) {
//   return (
//     <div className={className}>
//       {label && (
//         <label className="block text-sm font-medium mb-1">{label}</label>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//       />
//     </div>
//   );
// }

// function Select({
//   label,
//   name,
//   value,
//   onChange,
//   options = [],
//   placeholder = "Select",
//   className = "",
// }) {
//   return (
//     <div className={className}>
//       {label && (
//         <label className="block text-sm font-medium mb-1">{label}</label>
//       )}
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-blue-300"
//       >
//         <option value="">{placeholder}</option>
//         {options.map((opt, i) => (
//           <option key={i} value={opt}>
//             {typeof opt === "object" ? opt.value : opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function Textarea({ label, name, value, onChange, className = "" }) {
//   return (
//     <div className={className}>
//       {label && (
//         <label className="block text-sm font-medium mb-1">{label}</label>
//       )}
//       <textarea
//         rows="3"
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//       />
//     </div>
//   );
// }

// function Upload({ label, value, onUpload }) {
//   const [preview, setPreview] = useState("");

//   // Initialize preview with existing image if provided
//   useEffect(() => {
//     if (value) setPreview(value);
//   }, [value]);

//   const handleChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Create temporary preview
//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);

//     // Pass file to parent handler
//     onUpload(file);

//     // Revoke object URL when component unmounts or preview changes
//     return () => URL.revokeObjectURL(objectUrl);
//   };

//   return (
//     <div>
//       {label && (
//         <label className="block text-sm font-medium mb-1">{label}</label>
//       )}
//       <input type="file" onChange={handleChange} className="w-full text-sm" />
//       {preview && (
//         <img
//           src={preview}
//           alt="preview"
//           className="mt-2 w-24 h-24 object-cover rounded border"
//         />
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { uploadImage } from "../../../utils/uploadImages.js";
import { useSetup } from "../../../context/SetupContext";
import { useVehicle } from "../../../context/VehicleContext.jsx";
import { useRegistration } from "../../../context/RegistrationContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditModal({
  enrollmentInfo,
  setEnrollmentInfo,
  onClose,
  onUpdate,
}) {
  const { setup, loadingSetup } = useSetup();
  const { vehicles } = useVehicle();
  const { registrations } = useRegistration();

  const serialRef = useRef(null);
  const yearRef = useRef(null);

  const [registrationParts, setRegistrationParts] = useState({
    location: "",
    unit: "",
    serial: "",
    year: "",
  });

  useEffect(() => {
    if (enrollmentInfo?.registrationInfo) {
      const parts = enrollmentInfo.registrationInfo.split(".");
      setRegistrationParts({
        location: parts[0] || "",
        unit: parts[1] || "",
        serial: parts[2] || "",
        year: parts[3] || "",
      });
    }
  }, [enrollmentInfo]);

  const locationOptions = registrations.flatMap((r) => r.location || []);
  const unitOptions = registrations.flatMap((r) => r.unit || []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollmentInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegistrationChange = (field, value) => {
    setRegistrationParts((prev) => {
      const updated = { ...prev, [field]: value };
      const { location, unit, serial, year } = updated;

      const formatted =
        location && unit && serial?.length === 2 && year?.length === 4
          ? `${location}-${unit}-${serial}-${year}`
          : "";

      setEnrollmentInfo((prev) => ({
        ...prev,
        registrationInfo:
          (location || "") +
          (unit ? "." + unit : "") +
          (serial ? "." + serial : "") +
          (year ? "." + year : ""),
        registrationNo: formatted,
      }));

      return updated;
    });
  };

  const handleImageUpload = async (fieldName, file) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setEnrollmentInfo((prev) => ({ ...prev, [fieldName]: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    }
  };

  if (!enrollmentInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-4 relative text-[13px]">
        <h2 className="font-semibold text-sm mb-3">Edit Enrollment</h2>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ×
        </button>

        {loadingSetup ? (
          <p>Loading setup...</p>
        ) : (
          <div className="space-y-4 max-h-[80vh] overflow-auto">
            {/* ---------------- PERSONAL ---------------- */}
            <section className="border-b border-gray-400 pb-3">
              <h3 className="font-semibold text-[13px] mb-2 border-b border-gray-300 pb-1">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  label="* PNO"
                  name="pno"
                  value={enrollmentInfo.pno}
                  onChange={handleChange}
                />
                <Select
                  label="* User Category"
                  name="userCategory"
                  value={enrollmentInfo.userCategory}
                  onChange={handleChange}
                  options={setup?.UserCategory || []}
                />
                <Select
                  label="* Official Rank"
                  name="officialRank"
                  value={enrollmentInfo.officialRank}
                  onChange={handleChange}
                  options={setup?.Rank || []}
                />
                <Input
                  label="* Full Name"
                  name="fullName"
                  className="md:col-span-2"
                  value={enrollmentInfo.fullName}
                  onChange={handleChange}
                />
                <div className="flex gap-2">
                  <Input
                    label="* Primary Mobile"
                    name="primaryMobile"
                    value={enrollmentInfo.primaryMobile}
                    onChange={handleChange}
                  />
                  <Input
                    label="Alternative Mobile"
                    name="alternativeMobile"
                    value={enrollmentInfo.alternativeMobile}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  label="* BR NO / NID"
                  name="brNoOrNid"
                  value={enrollmentInfo.brNoOrNid}
                  onChange={handleChange}
                />
                <Select
                  label="* Job Location"
                  name="jobLocation"
                  value={enrollmentInfo.jobLocation}
                  onChange={handleChange}
                  options={setup?.JobLocation || []}
                />
                <Select
                  label="* Blood Group"
                  name="bloodGroup"
                  value={enrollmentInfo.bloodGroup}
                  onChange={handleChange}
                  options={setup?.BloodGroup || []}
                />
                <Input
                  label="Email"
                  name="email"
                  value={enrollmentInfo.email}
                  onChange={handleChange}
                />
                <Textarea
                  label="Permanent Address"
                  className="md:col-span-2"
                  name="permanentAddress"
                  value={enrollmentInfo.permanentAddress}
                  onChange={handleChange}
                />
                <Upload
                  label="Profile Image"
                  value={enrollmentInfo.profileImage}
                  onUpload={(file) => handleImageUpload("profileImage", file)}
                />
              </div>
            </section>

            {/* ---------------- VEHICLE ---------------- */}
            <section className="border-b border-gray-400 pb-3">
              <h3 className="font-semibold text-[13px] mb-2 border-b border-gray-300 pb-1">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Select
                  label="* Vehicle Type"
                  name="vehicleType"
                  value={enrollmentInfo.vehicleType}
                  onChange={handleChange}
                  options={vehicles?.map((v) => v.type) || []}
                />
                <Select
                  label="* Vehicle Brand"
                  name="vehicleBrand"
                  value={enrollmentInfo.vehicleBrand}
                  onChange={handleChange}
                  options={
                    setup?.VehicleBrand?.map((v) => v.split(".")[1]) || []
                  }
                />
                <Select
                  label="* Vehicle Model"
                  name="vehicleModel"
                  value={enrollmentInfo.vehicleModel}
                  onChange={handleChange}
                  options={setup?.VehicleModel || []}
                />

                {/* Registration Info */}
                <div className="border border-gray-400 p-2 bg-[#f8f8f8] md:col-span-3 space-y-2">
                  <h4 className="font-semibold text-[13px]">
                    Registration Information
                  </h4>
                  <div className="grid md:grid-cols-4 gap-2">
                    <Select
                      value={registrationParts.location}
                      onChange={(e) =>
                        handleRegistrationChange("location", e.target.value)
                      }
                      options={locationOptions}
                    />
                    <Select
                      value={registrationParts.unit}
                      onChange={(e) =>
                        handleRegistrationChange("unit", e.target.value)
                      }
                      options={unitOptions}
                    />
                    <Input
                      value={registrationParts.serial}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 2);
                        handleRegistrationChange("serial", value);
                        if (value.length === 2) yearRef.current?.focus();
                      }}
                      inputRef={serialRef}
                    />
                    <Input
                      value={registrationParts.year}
                      onChange={(e) =>
                        handleRegistrationChange(
                          "year",
                          e.target.value.slice(0, 4),
                        )
                      }
                      inputRef={yearRef}
                    />
                  </div>
                  <Input
                    label="* Registration No"
                    name="registrationNo"
                    className="md:col-span-2"
                    value={enrollmentInfo.registrationNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    label="Sticker"
                    name="sticker"
                    value={enrollmentInfo.sticker}
                    onChange={handleChange}
                  />
                  <Upload
                    label="Sticker Image"
                    value={enrollmentInfo.stickerImage}
                    onUpload={(file) => handleImageUpload("stickerImage", file)}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    label="* Chassis Number"
                    name="chassisNumber"
                    value={enrollmentInfo.chassisNumber}
                    onChange={handleChange}
                  />
                  <Input
                    label="* Engine Number"
                    name="engineNumber"
                    value={enrollmentInfo.engineNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    type="date"
                    label="* Issue Date"
                    name="issueDate"
                    value={enrollmentInfo.issueDate}
                    onChange={handleChange}
                  />
                  <Input
                    type="date"
                    label="* Validity"
                    name="validity"
                    value={enrollmentInfo.validity}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    type="date"
                    label="Fitness"
                    name="fitness"
                    value={enrollmentInfo.fitness}
                    onChange={handleChange}
                  />
                  <Upload
                    label="Fitness Image"
                    value={enrollmentInfo.fitnessImage}
                    onUpload={(file) => handleImageUpload("fitnessImage", file)}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    type="date"
                    label="* Tax Token"
                    name="taxToken"
                    value={enrollmentInfo.taxToken}
                    onChange={handleChange}
                  />
                  <Upload
                    label="Tax Token Image"
                    value={enrollmentInfo.taxTokenImage}
                    onUpload={(file) =>
                      handleImageUpload("taxTokenImage", file)
                    }
                  />
                </div>
              </div>
            </section>

            {/* ---------------- DRIVING ---------------- */}
            <section className="pb-3">
              <h3 className="font-semibold text-[13px] mb-2 border-b border-gray-300 pb-1">
                Driving Information
              </h3>
              <div className="flex gap-2">
                <div>
                  <label className="block mb-1">* Driving Type</label>
                  <div className="flex gap-4 mt-1">
                    <label>
                      <input
                        type="radio"
                        name="drivingType"
                        value="OWN"
                        checked={enrollmentInfo.drivingType === "OWN"}
                        onChange={handleChange}
                      />{" "}
                      OWN
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="drivingType"
                        value="HIRED"
                        checked={enrollmentInfo.drivingType === "HIRED"}
                        onChange={handleChange}
                      />{" "}
                      HIRED
                    </label>
                  </div>
                </div>

                <div className="flex flex-1 justify-between flex-wrap gap-2">
                  <Input
                    label="* Driver Full Name"
                    name="driverName"
                    value={enrollmentInfo.driverName}
                    onChange={handleChange}
                  />
                  <Input
                    label="* Driver NID NO"
                    name="driverNidNo"
                    value={enrollmentInfo.driverNidNo}
                    onChange={handleChange}
                  />
                  <Upload
                    label="Driver NID Image"
                    value={enrollmentInfo.driverNidImage}
                    onUpload={(file) =>
                      handleImageUpload("driverNidImage", file)
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      label="* Driving License No"
                      name="drivingLicenseNo"
                      value={enrollmentInfo.drivingLicenseNo}
                      onChange={handleChange}
                    />
                    <Input
                      type="date"
                      label="* License Expire Date"
                      name="licenseExpireDate"
                      value={enrollmentInfo.licenseExpireDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Upload
                  label="Driving License Image"
                  value={enrollmentInfo.driverImage}
                  onUpload={(file) => handleImageUpload("driverImage", file)}
                />
              </div>
            </section>

            {/* ---------------- BUTTONS ---------------- */}
            <div className="flex justify-end gap-2 border-t border-gray-300 pt-2">
              <button
                type="button"
                onClick={onUpdate}
                className="px-4 py-1.5 bg-green-600 text-white text-[13px] border border-green-600 rounded"
              >
                UPDATE
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-gray-600 text-white text-[13px] border border-gray-600 rounded"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  className = "",
  inputRef,
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      {type === "date" ? (
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange({ target: { name, value: date } })}
          dateFormat="dd-MMM-yyyy"
          className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none"
        />
      )}
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none bg-white"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, className = "", name, value, onChange }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <textarea
        rows="3"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none"
      />
    </div>
  );
}

function Upload({ label, value, onUpload }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onUpload(file);
    return () => URL.revokeObjectURL(objectUrl);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input
        type="file"
        onChange={handleChange}
        className="w-full text-[12px] border border-gray-400 px-2 py-1 bg-white"
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-1 w-24 h-24 object-cover rounded border"
        />
      )}
    </div>
  );
}
