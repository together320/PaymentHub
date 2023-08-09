import Product from "../model/Product.js";
import ProductStat from "../model/ProductStat.js";
import Transaction from "../model/Transaction.js";
import Refund from "../model/Refund.js";
import User from "../model/User.js";
import getCountryISO3 from "country-iso-2-to-3";

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productWithStats);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const fetchMerchants = async (req, res) => {
  try {
    const merchants = await User.find({ role: "merchant" }).select("-password");

    res.status(200).json(merchants);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const fetchTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = "[]", search = "" } = req.query;
    console.log('fetch transactions req', req.query);

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      let sortParsed = JSON.parse(sort);
      console.log('sortParsed', sortParsed);

      if (sortParsed.length > 0)
        sortParsed = sortParsed[0];
      else
        sortParsed = {};
      
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort === "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};
    console.log('sort format for trxn', sortFormatted);

    const transactions = await Transaction.find({
      $or: [
        { status: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const fetchRefunds = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = "[]", search = "" } = req.query;
    console.log('fetch refunds req', req.query);

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      let sortParsed = JSON.parse(sort);
      console.log('sortParsed', sortParsed);

      if (sortParsed.length > 0)
        sortParsed = sortParsed[0];
      else
        sortParsed = {};
      
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort === "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};
    console.log('sort format for trxn', sortFormatted);

    const refunds = await Refund.find({
      $or: [
        { status: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Refund.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      refunds,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const fetchGeography = async (req, res) => {
  try {
    const user = await User.find();
    const mapedLocations = user.reduce((acc, { country }) => {
      const countryISO3 = getCountryISO3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mapedLocations).map(
      ([country, count]) => {
        return {   
          id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (e) {
    res.status(404).json({ message: error.message });
  }
};
