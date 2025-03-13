const Userdata = require('../model/userModel');
const express = require('express');
require('dotenv').config();
const Path = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');
let FROM = process.env.EMAIL;
let PASSWORD = process.env.PASSWORD;
let Secret = process.env.SEC;

// Conform To work API;
Path.get('/', (req, res) => {
    res.send('<h1>Learn from mistake<h1/>');
});

// User registration
Path.post('/Register', async (req, res) => {
    try {
        // Check if user with the same email already exists
        let existingUser = await Userdata.findOne({ Email: req.body.Email });
        if (existingUser) {
            return res.status(400).json({ Message: "Email already exists" });
        }

        // Password Hashing;
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.Password, salt);
        req.body.Password = hash;

        // Data insert and send link;
        let inward = new Userdata(req.body);
        let data = await inward.save();
        let Active = `${process.env.CONNECTION}/Activate/${data._id}`;
        let To = data.Email;

        // Send a link Via mail;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: FROM,
                pass: PASSWORD
            }
        });

        var mailOptions = {
            from: FROM,
            to: To,
            subject: 'Account activate',
            text: "Click this Link Activate your Account",
            html: `<a href="${Active}" target="_blank">${Active}</a>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        });
        res.json({ Message: "Account Created, please Activate Account" });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ Message: "Email already exists" });
        }
        console.log(error);
        res.status(500).json({ Message: "Error creating account" });
    }
});

// Account Activation;
Path.get('/Activate/:id', async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await Userdata.findById(userId);
        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }

        user.isActive = true;
        await user.save();
        res.json({ Message: "Account activated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Error activating account" });
    }
});

// Login;
Path.post('/Login', async (req, res) => {
    try {
        let Match = req.body.Email;
        let mail = await Userdata.findOne({ Email: Match });
        if (mail == null) {
            return res.status(404).json({ Message: "User Not Found" });
        }
        if (mail.isActive !== 'Active') {
            return res.status(403).json({ Message: "Your Account is Inactive" });
        }
        let compare = await bcrypt.compare(req.body.Password, mail.Password);
        if (compare) {
            let token = jwt.sign({ _id: mail._id }, process.env.SEC, { expiresIn: '1h' });
            return res.json({ token, Username: mail.Username });
        } else {
            return res.status(401).json({ Message: "Invalid Email or Password" });
        }
    } catch (error) {
        console.log('Something went wrong' + error);
        res.status(500).json({ Message: "Error logging in" });
    }
});

// Forgot password
Path.post('/Forgot', async (req, res) => {
    try {
        // Email find and Generating Reset password link;
        let Reset = req.body.Email;
        let check = await Userdata.findOne({ Email: Reset });
        if (check) {
            let email = check.Email;
            let token = jwt.sign({ _id: check._id }, Secret, { expiresIn: '5m' });

            const Link = `${process.env.CONNECTION}/Update/${check._id}/${token}`;

            // Reset link send via Email;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: FROM,
                    pass: PASSWORD
                }
            });

            var mailOptions = {
                from: FROM,
                to: email,
                subject: 'Password Reset Link',
                text: "Click this Link Reset your password",
                html: `<a href="${Link}" target="_blank">${Link}</a>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent:' + info.response);
                }
            });
            res.status(201).json({ Message: "Reset Link sent to mail" });
        } else {
            res.status(404).json({ Message: "User not found" });
        }
    } catch (error) {
        console.log('Something Went wrong' + error);
        res.status(500).json({ Message: "Error sending reset link" });
    }
});

// New password update
Path.put('/Reset-Password/:id/:token', async (req, res) => {
    try {
        // Collect Req data
        let ideate = req.params.id;
        let verify = req.params.token;

        // New Password hashing;
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.Password, salt);
        req.body.Password = hash;

        // Link Time Validation;
        let compare = jwt.verify(verify, Secret);
        if (compare) {
            // Verification and Update the New Password;
            let Modify = await Userdata.findOneAndUpdate({ _id: ideate }, { $set: { Password: hash } }, { new: true });
            res.json({ Modify });
        } 
    } catch (error) {
        res.status(440).json({ Message: "Session Expired" });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ Message: "No token provided" });
    }
    jwt.verify(token.split(' ')[1], Secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ Message: "Failed to authenticate token" });
        }
        req.userId = decoded._id;
        next();
    });
};

// Example of a protected route
Path.get('/Protected', verifyToken, (req, res) => {
    res.json({ Message: "This is a protected route", userId: req.userId });
});

module.exports = Path;