const workflow = require('./src/workflows/sync-hours-mock-workflow');

(async () => {
    try {
        const result = await workflow.runSyncWorkflow();
        console.table(result);
    } catch (error) {
        console.error("Erro ao executar workflow:", error);
    }
})();