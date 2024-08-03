import { onRequest } from "firebase-functions/v2/https";
import handleCorsMiddleware from "../corsMiddleware";
import { db } from '../index';
import * as mandrill from 'mandrill-api/mandrill';


const mandrillClient = new mandrill.Mandrill('md-1P__LTE1pBx7CQJUxjBMlA');

async function sendEmail(to: string, subject: string, message: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const email = {
      to: [{ email: to }],
      from_email: 'info@sponsorcircle.com',
      subject: subject,
      text: message
    };

    mandrillClient.messages.send({ message: email }, (result: any) => {
      console.log('Email sent successfully:', result);
      resolve();
    }, (error: any) => {
      console.error('Mandrill error:', error);
      reject(error);
    });
  });
}

async function saveVerificationCodeToFirestore(code: string, email: string): Promise<void> {
  try {
    await db.collection('verificationCodes').add({
      code: code,
      email: email
    });
    console.log('Verification code saved successfully!');
  } catch (error) {
    console.error('Error saving verification code:', error);
    throw new Error('Failed to save verification code.');
  }
}

export const sendVerificationCode = onRequest(async (req, res) => {
    handleCorsMiddleware(req, res, async () => {
        const email = req.query.email;

        if (!email) {
            res.status(400).send('No Email Found In the query param');
            return;
        }

        // TODO: CHECK IF CODE EXISTS 
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const mailOptions = {
          from: "info@sponsorcircle.com",
          to: email as string,
          subject: "Your one time Verification Code",
          message: `Your one time verification code is ${verificationCode}`,
        };

        try {
            await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.message);
            await saveVerificationCodeToFirestore(verificationCode, email as string);
            res.status(200).send('Verification code sent');
        } catch (error) {
            res.status(500).send((error as any).toString());
        }
    });
});

export const verifyVerificationCode = onRequest(async (req: any, res: any) => {
  handleCorsMiddleware(req, res, async () => {
    const email = req.query.email;
    const code = req.query.code;

    if (!email || !code) {
      return res.status(400).send("Email and code are required");
    }

    try {
      const querySnapshot = await db.collection('verificationCodes')
        .where('email', '==', email)
        .where('code', '==', code)
        .get();


      if (querySnapshot.empty) {
            res.status(404).send({
              message: 'Email or Code not found.',
            });
            return
      } 

      res.status(200).send(true);

    } catch (error) {
      console.error("Error verifying code:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});