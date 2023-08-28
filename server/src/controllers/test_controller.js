import axios from 'axios';

export const test_3d = async (req, res) => {
    
  const res3d = await axios.post('http://localhost:5001/api/payment/3d', {
    "mid": "merchant1",
    "firstName": "Test",
    "lastName": "User",
    "email": "merchant1@paymenthub.com",
    "phone": "+37126345934",
    "address": "Test address",
    "city": "London",
    "state": "London",
    "country": "GBR",
    "zipCode": "1234567",
    "amount": "1",
    "currency": "USD",
    "cardType": "VISA",
    "cardName": "Test User",
    "cardNumber": "2223000000000007",
    "cardCVV": "123",
    "cardExpYear": "23",
    "cardExpMonth": "12",
    "orderId": "LV07ER4RRKC4",
    "orderDetail": "Test payment",
    "clientIp": "35.195.77.158",
    "redirectUrl": "https://test.wml.finance",
    "callbackUrl": "https://test.wml.finance/balancer/notifications/finance/BLD"
  }, {
    headers: {
      'x-api-key': '0701050dde1b146e99fb3705fef896bb217b6c40cc87b5ea8f670d26d7d91c52',
      'Content-Type': 'application/json'
    }
  }).then(response => response.data);

  if (res3d.status === "verify") {
    res.render('test_3d_verify.ejs', {
      content: res3d.redirect.html
    })
    return;
  }

  res.json(res3d);
}