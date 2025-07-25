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
["484", "2002-01"],
["485", "2002-02"],
["486", "2002-03"],
["487", "2002-04"],
["488", "2002-05"],
["489", "2002-06"],
["490", "2002-07"],
["491", "2002-08"],
["492", "2002-09"],
["493", "2002-10"],
["494", "2002-11"],
["495", "2002-12"],
["496", "2003-01"],
["497", "2003-02"],
["498", "2003-03"],
["499", "2003-04"],
["500", "2003-05"],
["501", "2003-06"],
["502", "2003-07"],
["503", "2003-08"],
["504", "2003-09"],
["505", "2003-10"],
["506", "2003-11"],
["507", "2003-12"],
["508", "2004-01"],
["509", "2004-02"],
["510", "2004-03"],
["511", "2004-04"],
["512", "2004-05"],
["513", "2004-06"],
["514", "2004-07"],
["515", "2004-08"],
["516", "2004-09"],
["517", "2004-10"],
["518", "2004-11"],
["519", "2004-12"],
["520", "2005-01"],
["521", "2005-02"],
["522", "2005-03"],
["523", "2005-04"],
["524", "2005-05"],
["525", "2005-06"],
["526", "2005-07"],
["527", "2005-08"],
["528", "2005-09"],
["529", "2005-10"],
["530", "2005-11"],
["531", "2005-12"],
["532", "2006-01"],
["533", "2006-02"],
["534", "2006-03"],
["535", "2006-04"],
["536", "2006-05"],
["537", "2006-06"],
["538", "2006-07"],
["539", "2006-08"],
];

const urlVariable = "-27-a"

const BASE_URL = "https://dorotheemagazine.fr/_media/img/xlarge";
const SAVE_BASE = './magazines';

if (!fs.existsSync(SAVE_BASE)) {
  fs.mkdirSync(SAVE_BASE);
}

function pad(num, size) {
  return num.toString().padStart(size, '0');
  // return num.toString();
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
    const l = ['a', 'b', 'c', 'd', 'e', 'f'];
    const n = [2, 3, 2, 3];

    console.log(`\n📕 Downloading Issue ${issueNumber} (${dateStr})...`);

    for (let page = 2; page <= 5; page++) {
      // const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}.jpg`;
      // const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}-copie.jpg`;
      // const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}30${l[page]}-${n[page]}.jpg`;
      // const imageUrl = `${BASE_URL}/${year}-${month}-dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}24{l[page]}-2.jpg`;
      // const imageUrl = `${BASE_URL}/${pad(issueNumber, 3)}-${pad(page, 2)}.jpg`;
      // const newURL = `${pad(issueNumber, 3)}-${page > 5 ? 31 : 27}-a-${page > 5 ? 34 : 30}-${page > 5 ? (page - 4) : page}`;
      const newURL = `${pad(issueNumber, 3)}-35-a-38-${page}`;
      // const newURL = `${pad(issueNumber, 3)}-${pad(page, 2)}`
      const imageUrl = `${BASE_URL}/${newURL}.jpg`;
      const outputPath = path.join(issueFolder, `${newURL}.jpg`);
      // const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}.jpg`);
      // const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}${pad(page, 2)}-copie.jpg`);
      // const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}30${l[page]}-${n[page]}.jpg`);
      // const outputPath = path.join(issueFolder, `dorothee-magazine-n${pad(issueNumber, 3)}${urlVariable}24${l[page]}-2.jpg`);
      // const outputPath = path.join(issueFolder, `${pad(issueNumber, 3)}-${pad(page, 2)}.jpg`);
      await downloadImage(imageUrl, outputPath);
    }
  }

  console.log('\n🎉 Done downloading all issues!');
})();
