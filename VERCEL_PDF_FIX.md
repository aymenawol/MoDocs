# PDF Download Fix for Vercel Deployment

## Changes Made

### 1. Updated Dependencies
Added Vercel-compatible Chromium packages to `package.json`:
- `puppeteer-core@23.10.4` - Lightweight Puppeteer for serverless
- `@sparticuz/chromium@141.0.0` - Optimized Chrome binary for Vercel

### 2. Modified PDF Generation API
Updated `app/api/generate-pdf/route.ts` to:
- Dynamically import puppeteer based on environment (puppeteer-core on Vercel, regular puppeteer locally)
- Use `@sparticuz/chromium` executable path on Vercel
- Handle both local development and production environments

### 3. Added Vercel Configuration
Created `vercel.json` with optimized settings for the PDF generation function:
- Memory: 1024 MB (required for Chrome)
- Max Duration: 30 seconds (allows time for PDF generation)

## Deployment Steps

### Option 1: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and deploy

### Option 3: Deploy via Git Integration
If already connected to Vercel:
```bash
git add .
git commit -m "Fix PDF download for Vercel deployment"
git push origin main
```
Vercel will automatically deploy the changes.

## Testing on Vercel

After deployment:
1. Go to your deployed site
2. Navigate to MoDocs → Create
3. Fill out a document form
4. Click "Generate"
5. Click "Download PDF"
6. PDF should download successfully

## Troubleshooting

### If PDF download still fails:
1. Check Vercel function logs:
   - Go to your project in Vercel Dashboard
   - Click "Functions" tab
   - Look for `/api/generate-pdf` errors

2. Common issues:
   - **Memory limit**: Increase memory in `vercel.json` to 3008 MB (max)
   - **Timeout**: Increase maxDuration to 60 seconds
   - **Cold starts**: First PDF generation may be slower

### Local Testing
The PDF generation should work locally with regular Puppeteer. If you see Chrome-related errors locally:
- Make sure Chrome is installed on your system
- The code will automatically use your local Chrome installation

## Environment Detection

The code automatically detects if running on Vercel by checking:
```typescript
process.env.VERCEL === "1"
```

On Vercel: Uses puppeteer-core + @sparticuz/chromium
Locally: Uses regular puppeteer with system Chrome

## Performance Notes

- First PDF generation on Vercel may take 5-10 seconds (cold start)
- Subsequent generations within ~5 minutes will be faster (warm function)
- The function will automatically scale if multiple users generate PDFs simultaneously
