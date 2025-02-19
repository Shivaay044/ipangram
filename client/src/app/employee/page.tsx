"use client"
import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Mail,
  User,
  MapPin,
  DollarSign,
  Layers,
} from "lucide-react";
import instance from "@/config/axios.config";

interface Employee {
  name: string;
  email: string;
  gender: string;
  hobbies: string[];
  role: string;
  departmentName: string;
  categoryName: string;
  location: string;
  salary: number | null;
}

const EmployeeDetails =  () => {

    const [employee,setEmployeeData] = useState<Employee>({
        name: "",
        email: "",
        gender: "",
        hobbies: [],
        role: "",
        departmentName: "",
        categoryName: "",
        location: "",
        salary: null
      })
  

    useEffect(()=>{
    instance
    .get(`/api/auth/employees/current`)
    .then((res) => {
        setEmployeeData(res.data.data)
      return res.data.data;
    })
    .catch((err) => {
      alert(err.message);
    });
    },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white flex items-center">
          <User className="w-12 h-12 mr-4" />
          <h2 className="text-2xl font-bold">Employee Details</h2>
        </div>

        <div className="p-6 space-y-4">
          <Detail
            icon={<User className="text-blue-500" />}
            label="Name"
            value={employee?.name}
          />
          <Detail
            icon={<Mail className="text-green-500" />}
            label="Email"
            value={employee?.email}
          />
          <Detail
            icon={<User className="text-purple-500" />}
            label="Gender"
            value={employee?.gender}
          />
          <Detail
            icon={<Layers className="text-yellow-500" />}
            label="Role"
            value={employee?.role}
          />
          <Detail
            icon={<Briefcase className="text-indigo-500" />}
            label="Department"
            value={employee?.departmentName}
          />
          <Detail
            icon={<Layers className="text-pink-500" />}
            label="Category"
            value={employee?.categoryName}
          />
          <Detail
            icon={<MapPin className="text-red-500" />}
            label="Location"
            value={employee?.location}
          />
          <Detail
            icon={<DollarSign className="text-green-600" />}
            label="Salary"
            value={`${employee?.salary ?employee?.salary: ""  }`}
          />
          <Detail
            icon={<Layers className="text-orange-500" />}
            label="Hobbies"
            value={employee?.hobbies?.join(", ")}
          />
        </div>
      </div>
    </div>
  );
};

const Detail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-lg font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default EmployeeDetails;
