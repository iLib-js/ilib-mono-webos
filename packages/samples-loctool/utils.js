//utils.js

const fs = require('fs');

const isValidPath = (filepath) => {
    return filepath ? fs.existsSync(filepath) : false;
}

const loadData = (filepath) => {
    try {
        const readData = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(readData);
    } catch (error) {
        console.error(`Error reading or parsing file: ${error.message}`);
        return null;
    }
}

module.exports = { isValidPath, loadData };