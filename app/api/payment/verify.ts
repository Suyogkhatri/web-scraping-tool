// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { token, amount, productIdentity } = req.body;

//     // Use Khalti's secret key here. Make sure this is stored securely and not exposed to the client.
//     const secretKey = process.env.KHALTI_SECRET_KEY;
    
//     // Perform the verification
//     const response = await fetch('https://khalti.com/api/v2/payment/verify/', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Key ${secretKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         token,
//         amount,
//         product_identity: productIdentity,
//       }),
//     });

//     const data = await response.json();

//     if (response.status === 200) {
//       // Payment verification was successful
//       // You might want to update the order status in your database here
//       res.status(200).json({ success: true, data: data });
//     } else {
//       // Payment verification failed
//       res.status(500).json({ success: false, message: data.detail });
//     }
//   } else {
//     // If the request is not a POST request, return method not allowed
//     res.status(405).end('Method Not Allowed');
//   }
// }