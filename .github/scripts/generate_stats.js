// .github/scripts/generate-stats.js
const fs = require('fs');
const https = require('https');

// --- Configuration ---
const YOUR_USERNAME = 'nish941';  
const THEME = 'dark'; 
const OUTPUT_DIR = './stats/'; // Directory to save the images
// --------------------

const urls = [
  {
    name: 'github-stats.svg',
    url: `https://github-readme-stats.vercel.app/api?username=${YOUR_USERNAME}&show_icons=true&theme=${THEME}&include_all_commits=true&count_private=true`
  },
  {
    name: 'top-langs.svg',
    url: `https://github-readme-stats.vercel.app/api/top-langs/?username=${YOUR_USERNAME}&layout=compact&theme=${THEME}&langs_count=8`
  }
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

(async () => {
  console.log('Starting stats download...');
  for (const item of urls) {
    try {
      await download(item.url, OUTPUT_DIR + item.name);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  console.log('All stats downloaded successfully!');
})();
