const express = require('express');
const dotenv=require('dotenv');
const Dbconnection =require('./connectiondb');
const taskRoutes = require("./routes/taskRoutes")
const cors =require('cors');
const app = express();
dotenv.config();
Dbconnection();
app.use(cors({
  origin: "*",  
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use("/api", taskRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
