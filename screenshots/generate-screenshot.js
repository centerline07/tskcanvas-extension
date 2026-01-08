#!/usr/bin/env node
/**
 * Generate Chrome Web Store screenshot
 * Usage: node generate-screenshot.js
 */

const fs = require('fs');
const path = require('path');

// Simple solution: Use Chrome's headless mode directly
const { execSync } = require('child_process');

const htmlFile = path.join(__dirname, 'screenshot-template.html');
const outputFile = path.join(__dirname, 'store-screenshot.png');

console.log('📸 Generating Chrome Web Store screenshot...\n');
console.log('Using: screenshot-template.html');
console.log('Output: store-screenshot.png');
console.log('Dimensions: 1280 x 800\n');

// Check if Chrome is installed
const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'google-chrome',
  'chromium'
];

let chromePath = null;
for (const path of chromePaths) {
  try {
    if (path.startsWith('/')) {
      if (fs.existsSync(path)) {
        chromePath = path;
        break;
      }
    } else {
      execSync(`which ${path}`, { stdio: 'ignore' });
      chromePath = path;
      break;
    }
  } catch (e) {
    // Continue checking
  }
}

if (!chromePath) {
  console.error('❌ Chrome/Chromium not found!');
  console.log('\n💡 Alternative: Open screenshot-template.html in Chrome manually');
  console.log('   Then use DevTools to capture a 1280x800 screenshot\n');
  process.exit(1);
}

try {
  // Use Chrome headless to capture screenshot
  execSync(
    `"${chromePath}" --headless --disable-gpu --screenshot="${outputFile}" ` +
    `--window-size=1280,800 --force-device-scale-factor=1 ` +
    `--hide-scrollbars --default-background-color=0 ` +
    `"file://${htmlFile}"`,
    { stdio: 'inherit' }
  );

  console.log('\n✅ Screenshot generated successfully!');
  console.log(`📁 Saved to: ${outputFile}`);
  
  // Check file size
  const stats = fs.statSync(outputFile);
  const fileSizeInKB = stats.size / 1024;
  console.log(`📊 File size: ${fileSizeInKB.toFixed(2)} KB`);
  
  if (stats.size === 0) {
    console.log('\n⚠️  Warning: Screenshot file is empty. Try manual method instead.');
  }

} catch (error) {
  console.error('\n❌ Error generating screenshot:', error.message);
  console.log('\n💡 Alternative: Open screenshot-template.html in Chrome manually');
  console.log('   1. Open: ' + htmlFile);
  console.log('   2. Open DevTools (Cmd+Opt+I)');
  console.log('   3. Toggle device toolbar (Cmd+Shift+M)');
  console.log('   4. Set to 1280x800');
  console.log('   5. Cmd+Shift+P → "Capture screenshot"\n');
  process.exit(1);
}
