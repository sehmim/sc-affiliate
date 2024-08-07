import { onRequest } from 'firebase-functions/v2/https';
import handleCorsMiddleware from '../corsMiddleware';
import { db } from '../index';


export const collectAndSendBrowserInfo = onRequest(async (req, res) => {
  return handleCorsMiddleware(req, res, async () => {
    console.log("collectAndSendBrowserInfo function started");

    try {
      const { userAgent, platform, appVersion, extensionVersion } = req.body;

      if (!userAgent || !platform || !appVersion || !extensionVersion) {
        return res.status(400).send("userAgent, platform, appVersion, and extensionVersion are required.");
      }

      const browserInfo = {
        userAgent,
        platform,
        appVersion,
        extensionVersion,
        type: 'collectAndSendBrowserInfo'
      };

      console.log("Saving browser info:", browserInfo);
      await db.collection("collectAndSendBrowserInfo").add(browserInfo);

      return res.status(200).send("Browser info added successfully.");
    } catch (error: any) {
      console.error("Error in collectAndSendBrowserInfo:", error);
      return res.status(500).json({ error: "Failed to save browser info", details: error.message });
    }
  });
});