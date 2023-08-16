import Transaction from "../model/Transaction.js";
import User from "../model/User.js";
import getCountryISO3 from "country-iso-2-to-3";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SERVER_URL = 'https://paymenthub.uk/api';

// live
const TRANSXND_URL = 'https://pay.transxnd.com/api';
const TRANSXND_ID = "Payhub";
const TRANSXND_PWD = "Payhub";
const TRANSXND_KEY = "91e03e8147911f8d9a380af0065529a64bc40218c526c0c372e4c2c7a209f3d99630b316c244fbf5388a86aae160a64cbc3e0db13348a96c203dfb1ce2ce7edf";

// sandbox
// const TRANSXND_URL = 'https://devpg.transxnd.com/api';
// const TRANSXND_ID = "payhub";
// const TRANSXND_PWD = "payhub";
// const TRANSXND_KEY = "78996876853450bf2808efd88f8a1d656a39f043bae25abd6c2c99f2b938b057cb1946f63693b80afba81161fa3c75ef04943a2733ca3dd85b52295caf47b9a8";

// PRODUCTION
// "client_id": "Payhub",
// "key": "91e03e8147911f8d9a380af0065529a64bc40218c526c0c372e4c2c7a209f3d99630b316c244fbf5388a86aae160a64cbc3e0db13348a96c203dfb1ce2ce7edf"

// SANDBOX
// "client_id": "payhub",
// "key": "78996876853450bf2808efd88f8a1d656a39f043bae25abd6c2c99f2b938b057cb1946f63693b80afba81161fa3c75ef04943a2733ca3dd85b52295caf47b9a8" 

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
      description: "Trans_Pay", // data.orderDetail,
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
      console.log('transxnd-pay-res', resp.data);
      if (resp.data.status === "SUCCESS") {
        const newTransaction = await Transaction.create({
          merchantId: data.mid,
          amount: data.amount,
          currency: data.currency,
          transactionId: trxId,
          transactionType: 'HPP',
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
          paymentUrl: resp.data.response.paymentUrl,
          session: resp.data.response.session,
          hash: resp.data.response.hash
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

//////////////// MPS ////////////////////////
const MPS_URL = 'https://processing.merchantpayservices.com/api/v1.1';
// APM
const MPS_KEY = '645aa724d2c5a';
const MPS_SECRET = '9c9e6a6b671dc77aedd9006064e72829';
// APM2
const MPS_KEY2 = '64b96bea2e6bd';
const MPS_SECRET2 = '89b59d5ca29be2e764273a978c8d3ec9';
/////////////////////////////////////////////

export const process_2d = async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const data = req.body;
  console.log('data-2d', data);

  try {
    const merchant = await User.findOne({name: data.mid, apiKey, status: 'activated'});
    if (!merchant) {
      return res.status(200).json({
        error: "There is not existing activated merchant with API key"
      })
    }

    let mps_key = "";
    let mps_secret = "";
    if (merchant.type === "2D (APM)") {
      mps_key = MPS_KEY;
      mps_secret = MPS_SECRET;
    } else if (merchant.type === "2D (APM2)") {
      mps_key = MPS_KEY2;
      mps_secret = MPS_SECRET2;
    } else {
      return res.status(200).json({
        error: "This merchant is not allowed 2D transactions"
      });
    }

    const config = {
      headers: {
        'Authorization': `${mps_key}:${mps_secret}`,
        'Content-Type': 'application/json'
      },
    };

    const trxId = uuidv4();
    const paybody = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      mobile: data.phone,
      billing_address1: data.address,
      billing_address2: "",
      billing_city: data.city,
      billing_state: data.state,
      billing_country: data.country,
      billing_zip: data.zipCode,
      order_id: trxId,
      order_description: data.orderDetail,
      description: data.orderDetail,
      customer_ip: data.clientIp,
      amount: data.amount,
      card_no: data.cardNumber,
      card_cvv: data.cardCVV,
      expiry_month: data.cardExpMonth,
      expiry_year: data.cardExpYear,
      endpoint: SERVER_URL + '/payment/callbackMps'
    };

    const newTransaction = await Transaction.create({
      merchantId: data.mid,
      transactionId: trxId,
      transactionType: merchant.type,
      paymentMethod: 'MPS',
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.firstName + ' ' + data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
      clientIp: data.clientIp,
      amount: data.amount,
      currency: data.currency,
      orderId: data.orderId,
      orderDetail: data.orderDetail,
      cardType: data.cardType,
      cardNumber: data.cardNumber,
      cardCVV: data.cardCVV,
      cardExpMonth: data.cardExpMonth,
      cardExpYear: data.cardExpYear,
      redirectUrl: data.redirectUrl,
      callbackUrl: data.callbackUrl,
      status: 'pending',

    }); 

    await axios
    .post(
      MPS_URL + '/payment_api/card',
      paybody,
      config
    )
    .then(async (resp) => {
      console.log('mps-pay-res', resp.data);

      // if (resp.data.message) {
      //   newTransaction.status = "declined";
      //   newTransaction.response = JSON.stringify(resp.data);
      //   newTransaction.statusDate = new Date();
      //   newTransaction.paymentId = resp.transaction_id?resp.transaction_id:'';
      //   await newTransaction.save();
      //   return res.status(200).json({error: resp.data.message});
      // }

      if (resp.data.error) {
        newTransaction.status = "error";
        newTransaction.response = JSON.stringify(resp.data);
        newTransaction.statusDate = new Date();
        newTransaction.paymentId = resp.data.transaction_id?resp.data.transaction_id:'';
        await newTransaction.save();
        return res.status(200).json({error: resp.data.error});
      }

      let status = "";
      if (resp.data.status === "success") {
        status = "approved";
      } else if (resp.data.status === "fail"){
        status = "declined";
      }
      newTransaction.status = status;
      newTransaction.response = JSON.stringify(resp.data);
      newTransaction.statusDate = new Date();
      newTransaction.paymentId = resp.data.transaction_id?resp.data.transaction_id:'';
      await newTransaction.save();
    
      let payload = {};
      if (status === "approved") {
        payload = {
          orderId: newTransaction.orderId,
          status: "approved",
          transactionId: newTransaction.transactionId,
          amount: newTransaction.amount,
          currency: newTransaction.currency,
          message: "This transaction has been approved."
        };
      } else {
        payload = {
          orderId: newTransaction.orderId,
          status: "declined",
          message: "Transaction has been declined. " + resp.data.message
        };
      }

      res.status(200).json(payload);   
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

export const process_3d = async (req, res) => {
};

export const callback_transxnd_hpp = async (req, res) => {
  console.log('---callback_transxnd_hpp---');
	console.log('req.query', req.query);
	const data = req.query;
	const txId = data.orderId;
	try {
		const transaction = await Transaction.findOne({
			transactionId: txId,
		});
		if (!transaction || transaction.status !== 'pending') {
			return res.redirect(transaction.redirectUrl);
		}
		
		let status = 'pending';
		const merchant = await User.findOne({
			name: transaction.merchantId,
		});

		if (!merchant) {
			return res.redirect(transaction.redirectUrl);
		}

    if (data['status'] === 'cancelled') {
        status = "cancelled"
    } else {
      if (data['hash'] !== transaction.hash || !data['transaction_id'] || data['status'] === 'failed')
        status = "error";
      else if (data['status'] === 'success')
        status = "approved";
      else if (data['status'] === 'previously_completed') {
        return res.redirect(transaction.redirectUrl);
      }
    }
    transaction.status = status;
    transaction.response = JSON.stringify(data);
    transaction.statusDate = new Date();
    transaction.paymentId = data['transaction_id'];
    await transaction.save();
    
    let payload = {};
    if (status === "approved") {
      payload = {
        orderId: transaction.orderId,
        status: "success",
        hash: transaction.hash,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        message: "This transaction has been completed."
      };
    } else {
      payload = {
        orderId: transaction.orderId,
        status: "fail",
        message: "An error occured. Transaction failed or not founds."
      };
    }

    await axios
    .post(
      transaction.callbackUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )
    .then(async (resp) => {
      console.log('callback-trnsxnd-hpp-callback-to-mechant-resp', resp.data);
    })
    .catch((e) => {
      console.log('callback-trnsxnd-hpp-callback-to-mechant-resp-error', e.message);
    });
    return res.redirect(transaction.redirectUrl);
    
  } catch (e) {
    console.log('callback_transxnd_hpp_error', e.message);
    return res.send(
      "<html><body><p>Transaction Failed.</p></body></html>"
    );
  }
};

export const callback_mps = async (req, res) => {
  console.log('---callback_mps---');
	console.log(req.body);
	const data = req.body;
	const txId = data.order_id;
	try {
		const transaction = await Transaction.findOne({
			transactionId: txId,
		});
		if (!transaction || transaction.status !== 'pending') {
			return res.status(200).json({success: false, message: 'There is no transaction to process.'});  
		}
		
		let status = 'pending';
		const merchant = await User.findOne({
			name: transaction.merchantId,
		});

		if (!merchant) {
			return res.status(200).json({success: false, message: 'There is no customer with this transaction.'});  
		}

    if (data.status = 'success') {
      status = "approved";
    } else {
      status = "declined";
    }
    transaction.status = status;
    transaction.response = JSON.stringify(data);
    transaction.statusDate = new Date();
    transaction.paymentId = data.trans_id;
    await transaction.save();
    
    let payload = {};
    if (status === "approved") {
      payload = {
        orderId: transaction.orderId,
        status: "approved",
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        message: "This transaction has been approved."
      };
    } else {
      payload = {
        orderId: transaction.orderId,
        status: "declined",
        message: "Transaction has been declined."
      };
    }

    if (transaction.callbackUrl) {
      await axios
      .post(
        transaction.callbackUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )
      .then(async (resp) => {
        console.log('callback-mps-callback-to-mechant-resp', resp.data);
        if (resp.status !== 200) {
          console.log('Should resend the callback to ', transaction.callbackUrl, payload);
        }
      })
      .catch((e) => {
        console.log('callback-mps-callback-to-mechant-resp-error', e.message);
      });
    }    
    
    res.status(200).json({success: true, message: 'Transaction has been processed.'});  
    
  } catch (e) {
    console.log('callback_mps_error', e.message);
    return res.status(500).json({success: false, message: 'Processing transaction failed.'});  
  }
};

export const fetch_status = async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const data = req.body;
  console.log('fetch-status', data);

  try {
    const merchant = await User.findOne({name: data.mid, apiKey, status: 'activated'});
    if (!merchant) {
      return res.status(200).json({
        success: false,
        message: "There is not existing activated merchant with API key"
      })
    }

    const transaction = await Transaction.findOne({
			transactionId: data.transactionId,
      merchantId: data.mid,
      orderId: data.orderId,
		});

		if (!transaction) {
			return res.status(200).json({
        success: false,
        message: "There is not existing activated merchant with API key"
      })
		}
		
    return res.status(200).json({
      success: true,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      time: new Date(),
    })

  } catch (e) {
    console.log('fetch-status-error', e.message)
    res.status(400).json({ 
      success: false,
      message: "Bad request" 
    });
  }
};
