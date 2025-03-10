// filepath: /Users/mac/Downloads/E-commerce-BE-master/generateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userId = '67cec63691876f0feb7001cd'; // Replace with the actual user ID
const Secret = process.env.SEC;

const token = jwt.sign({ _id: userId }, Secret, { expiresIn: '1h' });
console.log('Generated JWT Token:', token);