const express = require('express');
const path = require('path');
const multer = require('multer'); // Importar Multer
const fs = require('fs');

const workflow = require('../workflows/sync-hours-mock-workflow');
const documentSkill = require('../skills/document-skill'); // Importar nova Skill

const app = express();
const PORT = 3000;

// Configuração do Upload (Salva na pasta 'uploads')
const upload = multer({ dest: 'uploads/' });

// Garantir que a pasta uploads existe
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

app.use(express.static(path.join(__dirname, 'public')));

// Rota Antiga (Workflow de Horas)
app.get('/api/run-workflow', async (req, res) => {
    try {
        const report = await workflow.runSyncWorkflow();
        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- NOVA ROTA: Upload de Arquivos ---
app.post('/api/upload-document', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "Nenhum arquivo enviado." });
    }

    try {
        // Chama a Skill de Documentos
        const result = await documentSkill.processDocument(req.file.path, req.file.mimetype);
        
        // Limpeza: Apagar o arquivo temporário após processar
        fs.unlinkSync(req.file.path);

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n>>> Dashboard rodando em: http://localhost:${PORT}`);
});