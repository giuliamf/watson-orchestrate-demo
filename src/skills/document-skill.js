const fs = require('fs');
const pdf = require('pdf-parse');
const csv = require('csv-parser');

async function processDocument(filePath, mimeType) {
    console.log(`>>> Processando arquivo: ${filePath} (${mimeType})`);

    // Estratégia para PDF
    if (mimeType === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        // Retorna um resumo do texto encontrado
        return {
            type: 'PDF',
            pageCount: data.numpages,
            preview: data.text.substring(0, 200) + "..." // Pega os primeiros 200 caracteres
        };
    } 
    
    // Estratégia para CSV
    else if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve({
                        type: 'CSV',
                        rowCount: results.length,
                        data: results.slice(0, 3) // Retorna as 3 primeiras linhas como amostra
                    });
                })
                .on('error', (err) => reject(err));
        });
    }

    throw new Error("Formato de arquivo não suportado pela Skill.");
}

module.exports = { processDocument };