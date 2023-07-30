// app create
const express = require("express");
const app = express();

// FIND PORT
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// add middleware
app.use(express.json());

// db connect
const db = require("./config/databaseconnect");
db.connect();

// api route mount karna
const StudentRoute = require("./routes/student");
app.use("/api", StudentRoute);

// activate server
app.get("/", (req, res) => {
  res.send(" STUDENT API");
});

app.listen(PORT, () => {
  console.log(`API is running to ${PORT}`);
});
