const certponto = require('../skills/certponto-mock-skill');
const clarizen = require('../skills/clarizen-mock-skill');

async function runSyncWorkflow() {
    console.log(">>> Iniciando Workflow de Sincronização Watson Orchestrate (Mock)...");

    // 1. Buscar dados
    const timesheets = await certponto.getTimesheets();
    const projects = await clarizen.getProjects();

    console.log(`>>> Dados obtidos: ${timesheets.length} registros de horas e ${projects.length} projetos.`);

    // 2. Processar: Calcular horas totais por projeto
    const report = projects.map(project => {
        const projectHours = timesheets
            .filter(t => t.projectId === project.id)
            .reduce((sum, t) => sum + t.hours, 0);
        
        return {
            projectId: project.id,
            projectName: project.name,
            totalHours: projectHours,
            status: projectHours > 0 ? "Sincronizado" : "Pendente"
        };
    });

    console.log(">>> Sincronização concluída.");
    return report;
}

module.exports = { runSyncWorkflow };