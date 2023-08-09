import Transaction from "../model/Transaction.js";
import User from "../model/User.js";
import getCountryISO3 from "country-iso-2-to-3";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TRANSXND_URL = 'https://devpg.transxnd.com/api';
const TRANSXND_ID = "payhub";
const TRANSXND_PWD = "payhub";
const TRANSXND_KEY = "78996876853450bf2808efd88f8a1d656a39f043bae25abd6c2c99f2b938b057cb1946f63693b80afba81161fa3c75ef04943a2733ca3dd85b52295caf47b9a8";

export const process_hpp = async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const data = req.body;
  console.log('data-hpp', data);

  ////////////////////////////////////////////////////////////////////////////////////
  // header = {
  //   'Content-Type': 'application/json',
  //   'x-api-key': 'fsdfsdfwe234324dsf34rdf232df342e',
  // }

  // body = {
  //   mid: "merchant1",
  //   orderId: "21312e213dsr434we232wde2we",
  //   orderDetail: "casino monerchy deposit",  
  //   amount: "231",
  //   currency: "USD",
  //   redirectUrl: 'https://merchant.com/user-management',
  //   callbackUrl: 'https://merchant.com/backend/api/payment/callback_paymenthub',
  // }
  ////////////////////////////////////////////////////////////////////////////////////

  try {
    const merchant = await User.findOne({name: data.mid, apiKey, status: 'activated'});
    if (!merchant) {
      return res.status(400).json({
        message: "There is not existing activated merchant with API key"
      })
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${TRANSXND_KEY}`,
      },
    };

    const trxId = uuidv4();
    const refId = uuidv4();
    const paybody = {
      client_id: TRANSXND_ID,
      client_pwd: TRANSXND_PWD,
      orderId: trxId,
      amount: data.amount,
      description: data.orderDetail,
      idempotence_key: refId,
      currency: data.currency
    }

    await axios
    .post(
      TRANSXND_URL + '/makePayment',
      paybody,
      config
    )
    .then(async (resp) => {
      console.log(resp.data);
      if (resp.data.status === "SUCCESS") {
        const newTransaction = await Transaction.create({
          merchantId: data.mid,
          amount: data.amount,
          currency: data.currency,
          transactionId: trxId,
          transactionType: 'hpp',
          orderId: data.orderId,
          orderDetail: data.orderDetail,
          status: 'pending',
          paymentMethod: 'Transxnd',
          redirectUrl: data.redirectUrl,
          callbackUrl: data.callbackUrl,
          session: resp.data.response.session,
          hash: resp.data.response.hash
        }); 
        res.status(200).json({
          status: "success",
          paymentUrl: resp.data.response.paymentUrl
        });
      } else {
        res.status(400).json({
          status: "fail",
          message: "Request failed"
        });
      }      
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json({
        status: "fail",
        message: "Request failed"
      });
    });

  } catch (e) {
    res.status(404).json({ 
      status: "fail",
      message: e.message 
    });
  }
};

export const process_2d = async (req, res) => {
};

export const process_3d = async (req, res) => {
};

export const callback_transxnd_hpp = async (req, res) => {
  console.log('---callback_transxnd_hpp---');
	console.log(req.query);
	const data = req.query;
	const txId = data.orderId;
	try {
		const transaction = await Transaction.findOne({
			transactionId: txId,
		});
		if (!transaction || transaction.status !== 'pending') {
			res.redirect(transaction.redirectUrl);
		}
		
		let status = 'pending';
		const merchant = await User.findOne({
			name: transaction.merchantId,
		});
		if (!merchant) {
			res.redirect(transaction.redirectUrl);
		}
    if (data['hash'] !== transaction.hash || data['status'] !== 'success' || !data['transaction_id']) {
      status = "cancelled";
    } else {
      status = "approved";
    }
    transaction.status = status;
    transaction.response = JSON.stringify(data);
    transaction.statusDate = new Date();
    await transaction.save();

    if (status === "approved") {
      await axios
      .post(
        transaction.callbackUrl,
        {
          orderId: transaction.orderId,
          status: "success",
          transactionID: transaction.transactionId,
          amount: transaction.amount,
          currency: transaction.currency,
          message: "This transaction has been completed."
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )
      .then(async (resp) => {
        console.log(resp.data);
      })
      .catch((e) => {
        console.log(e);
      });
      res.redirect(transaction.redirectUrl);
    } else {
      await axios
      .post(
        transaction.callbackUrl,
        {
          orderId: transaction.orderId,
          status: "fail",
          message: "An error occured. Transaction failed or not founds."
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )
      .then(async (resp) => {
        console.log(resp.data);
      })
      .catch((e) => {
        console.log(e);
      });
      res.redirect(transaction.redirectUrl);
    }
  } catch (e) {
    console.log('callback_transxnd_hpp_error', e.message);
    return res.send(
      "<html><body><p>Transaction Failed.</p></body></html>"
    );
  }
};

export const callback_mps = async (req, res) => {
};