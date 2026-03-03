import { act, useEffect, useState } from "react";
import {
  FaCar,
  FaCheckCircle,
  FaMotorcycle,
  FaTimesCircle,
  FaTruckPickup,
} from "react-icons/fa";
import { FaBus } from "react-icons/fa6";
import { GiWeightLiftingUp } from "react-icons/gi";
import { HiOutlineIdentification } from "react-icons/hi";
import { MdOutlineCreditCardOff, MdOutlinePayments } from "react-icons/md";
import api from "../../utils/api.js";
import { getAuth, setAuth } from "../../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useVehicle } from "../../context/VehicleContext.jsx";
import { useSetup } from "../../context/SetupContext.jsx";

export default function Home() {
  const [enrollments, setEnrollments] = useState([]);

  const { vehicles } = useVehicle();
  const navigate = useNavigate();
  // const data = enrollments;

  const { setup } = useSetup();

  const typeCar = setup?.VehicleBrand?.map((item) => item.split(".")[0]);

  const [stats, setStats] = useState([
    {
      title: "Total Vehicle",
      value: 0,
      icon: <FaCar />,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      title: "Active",
      value: 0,
      icon: <FaCheckCircle />,
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      title: "Inactive",
      value: 0,
      icon: <FaTimesCircle />,
      color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
    },
    {
      title: "Tax Token Expired",
      value: 0,
      icon: <MdOutlinePayments />,
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
    {
      title: "Fitness Expired",
      value: 0,
      icon: <GiWeightLiftingUp />,
      color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    },
    {
      title: "Sticker Expired",
      value: 0,
      icon: <HiOutlineIdentification />,
      color: "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200",
    },
    {
      title: "Driving Licence Expired",
      value: 0,
      icon: <MdOutlineCreditCardOff />,
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
  ]);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollment");
      // const data = await res.json();

      setEnrollments(res.data);
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    }
  };
  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getTotalVehicles = (data) => data;

  const getActiveVehicles = (data) =>
    data.filter(
      (item) =>
        !isExpired(item.validity) &&
        !isExpired(item.fitness) &&
        !isExpired(item.sticker) &&
        !isExpired(item.licenseExpireDate),
    );

  const getInactiveVehicles = (data) =>
    data.filter(
      (item) =>
        isExpired(item.validity) ||
        isExpired(item.fitness) ||
        isExpired(item.sticker) ||
        isExpired(item.licenseExpireDate),
    );
  const getTaxTokenExpired = (data) =>
    data.filter((item) => isExpired(item.taxToken));
  const getFitnessExpired = (data) =>
    data.filter((item) => isExpired(item.fitness));
  const getStickerExpired = (data) =>
    data.filter((item) => isExpired(item.sticker));
  const getLicenseExpired = (data) =>
    data.filter((item) => isExpired(item.licenseExpireDate));

  const totalV = getTotalVehicles(enrollments);

  // const totalV = getTotalVehicles(setup?.VehicleBrand);

  const activeV = getActiveVehicles(enrollments);
  const inactiveV = getInactiveVehicles(enrollments);
  const taxV = getTaxTokenExpired(enrollments);
  const fitnessV = getFitnessExpired(enrollments);
  const stickerV = getStickerExpired(enrollments);
  const licenseV = getLicenseExpired(enrollments);

  const [vehicle, setVehicle] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const tableShow = (items) => {
    // console.log(items);

    navigate("/vehicle-table", { state: items });
  };
  useEffect(() => {
    if (enrollments.length === 0) return;

    const total = getTotalVehicles(enrollments).length;
    const active = getActiveVehicles(enrollments).length;
    const inactive = getInactiveVehicles(enrollments).length;
    const taxExpired = getTaxTokenExpired(enrollments).length;
    const fitnessExpired = getFitnessExpired(enrollments).length;
    const stickerExpired = getStickerExpired(enrollments).length;
    const licenseExpired = getLicenseExpired(enrollments).length;

    setStats([
      {
        title: "Total Vehicle",
        value: total,
        icon: <FaCar />,
        color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        data: totalV,
      },
      {
        title: "Active",
        value: active,
        icon: <FaCheckCircle />,
        color: "bg-green-100 text-green-700 hover:bg-green-200",
        data: activeV,
      },
      {
        title: "Inactive",
        value: inactive,
        icon: <FaTimesCircle />,
        color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
        data: inactiveV,
      },
      {
        title: "Tax Token Expired",
        value: taxExpired,
        icon: <MdOutlinePayments />,
        color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        data: taxV,
      },
      {
        title: "Fitness Expired",
        value: fitnessExpired,
        icon: <GiWeightLiftingUp />,
        color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        data: fitnessV,
      },
      {
        title: "Sticker Expired",
        value: stickerExpired,
        icon: <HiOutlineIdentification />,
        color: "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200",
        data: stickerV,
      },
      {
        title: "Driving Licence Expired",
        value: licenseExpired,
        icon: <MdOutlineCreditCardOff />,
        color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
        data: licenseV,
      },
    ]);
  }, [enrollments]);

  // const stats = [
  //   {
  //     title: "Total Vehicle",
  //     value: 678,
  //     icon: <FaCar />,
  //     color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  //   },
  //   {
  //     title: "Active",
  //     value: 655,
  //     icon: <FaCheckCircle />,
  //     color: "bg-green-100 text-green-700 hover:bg-green-200",
  //   },
  //   {
  //     title: "Inactive",
  //     value: 23,
  //     icon: <FaTimesCircle />,
  //     color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  //   },
  //   {
  //     title: "Tax Token Expired",
  //     value: 146,
  //     icon: <MdOutlinePayments />,
  //     color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  //   },
  //   {
  //     title: "Fitness Expired",
  //     value: 6,
  //     icon: <GiWeightLiftingUp />,
  //     color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
  //   },
  //   {
  //     title: "Sticker Expired",
  //     value: 0,
  //     icon: <HiOutlineIdentification />,
  //     color: "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200",
  //   },
  //   {
  //     title: "Driving Licence Expired",
  //     value: 43,
  //     icon: <MdOutlineCreditCardOff />,
  //     color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  //   },
  // ];

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-indigo-50 border rounded-md px-4 py-3 mb-6">
        <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
      </div>

      {/* ================= Stats Cards ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-md shadow-sm
              cursor-pointer
              transform transition-all duration-300 ease-in-out
              hover:scale-[1.03] hover:shadow-md
              ${item.color}`}
            onClick={() => tableShow(item.data)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.title}</span>

              {/* BIG ICON */}
              <span className="text-4xl opacity-80">{item.icon}</span>
            </div>

            <span className="font-bold text-lg mt-2 block">{item.value}</span>
          </div>
        ))}
      </div>

      {/* ================= Vehicle Category ================= */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          VEHICLE CATEGORY WISE
        </h2>

        <div className="bg-slate-800 rounded-md grid grid-cols-2 md:grid-cols-4 text-center text-white overflow-hidden">
          {[
            {
              name: `Car`,
              value: `${enrollments.filter((item) => item.vehicleType.toLowerCase() === "car").length}`,
              icon: <FaCar />,
            },
            {
              name: `Pickup`,
              value: `${enrollments.filter((item) => item.vehicleType.toLowerCase() === "pickup").length}`,
              icon: <FaTruckPickup />,
            },
            {
              name: `Motorcycle`,
              value: `${enrollments.filter((item) => item.vehicleType.toLowerCase() === "motorcycle").length}`,
              icon: <FaMotorcycle />,
            },
            {
              name: `Bus`,
              value: `${enrollments.filter((item) => item.vehicleType.toLowerCase() === "microbus").length}`,
              icon: <FaBus />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 cursor-pointer
                transform transition-all duration-300 ease-in-out
                hover:bg-slate-700 hover:scale-[1.02]"
            >
              <div className="flex justify-center text-4xl text-yellow-400 mb-2">
                {item.icon}
              </div>
              <p className="text-yellow-400 font-bold">{item.name}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= Top Warn Vehicles ================= */}
      <div className="bg-white rounded-md shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          TOP WARN VEHICLES
        </h2>

        <div className="flex flex-col md:flex-row justify-between gap-3 mb-3">
          <select className="border rounded px-2 py-1 w-28 cursor-pointer">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <input
            type="text"
            placeholder="Search"
            className="border rounded px-3 py-1
            focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2">Owner Name</th>
                <th className="border px-2 py-2">Personal No</th>
                <th className="border px-2 py-2">Warning Count</th>
                <th className="border px-2 py-2">Vehicle Reg No</th>
                <th className="border px-2 py-2">QR Code</th>
                <th className="border px-2 py-2">Expire Alert</th>
                <th className="border px-2 py-2">Warning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="py-6 text-gray-500">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <p>Showing 0 to 0 of 0 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-100 transition">
              Previous
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
