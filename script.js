const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Month mapping to French
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Your provided list
const issues = [
["344", "1996-04-23"],
];

const urlVariable = "-60-64-"

const BASE_URL = "https://dorotheemagazine.fr/_media/img/xlarge";
const SAVE_BASE = './magazines';

if (!fs.existsSync(SAVE_BASE)) {
  fs.mkdirSync(SAVE_BASE);
}

function pad(num, size) {
  // return num.toString().padStart(size, '0');
  return num.toString();
}

function getFrenchFolderName(issueNumber, dateStr) {
  const [year, month, day] = dateStr.split('-');
  const monthName = MONTHS_FR[parseInt(month, 10) - 1];
  return `${issueNumber} - ${day ? `${day} ` : ''}${monthName} ${year}`;
}

async function downloadImage(url, outputPath) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    console.log(`✅ Saved: ${url}`);
  } catch (err) {
    console.error(`❌ Failed: ${url} - ${err.message}`);
  }
}

(async () => {
  for (const [issueNumber, dateStr] of issues) {
    const folderName = getFrenchFolderName(issueNumber, dateStr);
    const issueFolder = path.join(SAVE_BASE, folderName);

    if (!fs.existsSync(issueFolder)) {
      fs.mkdirSync(issueFolder);
    }

    const [year, month] = dateStr.split('-');
    const l = ['a', 'a', 'b', 'b'];
    const n = [2, 3, 2, 3];

    console.log(`\n📕 Downloading Issue ${issueNumber} (${dateStr})...`);

    for (let page = 1; page <= 9; page++) {
      const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}.jpg`;
      // const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}-copie.jpg`;
      // const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}30${l[page]}-${n[page]}.jpg`;
      // const imageUrl = `${BASE_URL}/${pad(issueNumber, 3)}-${pad(page, 2)}.jpg`;
      const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}.jpg`);
      // const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}-copie.jpg`);
      // const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}30${l[page]}-${n[page]}.jpg`);
      // const outputPath = path.join(issueFolder, `${pad(issueNumber, 3)}-${pad(page, 2)}.jpg`);
      await downloadImage(imageUrl, outputPath);
    }
  }

  console.log('\n🎉 Done downloading all issues!');
})();
