import puppeteer, { Browser, Page } from 'puppeteer';

export interface CrawlRequest {
  websites: string[];
}

export interface CrawlResult {
  [key: string]: string | Error;
}

export class PuppeteerCrawler {
  private browser: Browser | null = null;
  private extensionPath: string;

  constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
  }

  public async init(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true, // Extensions require non-headless mode
      args: [
        `--disable-extensions-except=${this.extensionPath}`,
        `--load-extension=${this.extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Helps with shared memory issues
      ],
    });

    const pages = await this.browser.pages();
    for (const page of pages) {
      const url = page.url();
      if (this.isSignupPage(url)) {
        console.log(`Closing signup page: ${url}`);
        await page.close();
      }
    }

    this.browser.on('targetcreated', async (target) => {
      const page = await target.page();
      if (page) {
        const url = page.url();
        if (this.isSignupPage(url)) {
          console.log(`Closing new signup page: ${url}`);
          await page.close();
        }
      }
    });
  }

  private isSignupPage(url: string): boolean {
    return url.includes('signup') || url.includes('register');
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  public async crawlAndCheckLoginScreen({ websites }: CrawlRequest): Promise<CrawlResult> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const results: CrawlResult = {};

    for (const website of websites) {
      let page: Page | null = null;
      try {
        page = await this.browser.newPage();

        await page.goto(website, { waitUntil: 'domcontentloaded', timeout: 30000 });

        await delay(2000);
        const iframeExists = await this.checkIframe(page, 'isolated-iframe');
        results[website] = iframeExists ? 'Found' : 'Not Found';
      } catch (error) {
        // Ensure the error is typed as an Error
        if (error instanceof Error) {
          results[website] = error;
        } else {
          results[website] = new Error('An unknown error occurred');
        }
      } finally {
        if (page) {
          try {
            await page.close();
          } catch {
            console.warn(`Failed to close page for ${website}`);
          }
        }
      }
    }

    return results;
  }

  private async checkIframe(page: Page, iframeClass: string): Promise<boolean> {
    try {
      return await page.evaluate((className) => {
        const iframe = document.querySelector(`iframe.${className}`);
        return !!iframe;
      }, iframeClass);
    } catch {
      return false;
    }
  }
}


function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}