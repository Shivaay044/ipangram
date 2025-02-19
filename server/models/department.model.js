const { default: mongoose } = require("mongoose");





const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    categoryName: { 
      type: String, 
      enum: ['HR', 'IT', 'Sales', 'Product', 'Marketing'], 
      required: true 
    },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
  });



  
  const Department = mongoose.model('Department', departmentSchema);
  module.exports = Department;
  