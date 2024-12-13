import express, { Application, Request, Response } from 'express';
import path from 'path';
import { PuppeteerCrawler } from './puppeteerCrawler';
import { fetchWebsites } from './websiteFetcher';
import { firestore } from './firebase'; // Firestore initialized via Admin SDK
import admin from 'firebase-admin'; // Explicit import for admin

const app: Application = express();

app.use(express.json());

app.post('/crawl-login-screen', async (_req: Request, res: Response): Promise<void> => {
  res.setTimeout(0); // Disable timeout for this route

  // Resolve absolute path to the extension directory
  const extensionPath = path.resolve(__dirname, 'dist');
  const crawler = new PuppeteerCrawler(extensionPath);

  try {
    const websites = await fetchWebsites();

    await crawler.init();
    const results = await crawler.crawlAndCheckLoginScreen({ websites });

    // Prepare data to store
    const resultArray = Object.entries(results).map(([website, status]) => ({
      website,
      status,
    }));

    const runData = {
      date: admin.firestore.FieldValue.serverTimestamp(), // Timestamp when the crawl was run
      results: resultArray, // Array of website statuses
    };

    // Save as a single entry in the Firestore collection
    const docRef = firestore.collection('health-check-login').doc(); // Auto-generate document ID
    await docRef.set(runData);

    res.status(200).json({
      message: 'Crawl completed and results pushed to Firestore.',
      data: runData,
    });
  } catch (error) {
    console.error('Error during crawling or Firestore operation:', error);
    res.status(500).json({ error: `Server error: ${error}` });
  } finally {
    await crawler.close();
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
