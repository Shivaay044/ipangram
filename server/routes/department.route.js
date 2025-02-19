const express = require("express");
const authMiddlware = require("../middlewares/authMiddlware");
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require("../controllers/department.controller");
const router = express.Router();



router.post('/', authMiddlware(["manager"]), createDepartment);
router.get('/', authMiddlware(["manager"]), getDepartments);
router.get('/:id', authMiddlware(["manager"]), getDepartmentById); 
router.put('/:id', authMiddlware(["manager"]), updateDepartment); 
router.delete('/:id', authMiddlware(["manager"]), deleteDepartment); 




module.exports = router;