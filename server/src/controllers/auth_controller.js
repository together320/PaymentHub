// import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import dotenv from "dotenv";
import crypto from 'crypto';

dotenv.config();
// console.log('env', process.env);
const JWT_SECRET = process.env.SECRET_KEY;

function generateApiKey() {
  const apiKey = crypto.randomBytes(32).toString('hex');
  return apiKey;
}

export const login =  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
 
    try {
      // Check for existing user
      const user = await User.findOne({ email });
      if (!user) throw Error('User does not exist');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw Error('Invalid credentials');

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
      if (!token) throw Error('Couldnt sign the token');

      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (e) {
      res.status(400).json({ message: e.message });
    }
};

export const register =  async (req, res) => {
    const { name, email, password, type="2d", currency="USD" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    let apiKey = generateApiKey();

    try {
      const user = await User.findOne({ email });
      if (user) throw Error('User already exists');

      const salt = await bcrypt.genSalt(10);
      if (!salt) throw Error('Something went wrong with bcrypt');

      const hash = await bcrypt.hash(password, salt);
      if (!hash) throw Error('Something went wrong hashing the password');

      const newUser = new User({
        name,
        email,
        type,
        currency,
        apiKey,
        password: hash
      });

      const savedUser = await newUser.save();
      if (!savedUser) throw Error('Something went wrong saving the user');

      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
        expiresIn: 3600
      });

      res.status(200).json({
        token,
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email
        }
      });

    } catch (e) {
      res.status(400).json({ error: e.message });
    }
};

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

export const getPassword =  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User Does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
