const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { authMiddleware, isAdmin } = require('./middleware/auth');
require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);