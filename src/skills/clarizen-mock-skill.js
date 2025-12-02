const fs = require('fs').promises;
const path = require('path');

async function getProjects() {
    const dataPath = path.join(__dirname, '../../data/mock/projects.json');
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
}

module.exports = { getProjects };