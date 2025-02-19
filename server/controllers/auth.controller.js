const { UserModel } = require("../models/auth.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { BaseError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const EmployeeDepartment = require("../models/employeeDepartment.model");
const { default: mongoose } = require("mongoose");

exports.registerUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, gender, hobbies, role, password } =
      req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return next(new BaseError("Email already registered", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new BaseError("user not found", 404));
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Login successful", token, id: user._id, role:user.role });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUserDetails = async (req, res, next) => {
  try {
    const userDetails = await EmployeeDepartment.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $project: {
          name: "$employee.firstName",
          email: "$employee.email",
          gender: "$employee.gender",
          hobbies: "$employee.hobbies",
          role: "$employee.role",
          departmentName: "$department.departmentName",
          categoryName: "$department.categoryName",
          location: "$department.location",
          salary: "$department.salary",
        },
      },
    ]);

    return res.status(200).json({ message: "details", data: userDetails[0] });
  } catch (error) {
    next(error);
  }
};

exports.employeeWithoutDepartment = async (req, res, next) => {
  try {
    const employeeWithutDepartment = await UserModel.find({role:'employee'});

    return res
      .status(200)
      .json({
        message: "all user without department",
        data: employeeWithutDepartment,
      });
  } catch (error) {
    next(error);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await UserModel.find(
      { role: "employee" },
      { firstName: 1, lastName: 1, email: 1, gender: 1, hobbies: 1 }
    );
    return res
      .status(200)
      .json({ message: "all employees data", data: employees });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};
