const { UserModel } = require("../models/auth.model");
const Department = require("../models/department.model");
const EmployeeDepartment = require("../models/employeeDepartment.model");
const { BaseError } = require("../utils/error");





exports.addEmployeeDepartment = async (req, res, next) => {
  try {
    let { employeeId, departmentId } = req.body;

    if (!employeeId || !Array.isArray(employeeId) || employeeId.length === 0 || !departmentId) {
      return next(new BaseError("employeeId must be an array and departmentId is required", 400));
    }

    const isDepartmentExist = await Department.findById(departmentId);
    if (!isDepartmentExist) {
      return next(new BaseError("Department does not exist", 404));
    }

    const validEmployees = await UserModel.find({ _id: { $in: employeeId } });
    if (validEmployees.length !== employeeId.length) {
      return next(new BaseError("One or more employees do not exist", 404));
    }

    const employeeAssignments = employeeId.map(empId => ({
      employeeId: empId,
      departmentId: departmentId,
    }));

    await EmployeeDepartment.insertMany(employeeAssignments);

    res.status(200).json({ message: "Employees assigned successfully", data: employeeAssignments });
  } catch (error) {
    next(error);
  }
};


exports.deleteEmployeeDepartment = async (req, res, next) => {
   try {
     let { employeeId, departmentId } = req.body;
 
     if (!employeeId || !Array.isArray(employeeId) || employeeId.length === 0 || !departmentId) {
       return next(new BaseError("employeeId must be an array and departmentId is required", 400));
     }
 
     const isDepartmentExist = await Department.findById(departmentId);
     if (!isDepartmentExist) {
       return next(new BaseError("Department does not exist", 404));
     }
 
     const validEmployees = await UserModel.find({ _id: { $in: employeeId } });
     if (validEmployees.length !== employeeId.length) {
       return next(new BaseError("One or more employees do not exist", 404));
     }
 
     const deleteResult = await EmployeeDepartment.deleteMany({
       employeeId: { $in: employeeId },
       departmentId: departmentId,
     });
 
     if (deleteResult.deletedCount === 0) {
       return next(new BaseError("No employees were removed from the department", 404));
     }
 
     res.status(200).json({ message: "Employees removed successfully", data: deleteResult });
   } catch (error) {
     next(error);
   }
 };
