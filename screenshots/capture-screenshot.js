#!/usr/bin/env node
/**
 * Capture screenshot using Puppeteer
 * Usage: node capture-screenshot.js
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshot() {
  console.log('📸 Launching browser...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    },
  });

  try {
    const page = await browser.newPage();
    
    const htmlFile = 'file://' + path.join(__dirname, 'screenshot-template.html');
    console.log('📄 Loading:', htmlFile);
    
    await page.goto(htmlFile, {
      waitUntil: 'networkidle0',
    });
    
    // Wait a bit for any animations/fonts to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const outputPath = path.join(__dirname, 'store-screenshot.png');
    console.log('💾 Capturing screenshot...');
    
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
    });
    
    console.log('\n✅ Screenshot saved successfully!');
    console.log('📁 Location:', outputPath);
    
    // Get file size
    const fs = require('fs');
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log('📊 File size:', fileSizeInKB, 'KB');
    console.log('📐 Dimensions: 1280 x 800\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshot();
