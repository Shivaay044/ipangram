const { UserModel } = require("../models/auth.model");
const Department = require("../models/department.model");
const { BaseError } = require("../utils/error");

exports.createDepartment = async (req, res, next) => {
  try {
    const { departmentName, categoryName, location, salary } = req.body;
    const managerId = req.user.id;

    const manager = await UserModel.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return next(
        new BaseError(
          "Access denied. Only managers can create departments.",
          403
        )
      );
    }

    const newDepartment = new Department({
      departmentName,
      categoryName,
      location,
      salary,
      managerId,
    });

    await newDepartment.save();
    res
      .status(201)
      .json({
        message: "Department created successfully",
        department: newDepartment,
      });
  } catch (error) {
    next(error);
  }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { page = 1, limit = 5 } = req.query;

    const manager = await UserModel.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return next(
        new BaseError("Access denied. Only managers can view departments.", 403)
      );
    }

    const departments = await Department
      .aggregate([
        {
          $lookup: {
            from: "employeedepartments",
            localField: "_id",
            foreignField: "departmentId",
            as: "employeeDepartment",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "employeeId",
                  foreignField: "_id",
                  as: "employeeDetails",
                },
              },
              {
                $unwind: "$employeeDetails",
              },
              {
                $project: {
                  _id: "$employeeDetails._id",
                  name: "$employeeDetails.firstName",
                  email: "$employeeDetails.email",
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            departmentName: 1,
            categoryName: 1,
            location: 1,
            salary: 1,
            employeeDepartment: 1,
          },
        },
      ])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Department.countDocuments({ managerId });

    res.status(200).json({
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id).populate(
      "managerId",
      "firstName lastName email"
    );

    if (!department) {
      return next(new BaseError("Department not found", 404));
    }

    res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;
    const { departmentName, categoryName, location, salary } = req.body;

    const manager = await UserModel.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return next(
        new BaseError(
          "Access denied. Only managers can update departments.",
          403
        )
      );
    }

    const updatedDepartment = await Department.findOneAndUpdate(
      { _id: id, managerId },
      { departmentName, categoryName, location, salary },
      { new: true }
    );

    if (!updatedDepartment) {
      return next(new BaseError("Department not found or unauthorized", 404));
    }

    res
      .status(200)
      .json({
        message: "Department updated successfully",
        department: updatedDepartment,
      });
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const manager = await UserModel.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res
        .status(403)
        .json({
          message: "Access denied. Only managers can delete departments.",
        });
    }

    const deletedDepartment = await Department.findOneAndDelete({
      _id: id,
      managerId,
    });

    if (!deletedDepartment) {
      return next(new BaseError("Department not found or unauthorized", 404));
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};
