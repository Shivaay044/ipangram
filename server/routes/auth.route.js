const express = require("express");
const { registerUser, loginUser, logoutUser, employeeWithoutDepartment, getAllEmployees, getCurrentUserDetails } = require("../controllers/auth.controller");
const authMiddlware = require("../middlewares/authMiddlware");
const router = express.Router();




router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/employees",authMiddlware(["employee", "manager"]), getAllEmployees);
router.get("/employees/no-department", authMiddlware(["manager"]), employeeWithoutDepartment);
router.get("/employees/current", authMiddlware(["manager", "employee"]), getCurrentUserDetails);



module.exports = router;
