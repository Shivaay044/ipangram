const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const departmentRouter = require("./department.route");
const employeeDepartmentRouter = require("./employeeDepartment.route");





router.use("/auth", authRouter);
router.use("/department",departmentRouter);
router.use("/employee-dept",employeeDepartmentRouter);








module.exports = router;