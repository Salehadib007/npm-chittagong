import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../../../utils/uploadImages.js";
import { useSetup } from "../../../context/SetupContext";
import { useRegistration } from "../../../context/RegistrationContext";
import { useVehicle } from "../../../context/VehicleContext.jsx";
import api from "../../../utils/api.js";
import { formatDate } from "../../../utils/formatDate.js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function CustomerEntry() {
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

  // Prepare options
  const jobLocationOptions =
    setup?.JobLocation?.map((loc) => ({
      value: loc,
      label: loc,
    })) || [];

  // Custom filter: letter-by-letter, starts from first letter, case-sensitive
  const filterOption = (option, inputValue) => {
    if (!inputValue) return true;
    return option.label.startsWith(inputValue); // matches beginning of the option
  };

  // Handle change
  const handleJobLocationChange = (selectedOption) => {
    handleChange({
      target: { name: "jobLocation", value: selectedOption?.value || "" },
    });
  };

  const locationOptions = registrations.flatMap((r) => r.location || []);
  const unitOptions = registrations.flatMap((r) => r.unit || []);

  const [enrollment, setEnrollment] = useState({
    pno: "",
    officialRank: "",
    brNoOrNid: "",
    jobLocation: "",
    permanentAddress: "",
    userCategory: "",
    fullName: "",
    primaryMobile: "",
    alternativeMobile: "",
    email: "",
    bloodGroup: "",
    profileImage: "",
    vehicleType: "",
    registrationInfo: "",
    registrationNo: "",
    issueDate: "",
    taxToken: "",
    taxTokenImage: "",
    vehicleBrand: "",
    validity: "",
    fitness: "",
    fitnessImage: "",
    chassisNumber: "",
    engineNumber: "",
    sticker: "",
    stickerImage: "",
    drivingType: "",
    driverName: "",
    driverImage: "",
    driverNidNo: "",
    drivingLicenseNo: "",
    driverNidImage: "",
    licenseExpireDate: "",
  });

  const [uploading, setUploading] = useState(false);

  // universal change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // update registrationParts and generate registrationInfo
  const handleRegistrationChange = (field, value) => {
    setRegistrationParts((prev) => {
      const updated = { ...prev, [field]: value };
      const { location, unit, serial, year } = updated;

      const formatted =
        location && unit && serial?.length === 2 && year?.length === 4
          ? `${location}-${unit}-${serial}-${year}`
          : "";

      setEnrollment((prevEnroll) => ({
        ...prevEnroll,
        registrationInfo:
          (location || "") +
          (unit ? "." + unit : "") +
          (serial ? "." + serial : "") +
          (year ? "." + year : ""),
        registrationNo: formatted, // <-- auto set
      }));

      return updated;
    });
  };

  // upload helper
  const handleImageUpload = async (fieldName, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setEnrollment((prev) => ({ ...prev, [fieldName]: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!enrollment.pno || !enrollment.fullName) {
        alert("PNO and Full Name are required!");
        return;
      }

      await api.post("/enrollment", enrollment);
      alert("Enrollment saved successfully!");

      setEnrollment({
        pno: "",
        officialRank: "",
        brNoOrNid: "",
        jobLocation: "",
        permanentAddress: "",
        userCategory: "",
        fullName: "",
        primaryMobile: "",
        alternativeMobile: "",
        email: "",
        bloodGroup: "",
        profileImage: "",
        vehicleType: "",
        registrationInfo: "",
        registrationNo: "",
        issueDate: "",
        taxToken: "",
        taxTokenImage: "",
        vehicleBrand: "",
        validity: "",
        fitness: "",
        fitnessImage: "",
        chassisNumber: "",
        engineNumber: "",
        sticker: "",
        stickerImage: "",
        drivingType: "",
        driverName: "",
        driverImage: "",
        driverNidNo: "",
        drivingLicenseNo: "",
        driverNidImage: "",
        licenseExpireDate: "",
      });

      setRegistrationParts({ location: "", unit: "", serial: "", year: "" });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save enrollment!");
    }
  };

  return (
    <div className="w-full bg-white min-h-screen p-2 text-[13px]">
      {loadingSetup ? (
        <p>Loading setup...</p>
      ) : (
        <div className="w-full bg-white ">
          {/* ---------------- PERSONAL ---------------- */}
          <section className="border-b border-gray-400 px-4 py-3">
            <h2 className="font-semibold text-[13px] mb-3 border-b border-gray-400 pb-1">
              Personal Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
              <Input
                label="* PNO / Official No"
                name="pno"
                value={enrollment.pno}
                onChange={handleChange}
              />
              <Select
                label="* User Category"
                name="userCategory"
                value={enrollment.userCategory}
                onChange={handleChange}
                options={setup?.UserCategory || []}
              />
              <Select
                label="* Official Rank"
                name="officialRank"
                value={enrollment.officialRank}
                onChange={handleChange}
                options={setup?.Rank || []}
              />
              <Input
                label="* Full Name"
                className="md:col-span-2"
                name="fullName"
                value={enrollment.fullName}
                onChange={handleChange}
              />
              <div className="flex gap-5">
                <Input
                  label="* Primary Mobile"
                  name="primaryMobile"
                  value={enrollment.primaryMobile}
                  onChange={handleChange}
                />
                <Input
                  label="Alternative Mobile"
                  name="alternativeMobile"
                  value={enrollment.alternativeMobile}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="* BR NO / NID"
                name="brNoOrNid"
                value={enrollment.brNoOrNid}
                onChange={handleChange}
              />
              <Input
                label="* Job Location"
                required
                name="jobLocation"
                value={enrollment.jobLocation}
                onChange={handleChange}
                searchable
                options={setup?.JobLocation || []}
              />
              <Select
                label="* Blood Group"
                name="bloodGroup"
                value={enrollment.bloodGroup}
                onChange={handleChange}
                options={setup?.BloodGroup || []}
              />
              <Textarea
                label="Permanent Address"
                className="md:col-span-2"
                name="permanentAddress"
                value={enrollment.permanentAddress}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                value={enrollment.email}
                onChange={handleChange}
              />

              {/* Profile Image */}
              <Upload
                label="Profile Image"
                value={enrollment.profileImage}
                onUpload={(file) => handleImageUpload("profileImage", file)}
              />
            </div>
          </section>

          {/* ---------------- VEHICLE ---------------- */}
          <section className="border-b border-gray-400 px-4 py-3">
            <h2 className="font-semibold text-[13px] mb-3 border-b border-gray-400 pb-1">
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
              <Select
                label="* Vehicle Type"
                name="vehicleType"
                value={enrollment.vehicleType}
                onChange={handleChange}
                options={vehicles?.map((v) => v.type) || []}
              />
              <Select
                label="* Vehicle Brand"
                name="vehicleBrand"
                value={enrollment.vehicleBrand}
                onChange={handleChange}
                options={setup?.VehicleBrand?.map((v) => v.split(".")[1]) || []}
              />
              <Select
                label="* Vehicle Model"
                name="vehicleModel"
                value={enrollment.vehicleModel}
                onChange={handleChange}
                options={setup?.VehicleModel?.map((v) => v) || []}
              />

              {/* Registration Info */}
              <div className="border border-gray-400 p-3 space-y-3 bg-[#f8f8f8] md:col-span-3">
                <h3 className="font-semibold text-[13px]">
                  Registration Information
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <Select
                    value={registrationParts.location}
                    onChange={(e) =>
                      handleRegistrationChange("location", e.target.value)
                    }
                    options={setup.BRTALocation}
                  />
                  <Select
                    value={registrationParts.unit}
                    onChange={(e) =>
                      handleRegistrationChange("unit", e.target.value)
                    }
                    options={setup.BRTADigit}
                  />
                  <Input
                    value={registrationParts.serial}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 2);

                      handleRegistrationChange("serial", value);

                      // Auto move to year after 2 characters
                      if (value.length === 2) {
                        yearRef.current?.focus();
                      }
                    }}
                    inputRef={serialRef}
                  />
                  <Input
                    value={registrationParts.year}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 4);

                      handleRegistrationChange("year", value);
                    }}
                    inputRef={yearRef}
                  />
                </div>

                <Input
                  label="* Registration No"
                  className="md:col-span-2"
                  name="registrationNo"
                  value={enrollment.registrationNo}
                  onChange={handleChange}
                />
              </div>
              <div className="flex w-[100%] gap-5">
                <Input
                  label="Sticker"
                  name="sticker"
                  value={enrollment.sticker}
                  onChange={handleChange}
                />

                <Upload
                  label="Sticker Image"
                  value={enrollment.stickerImage}
                  onUpload={(file) => handleImageUpload("stickerImage", file)}
                />
              </div>
              <div className="flex gap-5 w-full">
                <Input
                  label="* Chassis Number"
                  name="chassisNumber"
                  value={enrollment.chassisNumber}
                  onChange={handleChange}
                />
                <Input
                  label="* Engine Number"
                  name="engineNumber"
                  value={enrollment.engineNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-5">
                <Input
                  type="date"
                  label="* Issue Date"
                  name="issueDate"
                  value={enrollment.issueDate}
                  onChange={(e) =>
                    setEnrollment((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                />

                <Input
                  type="date"
                  label="* Validity"
                  name="validity"
                  value={enrollment.validity}
                  onChange={(e) =>
                    setEnrollment((prev) => ({
                      ...prev,
                      validity: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-5">
                <Input
                  type="date"
                  label="Fitness"
                  name="fitness"
                  value={enrollment.fitness}
                  onChange={handleChange}
                />

                <Upload
                  label="Fitness Image"
                  value={enrollment.fitnessImage}
                  onUpload={(file) => handleImageUpload("fitnessImage", file)}
                />
              </div>
              <div className="flex gap-5">
                <Input
                  type="date"
                  label="* Tax Token"
                  name="taxToken"
                  value={enrollment.taxToken}
                  onChange={(e) =>
                    setEnrollment((prev) => ({
                      ...prev,
                      taxToken: e.target.value,
                    }))
                  }
                />
                <Upload
                  label="Tax Token Image"
                  value={enrollment.taxTokenImage}
                  onUpload={(file) => handleImageUpload("taxTokenImage", file)}
                />
              </div>
            </div>
          </section>

          {/* ---------------- DRIVING ---------------- */}
          <section className="p-4">
            <h2 className="font-semibold text-[13px] mb-3 border-b border-gray-400 pb-1">
              Driving Information
            </h2>
            <div className="flex gap-x-6 gap-y-2">
              <div>
                <label className=" mb-1">* Driving Type</label>
                <div className="flex items-center gap-6 mt-1">
                  <label>
                    <input
                      type="radio"
                      name="drivingType"
                      value="OWN"
                      checked={enrollment.drivingType === "OWN"}
                      onChange={handleChange}
                    />{" "}
                    OWN
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="drivingType"
                      value="HIRED"
                      checked={enrollment.drivingType === "HIRED"}
                      onChange={handleChange}
                    />{" "}
                    HIRED
                  </label>
                </div>
              </div>
              <div className="flex justify-around flex-1 gap-5">
                <Input
                  label="* Full Name"
                  className="flex-1"
                  name="driverName"
                  value={enrollment.driverName}
                  onChange={handleChange}
                />
                <Input
                  label="* Driver NID NO"
                  name="driverNidNo"
                  value={enrollment.driverNidNo}
                  onChange={handleChange}
                />

                <Upload
                  label="Driver NID Image"
                  value={enrollment.driverNidImage}
                  onUpload={(file) => handleImageUpload("driverNidImage", file)}
                />
                {/* </div>
              <div className="flex justify-around gap-5"> */}
                <Input
                  label="* Driving License No"
                  name="drivingLicenseNo"
                  value={enrollment.drivingLicenseNo}
                  onChange={handleChange}
                />

                <Input
                  type="date"
                  label="* License Expire Date"
                  name="licenseExpireDate"
                  value={enrollment.licenseExpireDate}
                  onChange={(e) =>
                    setEnrollment((prev) => ({
                      ...prev,
                      licenseExpireDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-5">
              <Upload
                label="Driving License Image"
                value={enrollment.driverImage}
                onUpload={(file) => handleImageUpload("driverImage", file)}
              />
            </div>
          </section>

          {/* ---------------- BUTTONS ---------------- */}
          <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-400 bg-[#f0f0f0]">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-1.5 bg-[#1f7a5c] text-white text-[13px] border border-[#1f7a5c]"
            >
              SAVE
            </button>
            <button
              type="button"
              className="px-6 py-1.5 bg-gray-600 text-white text-[13px] border border-gray-600"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Reusable Components ================= */

// function Input({
//   label,
//   required,
//   type = "text",
//   className = "",
//   name,
//   value,
//   onChange,
//   inputRef,
//   searchable = false,
//   options = [], // pass JobLocation array here if searchable
// }) {
//   const [query, setQuery] = useState(value || "");
//   const [showOptions, setShowOptions] = useState(false);
//   const wrapperRef = useRef(null);

//   // Filter options based on query (startsWith, case-sensitive)
//   const filteredOptions = query
//     ? options.filter((opt) => opt.toLowerCase().startsWith(query))
//     : options;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setShowOptions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle selection
//   const handleSelect = (val) => {
//     onChange({ target: { name, value: val } });
//     setQuery(val);
//     setShowOptions(false);
//   };

//   if (type === "date") {
//     return (
//       <div className={className}>
//         {label && (
//           <label className="block text-sm font-medium mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//           </label>
//         )}
//         <DatePicker
//           selected={value ? new Date(value) : null}
//           onChange={(date) => onChange({ target: { name, value: date } })}
//           dateFormat="dd-MMM-yyyy"
//           className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none"
//           placeholderText="dd/mm/yy"
//           showMonthDropdown
//           showYearDropdown
//           dropdownMode="select"
//         />
//       </div>
//     );
//   }

//   if (searchable) {
//     return (
//       <div className={`relative ${className}`} ref={wrapperRef}>
//         {label && (
//           <label className="block text-sm font-medium mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//           </label>
//         )}

//         <input
//           type="text"
//           name={name}
//           value={query}
//           onChange={(e) => {
//             setQuery(e.target.value.toLowerCase());
//             onChange(e);
//             setShowOptions(true);
//           }}
//           onFocus={() => setShowOptions(true)}
//           className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none"
//           placeholder="Type to search..."
//         />

//         {showOptions && filteredOptions.length > 0 && (
//           <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
//             {filteredOptions.map((opt, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => handleSelect(opt)}
//                 className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
//               >
//                 {opt}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   }

//   // Normal input
//   return (
//     <div className={className}>
//       {label && (
//         <label className="block text-sm font-medium mb-1">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <input
//         ref={inputRef}
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border border-gray-400 px-2 py-1 text-[13px] focus:outline-none"
//       />
//     </div>
//   );
// }

function Input({
  label,
  required,
  type = "text",
  className = "",
  name,
  value,
  onChange,
  inputRef,
  searchable = false,
  options = [],
}) {
  const [query, setQuery] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);

  const filteredOptions = query
    ? options.filter((opt) => opt.toLowerCase().startsWith(query.toLowerCase()))
    : options;

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setQuery(val);
    setShowOptions(false);
  };

  const handleKeyDown = (e) => {
    if (!showOptions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredOptions[highlightIndex];
      if (selected) handleSelect(selected);
    }
  };

  const wrapperStyle =
    "border border-gray-400 rounded focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition";

  // DATE INPUT
  if (type === "date") {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className={wrapperStyle}>
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date) => onChange({ target: { name, value: date } })}
            dateFormat="dd-MMM-yyyy"
            className="w-full px-2 py-1 text-[13px] focus:outline-none"
            placeholderText="dd/mm/yy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            tabIndex={0}
          />
        </div>
      </div>
    );
  }

  // SEARCHABLE INPUT
  if (searchable) {
    return (
      <div className={`relative ${className}`} ref={wrapperRef}>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className={wrapperStyle}>
          <input
            type="text"
            name={name}
            value={query}
            tabIndex={0}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e);
              setShowOptions(true);
              setHighlightIndex(0);
            }}
            onFocus={() => setShowOptions(true)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-[13px] focus:outline-none"
            placeholder="Type to search..."
          />
        </div>

        {showOptions && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
            {filteredOptions.map((opt, idx) => (
              <li
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevents blur
                  handleSelect(opt);
                }}
                className={`px-4 py-2 cursor-pointer ${
                  idx === highlightIndex
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-indigo-100"
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // NORMAL INPUT
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={wrapperStyle}>
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          tabIndex={0}
          className="w-full px-2 py-1 text-[13px] focus:outline-none"
        />
      </div>
    </div>
  );
}
function Select({
  label,
  required,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
}) {
  const wrapperStyle =
    "border border-gray-400 rounded focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={wrapperStyle}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          tabIndex={0}
          className="w-full px-2 py-1 text-[13px] bg-white focus:outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={typeof opt === "object" ? opt.value : opt}>
              {typeof opt === "object" ? opt.value : opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Textarea({ label, className = "", name, value, onChange }) {
  const wrapperStyle =
    "border border-gray-400 rounded focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <div className={wrapperStyle}>
        <textarea
          rows="3"
          name={name}
          value={value}
          onChange={onChange}
          tabIndex={0}
          className="w-full px-2 py-1 text-[13px] focus:outline-none"
        />
      </div>
    </div>
  );
}
/* ================= UPLOAD COMPONENT WITH PREVIEW ================= */
function Upload({ label, onUpload, value }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const handleChange = async (e) => {
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
          className="mt-2 w-24 h-24 object-cover rounded border"
        />
      )}
    </div>
  );
}
