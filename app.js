const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const teamRoutes = require("./Routes/team");
const cors = require('cors'); // Import the cors package


require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: '*', // Replace with your front-end URL
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Apply the CORS middleware to Express


// Create server and socket.io instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this according to your front-end URL
    methods: ["GET", "POST"],
  },
});

// Use routes
app.use("/teams", teamRoutes(io));

module.exports = { app, server, io };
