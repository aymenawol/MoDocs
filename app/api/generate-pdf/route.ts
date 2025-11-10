import { NextRequest, NextResponse } from "next/server"
import chromium from "@sparticuz/chromium"

// Dynamically import puppeteer based on environment
const getPuppeteer = async () => {
  if (process.env.VERCEL === "1") {
    // Use puppeteer-core on Vercel
    return (await import("puppeteer-core")).default
  } else {
    // Use regular puppeteer locally
    return (await import("puppeteer")).default
  }
}

export async function POST(request: NextRequest) {
  try {
    const { html, fileName } = await request.json()

    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 })
    }

    const puppeteer = await getPuppeteer()
    const isVercel = process.env.VERCEL === "1"

    // Launch Puppeteer browser with appropriate configuration
    const browser = await puppeteer.launch({
      args: isVercel ? [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
      ] : [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
      ],
      defaultViewport: {
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2,
      },
      executablePath: isVercel 
        ? await chromium.executablePath() 
        : undefined, // Let puppeteer find Chrome locally
      headless: true,
    })

    const page = await browser.newPage()

    try {
      // Set the HTML content and wait for everything to load
      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      })

      // Wait for external resources (Tailwind CDN, fonts) to load using network-idle instead of a fixed delay
      try {
        await page.waitForNetworkIdle({ idleTime: 1000, timeout: 10000 })
      } catch {
        // If the network never appears idle, fall back to a brief pause to avoid hanging forever
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Ensure web fonts are fully ready
      try {
        await page.evaluate(`
          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.catch(() => {});
          }
        `)
      } catch {
        // Font loading check failed, continue anyway
      }

      // Generate PDF
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "12mm",
          right: "12mm",
          bottom: "16mm",
          left: "12mm",
        },
        preferCSSPageSize: true,
      })

      // Return PDF as response with proper Buffer conversion
      return new NextResponse(Buffer.from(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName || "document"}.pdf"`,
        },
      })
    } finally {
      await browser.close()
    }
  } catch (error: any) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF", details: error.message }, { status: 500 })
  }
}
