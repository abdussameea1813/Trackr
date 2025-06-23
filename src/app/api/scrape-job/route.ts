import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch HTML from the job posting URL
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let company = "";
    let jobTitle = "";

    // --- Basic Scraping Logic ---
    // Note: These selectors are examples. Real-world scraping needs robust, site-specific logic.
    // For LinkedIn, you might need to inspect the page HTML source (Ctrl+U or Cmd+U)
    // and look for meta tags or specific classes that contain job title/company.
    // LinkedIn and Indeed often use dynamic content, so direct scraping can be brittle.
    // A more reliable approach for many sites involves looking at Schema.org JSON-LD data
    // within <script type="application/ld+json"> tags if available.

    // Attempt to find schema.org data (more reliable for many job sites)
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const jsonLd = JSON.parse($(el).text());
        if (jsonLd['@type'] === 'JobPosting') {
          jobTitle = jsonLd.title || jobTitle;
          company = jsonLd.hiringOrganization?.name || company;
        }
      } catch (e) {
        // Not a valid JSON-LD or not JobPosting type, ignore
      }
    });

    // Fallback/additional selectors if JSON-LD isn't sufficient or present
    if (!company) {
        // Common selectors for company name
        company = $('[data-test-id="company-name"]')?.text()?.trim() || // Common for some job boards
                  $('a[data-tracking-id="Company-Name"]')?.text()?.trim() || // LinkedIn specific?
                  $('.jobsearch-CompanyInfoContainer a')?.text()?.trim() || // Indeed specific
                  $('meta[property="og:site_name"]') ?.attr('content') || // General fallback
                  $('meta[name="twitter:site"]') ?.attr('content') || '';
    }

    if (!jobTitle) {
        // Common selectors for job title
        jobTitle = $('[data-test-id="job-title"]')?.text()?.trim() || // Common for some job boards
                   $('.jobsearch-JobInfoHeader-title')?.text()?.trim() || // Indeed specific
                   $('h1[data-tracking-id="job-title"]')?.text()?.trim() || // LinkedIn specific?
                   $('h1[class*="job-title"]')?.text()?.trim() ||
                   $('meta[property="og:title"]') ?.attr('content') || // General fallback
                   $('meta[name="twitter:title"]') ?.attr('content') ||
                   $('title')?.text()?.trim() || '';
    }

    // Clean up job title (e.g., remove company name often appended by sites)
    if (jobTitle.includes(company) && company.length > 0) {
        jobTitle = jobTitle.replace(company, '').trim();
    }
    // Remove common separators at the end of job title from meta tags or title tags
    jobTitle = jobTitle.split(/ [|-] /)[0]?.trim(); // e.g., "Job Title | Company" -> "Job Title"


    if (!company || !jobTitle) {
      return NextResponse.json({ error: "Could not extract job details. Please try a different URL or enter manually.", company, jobTitle }, { status: 400 });
    }

    return NextResponse.json({ company, jobTitle, jobUrl: url });
  } catch (error) {
    console.error("Scraping error:", error);
    // Provide a more user-friendly error message for the frontend
    return NextResponse.json({ error: "Failed to scrape job details. This might be due to website blocking, complex page structure, or an invalid URL. Please try manually entering the details.", details: error.message || "Unknown error" }, { status: 500 });
  }
}