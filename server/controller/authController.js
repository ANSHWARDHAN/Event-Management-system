const User = require('../models/User');
const OTP = require('../models/OTP');
const {sendOTPEmail} = require('../utils/email');

const generateToken = (id,role) => {
    return jwt.sign({id,role}, process.env.JWT_SECRET, { expiresIn: '7D' });
}

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    let userExists = await User.findOne({email});
    if(userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user  = await User.create({ name, email, password: hashedPassword , role : 'user' ,isVerified: false });
        // await user.save();
        // res.status(201).json({ message: 'User registered successfully' });
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        await OTP.create({ email, otp, action: 'account_verification' });
        await sendOTPEmail(email,otp,'account_verification');

        res.status(201).json({message: 'User registered successfully. Please check your email for OTP to verify your account.',
            email : user.email
        });
        
        

    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};


//login user
exports.loginUser = async (req,res) => {
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials, please signup up first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if(!user.isVerified && user.role === 'user') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({email, action: 'account_verification'});
            await OTP.create({email, otp, action: 'account_verification'});
            await sendOTPEmail(email, otp, 'account_verification');
            return res.status(400).json({
                error: 'Account not verified a new otp has been sent to your email.'
            });
        }

        res.json({
            message: 'Login Succesful',
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id,user.role)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//verify otp 

exports.verifyOtp = async (req,res)=> {
    const {email,otp} = req.body;
    const otpRecord  = await OTP.findOne({email, otp, action: 'account_verification'});

    if(!otpRecord) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOneAndUpdate({email}, {isVerified: true}, { new: true });
    await OTP.deleteMany({email, action: 'account_verification'});

    res.json({
        message: 'OTP verified successfully',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id,user.role)
    });

}

