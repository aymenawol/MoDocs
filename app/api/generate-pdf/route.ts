import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(request: NextRequest) {
  try {
    const { html, fileName } = await request.json()

    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 })
    }

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
      ],
    })

    const page = await browser.newPage()

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    })

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
      await page.evaluate(() => {
        const fonts = (document as any).fonts
        if (fonts?.ready) {
          return fonts.ready.catch(() => undefined)
        }
        return undefined
      })

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
