const { default: mongoose } = require("mongoose");



const employeeDepartmentSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments', required: true },
});
  

const EmployeeDepartment = mongoose.model('EmployeeDepartment', employeeDepartmentSchema);



  module.exports = EmployeeDepartment;
  