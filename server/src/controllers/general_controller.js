import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

import User from "../model/User.js";
import OverallStat from "../model/OverallStat.js";
import Transaction from "../model/Transaction.js";

function generateApiKey() {
  const apiKey = crypto.randomBytes(32).toString('hex');
  return apiKey;
}

export const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    city,
    state,
    country,
    occupation,
    phoneNumber,
    transactions,
    role,
  } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
      city,
      state,
      country,
      occupation,
      phoneNumber,
      transactions,
      role,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "48h",
      }
    );

    const user = {
      _id: result._id,
      email: result.email,
      password: result.password,
      name: result.name,
      city: result.city,
      state: result.state,
      country: result.country,
      occupation: result.occupation,
      phoneNumber: result.phoneNumber,
      transactions: result.transactions,
      role: result.role,
    };

    res.status(201).json({
      status: 201,
      message: "User register successfully!",
      result: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const oldUser = await User.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: oldUser._id }, process.env.SECRET_KEY, {
      expiresIn: "148h",
    });

    res
      .status(200)
      .json({ status: 200, message: "User login successfully!", token: token });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Internal server error!", error: err });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const id = req.params.id;

    // console.log('iiiddd', id);

    const result = await User.findById(id);

    // console.log('user-result', result);

    res.status(200).json(result);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    
    // console.log('req.params', req.query.id);
    const {id, startDate, endDate} = req.query;
    const user = JSON.parse(id);
    const _startDate = new Date(startDate);
    let _endDate = new Date(endDate);

    _endDate.setDate(_endDate.getDate() + 1);
    // console.log('dateee', _startDate, _endDate);

    let criteria = {}
    if (user.role === 'admin' || user.role === 'superadmin') {
      criteria = {         
        createdAt: {
          $gte: _startDate,
          $lte: _endDate
        },          
      };
    } else {
      criteria = {
        createdAt: {
          $gte: _startDate,
          $lte: _endDate
        },
        merchantId: user.name,
      };
    }

    /* Recent Transactions */
    const transactions = await Transaction.aggregate([
      {
        $match: criteria
      }, 
      {
        $addFields: {
          amountDouble: { $toDouble: "$amount" }
        }
      },     
      {
        $group: {
          _id: null,
          usdAmount: { $sum: 
            { $cond: [
              { $and: [ { $eq: ["$status", "approved"] }, { $eq: ["$currency", "USD"] } ] }, "$amountDouble", 0] 
            } 
          },
          eurAmount: { $sum: 
            { $cond: [
              { $and: [ { $eq: ["$status", "approved"] }, { $eq: ["$currency", "EUR"] } ] }, "$amountDouble", 0] 
            } 
          },
          gbpAmount: { $sum: 
            { $cond: [
              { $and: [ { $eq: ["$status", "approved"] }, { $eq: ["$currency", "GBP"] } ] }, "$amountDouble", 0] 
            } 
          },
        }
      }
    ]);

    let result = {
      usdAmount: 0,
      eurAmount: 0,
      gbpAmount: 0,
    };
    if (transactions.length > 0) {
      // console.log('dddd', transactions);
      result.usdAmount = transactions[0].usdAmount;
      result.eurAmount = transactions[0].eurAmount;
      result.gbpAmount = transactions[0].gbpAmount;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getChartStats = async (req, res) => {
  try {
    
    // console.log('req.params', req.query.id);
    const {id, startDate, endDate} = req.query;
    const user = JSON.parse(id);
    const _startDate = new Date(startDate);
    let _endDate = new Date(endDate);

    // _endDate.setDate(_endDate.getDate() + 1);
    // console.log('dateee', _startDate, _endDate);

    let criteria = {}
    if (user.role === 'admin' || user.role === 'superadmin') {
      criteria = {         
        createdAt: {
          $gte: _startDate,
          $lte: _endDate
        },          
      };
    } else {
      criteria = {
        createdAt: {
          $gte: _startDate,
          $lte: _endDate
        },
        merchantId: user.name,
      };
    }

    /* Recent Transactions */
    let transactions = await Transaction.aggregate([
      {
        $match: criteria
      }, 
      {
        $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" }
            },
            totalCount: { $sum: 1 },
            approvedCount: {
                $sum: {
                    $cond: [{ $eq: ["$status", "approved"] }, 1, 0]
                }
            }
        }
      },
      {
        $project: {
            date: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: {
                        $dateFromParts: {
                            'year': "$_id.year",
                            'month': "$_id.month",
                            'day': "$_id.day"
                        }
                    }
                }
            },
            totalCount: 1,
            approvedCount: 1
        }
    },
    {
        $sort: {
            "date": 1
        }
    }
    ]);

    let generateDateList = (start, end) => {
      let dateArray = [];
      let currentDate = start;
  
      while (currentDate <= end) {
          dateArray.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return dateArray;
    }
    
    let allDates = generateDateList(_startDate, _endDate);
    
    let result = [];
    
    if (transactions.length > 0) {
      // Merge the results with allDates
      allDates.forEach(date => {
        let dateString = date.toISOString().slice(0, 10);
        let matchedData = transactions.find(d => d.date === dateString);
      
        if (matchedData) {
          // console.log(`Date: ${date.toISOString().slice(0, 10)}, Total Count: ${matchedData.totalCount}, Approved Count: ${matchedData.approvedCount}`);
          result.push({date: dateString, totalCount: matchedData.totalCount, approvedCount: matchedData.approvedCount});
        } else {
          // console.log(`Date: ${date.toISOString().slice(0, 10)}, Total Count: 0, Approved Count: 0`);
          result.push({date: dateString, totalCount: 0, approvedCount: 0});
        }
      });
    }

    // console.log('result-chart', result);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPieStats = async (req, res) => {
  try {
    
    // console.log('req.params', req.query.id);
    const {id, startDate, endDate} = req.query;
    const user = JSON.parse(id);
    const _startDate = new Date(startDate);
    let _endDate = new Date(endDate);

    _endDate.setDate(_endDate.getDate() + 1);
    // console.log('dateee', _startDate, _endDate);

    let criteria = {}
    if (user.role === 'admin' || user.role === 'superadmin') {
      criteria = {         
        createdAt: {
          $gte: _startDate,
          $lte: _endDate
        },          
      };
    } else {
      criteria = {
        createdAt: {
          $gte: _startDate,
          $lte: _endDate
        },
        merchantId: user.name,
      };
    }

    /* Recent Transactions */
    const transactions = await Transaction.aggregate([
      {
        $match: criteria
      }, 
      {
        $addFields: {
          amountDouble: { $toDouble: "$amount" }
        }
      },     
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amountDouble" },
          approvedAmount: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$amountDouble", 0] } },
          declinedAmount: { $sum: { $cond: [{ $eq: ["$status", "declined"] }, "$amountDouble", 0] } },
          cancelledAmount: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, "$amountDouble", 0] } },
          pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amountDouble", 0] } },
          errorAmount: { $sum: { $cond: [{ $eq: ["$status", "error"] }, "$amountDouble", 0] } },
        }
      }
    ]);

    let result = {
      totalAmount: 0,
      approvedAmount: 0,
      declinedAmount: 0,
      cancelledAmount: 0,
      pendingAmount: 0,
      errorAmount: 0,
    };
    if (transactions.length > 0) {
      // console.log('dddd', transactions);
      result.totalAmount = transactions[0].totalAmount;
      result.approvedAmount = transactions[0].approvedAmount;
      result.declinedAmount = transactions[0].declinedAmount;
      result.cancelledAmount = transactions[0].cancelledAmount;
      result.pendingAmount = transactions[0].pendingAmount;
      result.errorAmount = transactions[0].errorAmount;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addUser =  async (req, res) => {
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

    res.status(200).json({
      success: true
    });

  } catch (e) {
    res.status(400).json({ 
      success: false,
      error: e.message 
    });
  }
};

export const updateUser =  async (req, res) => {
  const { id, name, type="2d", currency="USD", apiKey="" } = req.body;

  if (!name || !type || !currency || !apiKey) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findById(id);
    if (!user) throw Error('User does not exists');

    user.name = name;
    user.type = type;
    user.currency = currency;
    user.apiKey = apiKey;

    const savedUser = await user.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    res.status(200).json({
      success: true
    });

  } catch (e) {
    res.status(400).json({ 
      success: false,
      error: e.message 
    });
  }
};

export const deleteUser =  async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw Error('Something went wrong deleting the user');

    res.status(200).json({
      success: true
    });

  } catch (e) {
    res.status(400).json({ 
      success: false,
      error: e.message 
    });
  }
};

export const deleteTransaction =  async (req, res) => {
  const { id } = req.body;

  try {
    const user = await Transaction.findByIdAndDelete(id);
    if (!user) throw Error('Something went wrong deleting the transaction');

    res.status(200).json({
      success: true
    });

  } catch (e) {
    res.status(400).json({ 
      success: false,
      error: e.message 
    });
  }
};