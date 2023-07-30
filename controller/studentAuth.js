const Student = require("../model/students");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("name is:",name);
    console.log("email is:",email);
    console.log("password is:",password);
    console.log(req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

    // Check if a student with the provided email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student document
    const newStudent = new Student({
        name,
        email,
        password: hashedPassword,
      });
  
      // Save the student to the database
      await newStudent.save();

    

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a student with the provided email exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create and send JWT token
    const token = jwt.sign({ email: student.email }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};