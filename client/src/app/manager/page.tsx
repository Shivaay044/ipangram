"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Pencil, Trash, Users, Check, X, Plus } from "lucide-react";
import instance from "@/config/axios.config";

export default function DepartmentsList() {
  const [departments, setDepartments] = useState<any>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    departmentName: "",
    categoryName: "",
    location: "",
    salary: "",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDepartment({
      departmentName: "",
      categoryName: "",
      location: "",
      salary: "",
    });
  };

  const handleNewDepartmentChange = (e: any) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDepartment = async () => {
    if (
      !newDepartment.departmentName ||
      !newDepartment.categoryName ||
      !newDepartment.location ||
      !newDepartment.salary
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await instance.post("/api/department", newDepartment);
      alert(response.data.message);
      closeModal();
      window.location.reload(); 
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (department: any) => {
    setEditId(department._id);
    setEditData({
      ...department,
      employeeDepartment:
        department?.employeeDepartment?.map((emp: any) =>
          typeof emp === "string" ? emp : emp.email
        ) || [],
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOptions: any) => {
    setEditData((prev: any) => ({
      ...prev,
      employeeDepartment: selectedOptions.map((option: any) => option.value),
    }));
  };

  const handleSave = () => {
    if (!editData || !editData.employeeDepartment || editData.employeeDepartment.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
  
    const data = departments.find((el: any) => el._id === editId);
    
    if (!data) {
      alert("Department not found.");
      return;
    }
  

    const selectedEmployeeIds = allEmployees
      .filter((emp: any) => editData.employeeDepartment.includes(emp.email))
      .map((emp: any) => emp._id);
  
    const existingEmployeeIds = data.employeeDepartment.map((emp: any) => emp._id);
  
    const newEmployeeIds = selectedEmployeeIds.filter(
      (id: string) => !existingEmployeeIds.includes(id)
    );
  
    const employeesToRemove = existingEmployeeIds.filter(
      (id: string) => !selectedEmployeeIds.includes(id)
    );

    instance
      .put(`/api/department/${editId}`, {
        departmentName: editData.departmentName,
        categoryName: editData.categoryName,
        location: editData.location,
        salary: editData.salary,
      })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err.message);
      });
  
    if (newEmployeeIds.length > 0) {
      instance
        .post(`/api/employee-dept`, {
          employeeId: newEmployeeIds, 
          departmentId: data._id, 
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  
    if (employeesToRemove.length > 0) {
      instance
        .delete(`/api/employee-dept`, {
          data: {
            employeeId: employeesToRemove, 
            departmentId: data._id,
          },
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.message);
        });
    }

  
    setEditId(null);
    setEditData(null);

    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await instance.delete(`/api/department/${id}`);
        alert(response.data.message);
        window.location.reload(); 
      } catch (err: any) {
        alert(err.message);
      }
    }
  };



  useEffect(() => {
    instance
      .get(`/api/department/`)
      .then((res) => {
        setDepartments(res?.data?.departments);
      })
      .catch((err) => {
        alert(err.message);
      });

    instance
      .get(`/api/auth/employees/no-department`)
      .then((res) => {
        setAllEmployees(res?.data?.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            Departments List
          </h2>
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Add New Department</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="departmentName"
                  placeholder="Department Name"
                  value={newDepartment.departmentName}
                  onChange={handleNewDepartmentChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="categoryName"
                  placeholder="Category Name"
                  value={newDepartment.categoryName}
                  onChange={handleNewDepartmentChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={newDepartment.location}
                  onChange={handleNewDepartmentChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={newDepartment.salary}
                  onChange={handleNewDepartmentChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDepartment}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Department</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Location</th>
                <th className="py-2 px-4 text-left">Salary</th>
                <th className="py-2 px-4 text-left">Assigned Employees</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments?.map((dept: any, index: number) => (
                <tr key={index} className="border-b">
                  {editId === dept._id ? (
                    <>
                      {/* Edit mode */}
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="departmentName"
                          value={editData.departmentName}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="categoryName"
                          value={editData.categoryName}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="location"
                          value={editData.location}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          name="salary"
                          value={editData.salary}
                          onChange={handleChange}
                          className="border rounded p-1 w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <Select
                          options={allEmployees.map((emp: any) => ({
                            value: emp.email,
                            label: emp.email,
                          }))}
                          isMulti
                          key={dept._id}
                          value={allEmployees
                            .filter((emp: any) =>
                              editData?.employeeDepartment?.includes(emp.email)
                            )
                            .map((emp: any) => ({
                              value: emp.email,
                              label: emp.email,
                            }))}
                          onChange={handleSelectChange}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4">{dept.departmentName}</td>
                      <td className="py-2 px-4">{dept.categoryName}</td>
                      <td className="py-2 px-4">{dept.location}</td>
                      <td className="py-2 px-4">
                        ${dept.salary.toLocaleString()}
                      </td>
                      <td className="py-2 px-4">
                        {dept?.employeeDepartment?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {dept?.employeeDepartment?.map(
                              (emp: any, index: any) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-600 px-2 py-1 text-sm rounded-full"
                                >
                                  {emp.email}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No Employees</span>
                        )}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}