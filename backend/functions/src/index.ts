import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { parseString } from "xml2js";
import { handleCorsMiddleware } from "./corsMiddleware";
import * as mandrill from 'mandrill-api/mandrill';

//Initialize Firebase and get Firestore instance
admin.initializeApp();

const mandrillClient = new mandrill.Mandrill('md-1P__LTE1pBx7CQJUxjBMlA');

export async function sendEmail(to: string, subject: string, message: string): Promise<void> {
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

export async function saveVerificationCodeToFirestore(code: string, email: string): Promise<void> {
  try {
    const db = admin.firestore();

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

export const verifyVerificationCode = onRequest(async (req: any, res: any) => {

  handleCorsMiddleware(req, res, async () => {
    const email = req.query.email;
    const code = req.query.code;

    if (!email || !code) {
      return res.status(400).send("Email and code are required");
    }

    try {
      const db = admin.firestore();
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

// NOT IN USE
export const addInstalledExtension = onRequest(async (req: any, res: any) => {
  handleCorsMiddleware(req, res, async () => {
    const extensionId = req.query.extensionId;
    const db = admin.firestore();

    if (!extensionId) {
      return res.status(400).send("extensionId is required in query params");
    }

    try {
      // Check if extensionId already exists
      const existingExtensionSnapshot = await db.collection('installedExtensions')
        .where('extensionId', '==', extensionId)
        .limit(1)
        .get();

      if (!existingExtensionSnapshot.empty) {
        // ExtensionId already exists, do not add again
        return res.status(400).send("ExtensionId already exists in the database");
      }

      const newEntry = {
        extensionId,
      };

      await db.collection('installedExtensions').add(newEntry);

      res.status(200).send('Extension added successfully');
    } catch (error) {
      console.error("Error adding extension:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});

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

export const createUser = onRequest((req, res) => {
    handleCorsMiddleware(req, res, async () => {
        try {
            const db = admin.firestore();
            const { email, firstName, lastName } = req.body;

            if (!email) {
                res.status(400).send('Email is required.');
                return;
            }

            // Check if user with the given email already exists
            const userQuery = db.collection('users').where('email', '==', email);
            const snapshot = await userQuery.get();

            if (!snapshot.empty) {
                res.status(200).send('User already exists.');
                return;
            }

            // Create the user if they do not exist
            const userRef = await db.collection('users').add({
                firstName: firstName || "",
                lastName: lastName || "",
                email: email,
            });

            res.status(201).send({ id: userRef.id, message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user: ', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

export const getUser = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const { email } = req.query;

      // Basic validation
      if (!email) {
        res.status(400).send('Email is required.');
        return;
      }

      // Query the user document by email
      const db = admin.firestore();
      const userRef = db.collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      if (snapshot.empty) {
        res.status(404).send('User not found.');
        return;
      }

      // Send the user data (assuming only one user per email)
      const userData = snapshot.docs[0].data();
      res.status(200).send(userData);
    } catch (error) {
      console.error('Error fetching user data: ', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

export const updateUser = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const { email, updates } = req.body;

      // Basic validation
      if (!email || !updates) {
        res.status(400).send('Email and updates are required.');
        return;
      }

      // Query the user document by email
      const db = admin.firestore();
      const userRef = db.collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      if (snapshot.empty) {
        res.status(404).send('User not found.');
        return;
      }

      // Update the user document (assuming only one user per email)
      const userId = snapshot.docs[0].id;
      await db.collection('users').doc(userId).update(updates);

      res.status(200).send('User updated successfully.');
    } catch (error) {
      console.error('Error updating user data: ', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

export const getCampaigns = onRequest(async (request, response) => {
    handleCorsMiddleware(request, response, () => {
        response.send(CAMPAIGNS);
    });
});

export const allowedDomains = onRequest(async (request, response) => {
    handleCorsMiddleware(request, response, () => {
        const domains: any = {};
        
        CAMPAIGNS.map((campaign) => {
            domains[campaign.advertiserURL] = campaign.campaignID;
        })
    
        response.send(domains);
    });
});

export const loginUser = onRequest(async (req, res) => {
  // Use CORS middleware
  handleCorsMiddleware(req, res, async () => {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const userCredential = await admin.auth().getUserByEmail(email);

      const user = userCredential as admin.auth.UserRecord;
      const response: LoginResponseSuccess = {
        message: "Login successful",
        uid: user.uid,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error("Error logging in:", error);
      let errorMessage = "Login failed";
      if (
        (error as any).code === "auth/user-not-found" ||
        (error as any).code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password";
      }
      const response: LoginResponseError = { error: errorMessage };
      res.status(400).json(response);
    }
  });
});

export const getAllGroups = onRequest(async (req: any, res: any) => {
  try {
    // Use CORS middleware
    handleCorsMiddleware(req, res, async () => {
      const snapshot = await admin.firestore().collection("groups").get();
      const groups: any = [];
      snapshot.forEach((doc) => {
        groups.push(doc.data());
      });
      res.status(200).json(groups);
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const getDefaultCharities = onRequest(async (req, res) => {
  try {
    // Use CORS middleware
    handleCorsMiddleware(req, res, async () => {
      const db = admin.firestore();
      const defaultCharitiesRef = db.collection("defaultCharities");

      const snapshot = await defaultCharitiesRef.get();
      const defaultCharities = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      res.status(200).json(defaultCharities);
    });
  } catch (error) {
    console.error("Error fetching default charities:", error);
    res.status(500).json({ error: "Failed to fetch default charities" });
  }
});

export const applyTrackingLink = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const teamName = req.query.teamName;
      const programId = req.query.programId;
      const email = req.query.email;


      if (!teamName || !programId) {
        return res.status(400).send("teamName and programId query parameters are required.");
      }

      // Retrieve data from Firestore collection 'trackingLinks'
      const snapshot = await admin
        .firestore()
        .collection("trackingLinks")
        .where("teamName", "==", teamName)
        .where("programId", "==", programId)
        .get();

      // If a document matching the provided teamName and programId is found, return the data
      if (!snapshot.empty) {
        const responseData = snapshot.docs[0].data();
        return res.status(200).json(responseData.trackingLink);
      }

      // If no matching document is found, generate a new trackingLink
      const responseData = await generateLink(programId as string, teamName as string, email as string);
      
      // Save the new trackingLink and teamName to Firestore
      await admin.firestore().collection("trackingLinks").add({
        teamName,
        programId,
        linkInitiallyGeneratedBy: email,
        appliedDate: new Date(),
        trackingLink: responseData.TrackingURL,
      });

      // Return the generated trackingLink
      return res.status(200).json(responseData.TrackingURL);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error making POST request");
    }
  });
});


export const fetchCampaignsData = onRequest(async (req, res) => {
  try {
    const base64Auth = Buffer.from(
      `IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1:kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y`
    ).toString("base64");

    const response = await fetch(
      `https://api.impact.com/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml", // Specify XML content type
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the XML response and convert it to JSON
    const xmlData = await response.text();
    parseString(xmlData, (err: any, result: any) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Error parsing XML");
      } else {
        const campaigns =
          result.ImpactRadiusResponse.Campaigns[0].Campaign.reverse();
        res.status(200).json(campaigns);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});


export const generateTrackingLink = onRequest(async (req, res) => {
  try {
    const base64Auth = Buffer.from(
      `IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1:kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y`
    ).toString("base64");

    // Extract programId and subId1 from the query parameters
    const programId = req.query.programId;
    const subId1 = req.query.teamName;
    const subId2 = req.query.email;

    // Construct the URL with the injected programId and subId1
    const url = `https://api.impact.com/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Programs/${programId}/TrackingLinks?Type=vanity&subId1=${subId1}&subId2=${subId2}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // You can pass any data in the body if needed
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error making POST request:", error);
    res.status(500).send("Error making POST request");
  }
});

async function generateLink(programId: string, teamName: string, email: string) {
  try {
    const base64Auth = Buffer.from(
      `IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1:kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y`
    ).toString("base64");

    const url = `https://api.impact.com/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Programs/${programId}/TrackingLinks?Type=vanity&subId1=${teamName}&subId2=${email}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // You can pass any data in the body if needed
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error making POST request:", error);
  }
}


interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponseSuccess {
  message: string;
  uid: string;
}

interface LoginResponseError {
  error: string;
}

const CAMPAIGNS = [
  {
    "advertiserID": 419062,
    "advertiserName": "adidas Australia",
    "advertiserURL": "https://www.adidas.com.au",
    "advertiserCategory": "Sports Apparel & Accessories",
    "campaignID": 7362,
    "campaignName": "adidas Australia",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/7362.gif",
    "activeDate": "Mar 4, 2024 16:46",
    "insertionOrderName": "New Public IO 5%",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://adidas-australia.pxf.io/c/4797259/408139/7362",
    "allowsDeepLinking": true,
    "payout": "You earn 5% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 45 day(s) after the end of the month",
    "discountPercentage": 5,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://adidas-australia.pxf.io"],
  },
  {
    "advertiserID": 2583300,
    "advertiserName": "Anthology Brands",
    "advertiserURL": "https://anthologybrands.com",
    "advertiserCategory": "First Aid & pharmacy",
    "campaignID": 12752,
    "campaignName": "Pure Hemp Botanicals",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12752.gif",
    "activeDate": "Apr 9, 2024 15:35",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://pure-hemp-botanical.pxf.io/c/4797259/954928/12752",
    "allowsDeepLinking": true,
    "payout": "You earn 60% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 90 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 1 month(s) and 1 day(s) after the end of the month",
    "discountPercentage": 60,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://purehempbotanicals.com"]
  },
  {
    "advertiserID": 1719590,
    "advertiserName": "Decathlon Canada",
    "advertiserURL": "https://www.decathlon.ca",
    "advertiserCategory": "Sports Apparel & Accessories",
    "campaignID": 10224,
    "campaignName": "Decathlon Canada",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/10224.gif",
    "activeDate": "Sep 19, 2023 16:48",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://decathlon-canada.mkr3.net/c/4797259/642729/10224",
    "allowsDeepLinking": true,
    "payout": "You earn 8% of Net Sales Amount\nYou earn 8% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action\nReferrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 2 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 2 month(s) and 0 day(s) after the end of the month",
    "discountPercentage": 8,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 1912000,
    "advertiserName": "Easyship",
    "advertiserURL": "https://www.easyship.com/",
    "advertiserCategory": "B2B",
    "campaignID": 10435,
    "campaignName": "Easyship Ambassador Program",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/10435.gif",
    "activeDate": "Sep 14, 2023 21:58",
    "insertionOrderName": "Easyship Standard",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://easyship.ilbqy6.net/c/4797259/666308/10435",
    "allowsDeepLinking": true,
    "payout": "Company Created > You earn $0.00 (Flat Fee per lead)\nYou earn 2.5% of Net Sales Amount\nYou earn 100% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in the same day are locked 0 day(s) later\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
    "discountPercentage": 2.5,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 1398261,
    "advertiserName": "Fanatics",
    "advertiserURL": "https://www.fanatics.com",
    "advertiserCategory": "Sports Apparel & Accessories",
    "campaignID": 9663,
    "campaignName": "Fanatics (Global)",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/9663.gif",
    "activeDate": "Sep 18, 2023 10:13",
    "insertionOrderName": "Affinity 6%",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://fanatics.93n6tx.net/c/4797259/586570/9663",
    "allowsDeepLinking": true,
    "payout": "You earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
    "discountPercentage": 6,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 1217827,
    "advertiserName": "IMPACT",
    "advertiserURL": "https://www.impact.com",
    "advertiserCategory": "B2B",
    "campaignID": 10925,
    "campaignName": "Impact.com Referral Partner Program",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/10925.gif",
    "activeDate": "Nov 28, 2023 16:34",
    "insertionOrderName": "12% Preferred Partner Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://impact-referral-partnerships.sjv.io/c/4797259/749356/10925",
    "allowsDeepLinking": true,
    "payout": "You earn 12% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 180 day(s) of the action",
    "actionLocking": "Actions are locked 15 day(s) after they are approved by advertiser. If actions are not locked after 13 month(s), they are rejected.",
    "discountPercentage": 12,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://go.impact.com"]
  },
  {
    "advertiserID": 2588106,
    "advertiserName": "International Open Academy",
    "advertiserURL": "https://internationalopenacademy.com",
    "advertiserCategory": "Winter",
    "campaignID": 16668,
    "campaignName": "Eventtrix",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/16668.gif",
    "activeDate": "Apr 23, 2024 14:44",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Expired",
    "trackingLink": "https://eventtrix.pxf.io/c/4797259/1398875/16668",
    "allowsDeepLinking": true,
    "payout": "You earn 30% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 20 day(s) after the end of the month",
    "discountPercentage": 30,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://eventtrix.com"]
  },
  {
    "advertiserID": 2463760,
    "advertiserName": "InVideo",
    "advertiserURL": "https://www.invideo.io",
    "advertiserCategory": "Images",
    "campaignID": 12258,
    "campaignName": "InVideo",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12258.gif",
    "activeDate": "Apr 10, 2024 12:00",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://invideo.sjv.io/c/4797259/883681/12258",
    "allowsDeepLinking": true,
    "payout": "Sign-up > You earn $0.00 (Flat Fee per lead)\nYou earn 25% of Net Sales Amount\nYou earn 50% of Net Sales Amount\ninVideo AI - Sign-up > You earn $0.00 (Flat Fee per lead)\nYou earn 25% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 120 day(s) of the action\nReferrals are only considered for credit if they occur within 120 day(s) of the action\nReferrals are only considered for credit if they occur within 30 day(s) of the action\nReferrals are only considered for credit if they occur within 120 day(s) of the action\nReferrals are only considered for credit if they occur within 120 day(s) of the action",
    "actionLocking": "All actions happening in the same day are locked 30 day(s) later\nAll actions happening in the same day are locked 30 day(s) later\nAll actions happening in the same day are locked 27 day(s) later\nAll actions happening in the same day are locked 27 day(s) later\nAll actions happening in the same day are locked 27 day(s) later",
    "discountPercentage": 25,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 3017626,
    "advertiserName": "LivWell Nutrition",
    "advertiserURL": "https://livwellnutrition.com",
    "advertiserCategory": "Diet & Nutrition",
    "campaignID": 14558,
    "campaignName": "LivWell Nutrition",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/14558.gif",
    "activeDate": "Apr 9, 2024 15:45",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://livwellnutrition.pxf.io/c/4797259/1151622/14558",
    "allowsDeepLinking": true,
    "payout": "You earn 12% of Net Sales Amount",
    "performanceBonus": "If monthly sales reach $10,000.00, payout rate will be 15% for subsequent action sales",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 12,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 4253690,
    "advertiserName": "Lumiere Affiliate marketing",
    "advertiserURL": "https://lumierehairs.com",
    "advertiserCategory": "Women's Apparel",
    "campaignID": 19594,
    "campaignName": "Lumiere Affiliate marketing",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/19594.gif",
    "activeDate": "Apr 9, 2024 15:43",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://lumiereaffiliatemarketing.sjv.io/c/4797259/1688218/19594",
    "allowsDeepLinking": true,
    "payout": "You earn 10% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 10,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 1274595,
    "advertiserName": "Mark's - Lequipeur",
    "advertiserURL": "https://www.marks.com",
    "advertiserCategory": "Women's Apparel",
    "campaignID": 8679,
    "campaignName": "Mark's",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/8679.gif",
    "activeDate": "Sep 19, 2023 11:45",
    "insertionOrderName": "Mark's - 4% Baseline Commission Offer",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://marks.r37x9j.net/c/4797259/505590/8679",
    "allowsDeepLinking": true,
    "payout": "You earn 4% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 1 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 2 month(s) and 10 day(s) after the end of the month",
    "discountPercentage": 4,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 48706,
    "advertiserName": "Moosejaw.com",
    "advertiserURL": "https://www.moosejaw.com/",
    "advertiserCategory": "Sports Apparel & Accessories",
    "campaignID": 1676,
    "campaignName": "Moosejaw.com",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/1676.gif",
    "activeDate": "Sep 18, 2023 15:47",
    "insertionOrderName": "Public IO",
    "insertionOrderStatus": "Expired",
    "trackingLink": "https://moosejaw.pvxt.net/c/4797259/185854/1676",
    "allowsDeepLinking": true,
    "payout": "You earn 6% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 15 day(s) of the action",
    "actionLocking": "All actions happening in the same day are locked 30 day(s) later",
    "discountPercentage": 6,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 3274582,
    "advertiserName": "Packed with Purpose",
    "advertiserURL": "https://packedwithpurpose.gifts",
    "advertiserCategory": "B2B",
    "campaignID": 15751,
    "campaignName": "Packed with Purpose",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/15751.gif",
    "activeDate": "Apr 9, 2024 15:44",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://packedwithpurpose.pxf.io/c/4797259/1283558/15751",
    "allowsDeepLinking": true,
    "payout": "B2B Closed Won Deal > You earn $4.00 (Flat Fee per sale)\nYou earn 8% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action\nReferrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month\nAll actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 8,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 2551659,
    "advertiserName": "Peakstar Technologies Inc.",
    "advertiserURL": "https://atlasvpn.com",
    "advertiserCategory": "",
    "campaignID": 12618,
    "campaignName": "Atlas VPN",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12618.gif",
    "activeDate": "Apr 9, 2024 15:35",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Expired",
    "trackingLink": "https://atlasvpn.sjv.io/c/4797259/928109/12618",
    "allowsDeepLinking": false,
    "payout": "You earn 60% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
    "discountPercentage": 60,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 2642689,
    "advertiserName": "Pro Hockey Life",
    "advertiserURL": "https://www.prohockeylife.com/",
    "advertiserCategory": "Sports Apparel & Accessories",
    "campaignID": 12925,
    "campaignName": "Pro Hockey Life",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12925.gif",
    "activeDate": "Sep 18, 2023 10:34",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://prohockeylife.pxf.io/c/4797259/979143/12925",
    "allowsDeepLinking": true,
    "payout": "You earn 4% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 5 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 3 month(s) and 0 day(s) after the end of the month",
    "discountPercentage": 4,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 3930596,
    "advertiserName": "Springfree Limited Partnership",
    "advertiserURL": "https://www.springfreetrampoline.com",
    "advertiserCategory": "Outdoors & Recreation",
    "campaignID": 20835,
    "campaignName": "Springfree Trampoline - CA",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/20835.gif",
    "activeDate": "Sep 20, 2023 13:28",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://springfree-trampolineca.pxf.io/c/4797259/1769243/20835",
    "allowsDeepLinking": true,
    "payout": "You earn 7% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 7,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  // Dublicating cocoandeve to support .ca
  {
    "advertiserID": 3663611,
    "advertiserName": "Supernova Pte Ltd Canada",
    "advertiserURL": "https://www.ca.cocoandeve.com",
    "advertiserCategory": "Cosmetics & Skin Care",
    "campaignID": 17345,
    "campaignName": "Coco&Eve",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/17345.gif",
    "activeDate": "Apr 9, 2024 15:51",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://coco-and-eve.sjv.io/c/4797259/1467633/17345",
    "allowsDeepLinking": true,
    "payout": "You earn 2% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 2,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://us.cocoandeve.com", "https://cocoandeve.com"]
  },
  {
    "advertiserID": 3705465,
    "advertiserName": "Supernova Pte Ltd - SS Canada",
    "advertiserURL": "https://www.ca.sandandsky.com",
    "advertiserCategory": "Cosmetics & Skin Care",
    "campaignID": 17524,
    "campaignName": "Sand&Sky",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/17524.gif",
    "activeDate": "Apr 9, 2024 15:51",
    "insertionOrderName": "Public Terms 2%",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://sand-and-sky.sjv.io/c/4797259/1485463/17524",
    "allowsDeepLinking": true,
    "payout": "You earn 2% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 2,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://sandandsky.com"]
  },
  {
    "advertiserID": 3938277,
    "advertiserName": "The Curiosity Box",
    "advertiserURL": "https://www.curiositybox.com/",
    "advertiserCategory": "Learning",
    "campaignID": 18310,
    "campaignName": "The Curiosity Box",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/18310.gif",
    "activeDate": "Apr 9, 2024 15:45",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://the-curiosity-box.pxf.io/c/4797259/1575826/18310",
    "allowsDeepLinking": true,
    "payout": "You earn 20% of Net Sales Amount",
    "performanceBonus": "If number of monthly actions reaches 2,147,483,647, payout rate will be 0% for subsequent actions",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
    "discountPercentage": 20,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  {
    "advertiserID": 4819836,
    "advertiserName": "VAVA INTERNATIONAL INC.",
    "advertiserURL": "https://www.ravpower.com",
    "advertiserCategory": "Food & Drink",
    "campaignID": 21553,
    "campaignName": "ParisRhone",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/21553.gif",
    "activeDate": "Apr 9, 2024 15:46",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://parisrhonecom.sjv.io/c/4797259/1811170/21553",
    "allowsDeepLinking": true,
    "payout": "You earn 8% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
    "discountPercentage": 8,
    "discountType": "Net Sales Amount",
    "subDomains": ["https://parisrhone.com"]
  },
  {
    "advertiserID": 2495728,
    "advertiserName": "Wish",
    "advertiserURL": "https://wish.com",
    "advertiserCategory": "Handmade Goods",
    "campaignID": 12396,
    "campaignName": "Wish",
    "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12396.gif",
    "activeDate": "Jan 4, 2024 04:39",
    "insertionOrderName": "Public Terms",
    "insertionOrderStatus": "Active",
    "trackingLink": "https://wish.pxf.io/c/4797259/899103/12396",
    "allowsDeepLinking": true,
    "payout": "You earn 6% of Net Sales Amount",
    "performanceBonus": "N/a",
    "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
    "actionLocking": "All actions happening in a given month are locked 2 month(s) and 15 day(s) after the end of the month",
    "discountPercentage": 6,
    "discountType": "Net Sales Amount",
    "subDomains": []
  },
  // COUPONED WEBSITES: 
  {
    "discountPercentage": 20,
    "advertiserName": 'lacoutts.com',
    "campaignLogoURI": 'https://i.imgur.com/FOe5vMf.png',
    "advertiserURL": 'https://lacoutts.com',
    "subDomains": [],
    "discountType": "Coupon",
    "trackingLink": "https://lacoutts.com?sc-coupon=activated&couponCode=LaCouttsSC20&discountPercentage=20",
    "couponCode": "LaCouttsSC20",
  },
  {
    "discountPercentage": 10,
    "advertiserName": 'softstrokessilk.com',
    "campaignLogoURI": '',
    "advertiserURL": 'https://www.softstrokessilk.com',
    "subDomains": [],
    "discountType": "Coupon",
    "trackingLink": "https://softstrokessilk.com?sc-coupon=activated&couponCode=LOVESILK&discountPercentage=10",
    "couponCode": "LOVESILK",
  }
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 4704,
  //   "campaignName": "United Airlines MileagePlus - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4704.gif",
  //   "activeDate": "Apr 9, 2024 15:48",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://united.elfm.net/c/4797259/302886/4704",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://buymiles.mileageplus.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 4705,
  //   "campaignName": "Southwest Airlines Rapid Rewards - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4705.gif",
  //   "activeDate": "Mar 4, 2024 16:45",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://swa.eyjo.net/c/4797259/302888/4705",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://www.southwest.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 4707,
  //   "campaignName": "Alaska Airlines Mileage Plan - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4707.gif",
  //   "activeDate": "Apr 9, 2024 15:48",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://alaska.gqco.net/c/4797259/302892/4707",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://storefront.points.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Accommodations",
  //   "campaignID": 4797,
  //   "campaignName": "IHG Rewards Club - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4797.gif",
  //   "activeDate": "Mar 4, 2024 16:45",
  //   "insertionOrderName": "Public Term",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://ihg.hmxg.net/c/4797259/310617/4797",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://storefront.points.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Accommodations",
  //   "campaignID": 4823,
  //   "campaignName": "Hilton Honors Rewards - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4823.gif",
  //   "activeDate": "Mar 4, 2024 16:46",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://hilton.ijrn.net/c/4797259/314255/4823",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://www.hilton.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Accommodations",
  //   "campaignID": 4882,
  //   "campaignName": "World of Hyatt - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4882.gif",
  //   "activeDate": "Apr 9, 2024 15:48",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://hyatt.jewn.net/c/4797259/319067/4882",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://storefront.points.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 4883,
  //   "campaignName": "JetBlue TrueBlue - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4883.gif",
  //   "activeDate": "Apr 9, 2024 15:51",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://jetblue.jyeh.net/c/4797259/319069/4883",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://www.jetblue.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 4885,
  //   "campaignName": "Choice Privileges - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4885.gif",
  //   "activeDate": "Apr 9, 2024 15:48",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://choice.mtko.net/c/4797259/319073/4885",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 15 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://storefront.points.com"] 
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 4926,
  //   "campaignName": "Air France KLM Flying Blue - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4926.gif",
  //   "activeDate": "Apr 9, 2024 15:48",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://afklm.tcux.net/c/4797259/321349/4926",
  //   "allowsDeepLinking": false,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://www.flyingblue.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Accommodations",
  //   "campaignID": 4937,
  //   "campaignName": "Marriott Bonvoy - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4937.gif",
  //   "activeDate": "Mar 4, 2024 16:45",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://marriott.pxf.io/c/4797259/321373/4937",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://buy.points.com"]
  // },
  // {
  //   "advertiserID": 298281,
  //   "advertiserName": "Points",
  //   "advertiserURL": "http://www.points.com",
  //   "advertiserCategory": "Transportation",
  //   "campaignID": 5123,
  //   "campaignName": "Copa Airlines ConnectMiles - Points.com",
  //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/5123.gif",
  //   "activeDate": "Apr 9, 2024 15:50",
  //   "insertionOrderName": "Public Terms",
  //   "insertionOrderStatus": "Active",
  //   "trackingLink": "https://copa.sjv.io/c/4797259/343960/5123",
  //   "allowsDeepLinking": true,
  //   "payout": "You earn 2.5% of Net Sales Amount",
  //   "performanceBonus": "N/a",
  //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 15 day(s) of the action",
  //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
  //   "discountPercentage": 2.5,
  //   "discountType": "Net Sales Amount",
  //   "subDomains": ["https://storefront.points.com/"]
  // },
]
