// Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

// Express set up
const app = express();
const PORT = 3001;

// Data parsing required for API calls
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
