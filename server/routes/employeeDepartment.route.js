const express = require("express");
const authMiddlware = require("../middlewares/authMiddlware");
const { addEmployeeDepartment, deleteEmployeeDepartment } = require("../controllers/employeeDepartment.controller");
const router = express.Router();



router.post('/', authMiddlware(["manager"]), addEmployeeDepartment);
router.delete('/', authMiddlware(["manager"]), deleteEmployeeDepartment);




module.exports = router;