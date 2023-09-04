const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const Employee = require("./models/Employee");

const app = express();

app.use(express.json());
require("dotenv").config(); // console.log(process.env);

//connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Sample API");
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("API");
});

//add an EMPLOYEE
app.post("/employee", async (req, res) => {
  try {
    const employee = await Employee.create(req.body); //hard-coded some employee
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all EMPLOYEES
app.get("/employee", async (req, res) => {
  try {
    const employee = await Employee.find();
    const empData = JSON.stringify(employee, null, 2); //using stringify() since found it better than toString()

    fs.writeFileSync("employee.json", empData);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update an EMPLOYEE by id
app.put("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndUpdate(id, req.body);

    //in-case employee is not present
    if (!employee) {
      return res
        .status(404)
        .json({ message: `No employee exists with emp_id ${id}` });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get an EMPLOYEE by id
app.get("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete an EMPLOYEE by id
app.delete("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
