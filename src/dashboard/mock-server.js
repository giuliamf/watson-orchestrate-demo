const express = require('express');
const path = require('path');
const workflow = require('../workflows/sync-hours-mock-workflow');

const app = express();
const PORT = 3000;

// Servir arquivos estáticos (o site)
app.use(express.static(path.join(__dirname, 'public')));

// API para rodar o workflow
app.get('/api/run-workflow', async (req, res) => {
    try {
        const report = await workflow.runSyncWorkflow();
        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n>>> Dashboard rodando em: http://localhost:${PORT}`);
    console.log(`>>> Pressione Ctrl+C para parar.`);
});