document.addEventListener('DOMContentLoaded', () => {
  const projects = [
    { id: 1, name: 'Itau', owner: 'Felipe Akahoshi', status: 'in_progress', start: '2025-06-01', end: '', tags: ['Cloud', 'Migration', 'Azure'],
      proposalType: 'Fixed Price', budget: 450000,
      requirements: 'Migração completa para Azure com zero downtime.',
      stakeholders: 'CTO Itau, Gerente de Infra',
      metrics: 'Uptime 99.99%, Redução de custo 15%',
      logs: [
        { date: '2025-01-10T10:00:00', user: 'Felipe Akahoshi', action: 'Projeto criado' },
        { date: '2025-02-15T14:30:00', user: 'System', action: 'Status alterado para in_progress' }
      ],
      professionals: [
        { name: 'Felipe Akahoshi', role: 'Lead Architect', seniority: 'Senior', hoursPlanned: 200, hoursActual: 150 },
        { name: 'Giulia Moura', role: 'UX Designer', seniority: 'Intern', hoursPlanned: 80, hoursActual: 20 },
        { name: 'Bruno Silva', role: 'Cloud Engineer', seniority: 'Mid', hoursPlanned: 160, hoursActual: 155 }
      ]
    },
    { id: 2, name: 'Casas Bahia', owner: 'Giulia Moura', status: 'completed', start: '2025-02-10', end: '2025-06-30', tags: ['Data', 'Analytics', 'Retail'],
      proposalType: 'Time & Materials', budget: 320000,
      logs: [
        { date: '2024-12-01T09:00:00', user: 'Giulia Moura', action: 'Projeto iniciado' },
        { date: '2025-06-30T18:00:00', user: 'System', action: 'Projeto concluído' }
      ],
      professionals: [
        { name: 'Giulia Moura', role: 'Product Designer', seniority: 'Junior' },
        { name: 'Ana Costa', role: 'Data Engineer', seniority: 'Senior' },
        { name: 'Carlos Souza', role: 'Scrum Master', seniority: 'Mid' }
      ]
    },
    { id: 3, name: 'Bradesco', owner: 'Bruno Silva', status: 'in_progress', start: '2025-07-15', end: '', tags: ['AI', 'Banking', 'Chatbot'],
      proposalType: 'Fixed Price', budget: 280000,
      professionals: [
        { name: 'Bruno Silva', role: 'AI Engineer', seniority: 'Mid' },
        { name: 'Marina Rocha', role: 'Data Scientist', seniority: 'Senior' },
        { name: 'Pedro Alves', role: 'Security Specialist', seniority: 'Senior' }
      ]
    },
    { id: 4, name: 'Prodesp', owner: 'Ana Costa', status: 'completed', start: '2024-11-01', end: '2025-03-20', tags: ['Infra', 'Modernization', 'DevOps'],
      proposalType: 'Time & Materials', budget: 510000,
      professionals: [
        { name: 'Ana Costa', role: 'DevOps Lead', seniority: 'Senior' },
        { name: 'Carlos Souza', role: 'SRE', seniority: 'Mid' },
        { name: 'Laura Lima', role: 'Business Analyst', seniority: 'Mid' }
      ]
    },
    { id: 5, name: 'Bradesco Seguros', owner: 'Carlos Souza', status: 'in_progress', start: '2025-08-05', end: '', tags: ['Resilience', 'Cloud', 'Retail'],
      proposalType: 'Fixed Price', budget: 390000,
      professionals: [
        { name: 'Carlos Souza', role: 'Resilience Engineer', seniority: 'Mid' },
        { name: 'Felipe Akahoshi', role: 'Solution Architect', seniority: 'Senior' }
      ]
    },
    { id: 6, name: 'Santander', owner: 'Marina Rocha', status: 'completed', start: '2024-09-12', end: '2025-01-29', tags: ['Healthcare', 'Data', 'Cloud'],
      proposalType: 'Time & Materials', budget: 610000,
      professionals: [
        { name: 'Marina Rocha', role: 'Data Architect', seniority: 'Senior' },
        { name: 'Bruno Silva', role: 'ML Engineer', seniority: 'Mid' }
      ]
    },
    { id: 7, name: 'Kyndryl', owner: 'Pedro Alves', status: 'in_progress', start: '2025-09-01', end: '', tags: ['Security', 'Audit'],
      proposalType: 'Fixed Price', budget: 150000,
      professionals: [
        { name: 'Pedro Alves', role: 'Security Auditor', seniority: 'Senior' },
        { name: 'Ana Costa', role: 'DevOps', seniority: 'Senior' }
      ]
    },
    { id: 8, name: 'ROKS US', owner: 'Laura Lima', status: 'completed', start: '2025-03-05', end: '2025-07-12', tags: ['Dashboard', 'Analytics', 'Natural Resources'],
      proposalType: 'Time & Materials', budget: 210000,
      professionals: [
        { name: 'Laura Lima', role: 'BA', seniority: 'Mid' },
        { name: 'Giulia Moura', role: 'UX Designer', seniority: 'Junior' }
      ]
    }
  ];

  const tbody = document.getElementById('projects-tbody');
  const metricTotal = document.getElementById('metric-total');
  const metricInProgress = document.getElementById('metric-inprogress');
  const metricCompleted = document.getElementById('metric-completed');
  const searchInput = document.getElementById('project-search');
  const statusButtons = document.querySelectorAll('.status-btn');

  let currentStatus = 'all';
  let currentSearch = '';

  // Restore persisted filters/search
  const savedStatus = localStorage.getItem('projects.filterStatus');
  const savedSearch = localStorage.getItem('projects.searchQuery');
  if (savedStatus) currentStatus = savedStatus;
  if (savedSearch) {
    currentSearch = savedSearch;
    searchInput.value = savedSearch;
  }

  function renderMetrics(list) {
    metricTotal.textContent = list.length;
    metricInProgress.textContent = list.filter(p => p.status === 'in_progress').length;
    metricCompleted.textContent = list.filter(p => p.status === 'completed').length;
  }

  function renderTable(list) {
    tbody.innerHTML = '';
    list.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="#" class="project-link" data-id="${p.id}">${p.name}</a></td>
        <td>${p.owner}</td>
        <td><span class="status-badge ${p.status}">${formatStatus(p.status)}</span></td>
        <td>${p.start || '-'}</td>
        <td>${p.end || '-'}</td>
        <td>${p.tags.join(', ')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function formatStatus(s) {
    if (s === 'in_progress') return 'Em Andamento';
    if (s === 'completed') return 'Concluído';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function formatBanda(seniority) {
    const map = {
      'Junior': 'Banda 6',
      'Mid': 'Banda 7',
      'Senior': 'Banda 8',
      'Intern': 'Banda 6'
    };
    return map[seniority] || seniority;
  }

  function applyFilters() {
    let list = [...projects];
    if (currentStatus !== 'all') {
      list = list.filter(p => p.status === currentStatus);
    }
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.tags.join(' ').toLowerCase().includes(q) ||
        (p.professionals && p.professionals.some(prof => prof.name.toLowerCase().includes(q)))
      );
    }
    renderMetrics(list);
    renderTable(list);
  }

  // Wire up controls
  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStatus = btn.dataset.status;
      statusButtons.forEach(b => b.classList.toggle('active', b === btn));
      localStorage.setItem('projects.filterStatus', currentStatus);
      applyFilters();
    });
  });

  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value;
    localStorage.setItem('projects.searchQuery', currentSearch);
    applyFilters();
  });

  // Initial render
  statusButtons.forEach(b => b.classList.toggle('active', b.dataset.status === currentStatus));
  applyFilters();

  // Details modal interactions
  const detailModal = document.getElementById('project-detail-modal');
  const closeBtn = detailModal.querySelector('.close-btn');
  let currentProject = null;

  tbody.addEventListener('click', (e) => {
    const link = e.target.closest('.project-link');
    if (!link) return;
    e.preventDefault();
    const id = Number(link.dataset.id);
    const project = projects.find(p => p.id === id);
    if (project) showProjectDetails(project);
  });

  closeBtn.addEventListener('click', () => {
    detailModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.style.display = 'none';
    }
  });

  function formatCurrencyBRL(value) {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    } catch {
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
  }

  function showProjectDetails(p) {
    const project = p; // Alias p to project for consistency
    // Header
    document.getElementById('project-detail-name').textContent = p.name;
    // Overview fields
    document.getElementById('project-detail-owner').textContent = p.owner;
    document.getElementById('project-detail-status').textContent = formatStatus(p.status);
    document.getElementById('project-detail-proposal').textContent = p.proposalType || '-';
    document.getElementById('project-detail-budget').textContent =
      p.budget != null ? formatCurrencyBRL(p.budget) : '-';
    const dateText = `${p.start || '-'} → ${p.end || '-'}`;
    document.getElementById('project-detail-dates').textContent = dateText;
    document.getElementById('project-detail-tags').textContent = p.tags.join(', ');

    // New Fields
    document.getElementById('project-detail-requirements').textContent = p.requirements || '-';
    document.getElementById('project-detail-stakeholders').textContent = p.stakeholders || '-';
    document.getElementById('project-detail-metrics').textContent = p.metrics || '-';

    // Status chip next to title for visibility
    const statusChip = document.getElementById('project-detail-status-chip');
    if (statusChip) {
      statusChip.textContent = formatStatus(p.status);
      statusChip.className = `project-status-chip ${p.status}`;
    }

    // Professionals table
    const tbodyProf = document.getElementById('project-detail-professionals');
    tbodyProf.innerHTML = '';
    (p.professionals || []).forEach(person => {
      // Mock hours if not present
      const planned = person.hoursPlanned || 160;
      const actual = person.hoursActual || Math.floor(Math.random() * 100);
      const percentage = Math.min((actual / planned) * 100, 100);
      
      let statusClass = '';
      if (percentage > 90) statusClass = 'danger';
      else if (percentage > 75) statusClass = 'warning';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${person.name}</td>
        <td>${person.role}</td>
        <td>${formatBanda(person.seniority)}</td>
        <td class="hours-cell">
            <div class="hours-bar-container">
                <div class="hours-bar-fill ${statusClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="hours-text">${actual}/${planned}h (${Math.round(percentage)}%)</div>
        </td>
      `;
      tbodyProf.appendChild(tr);
    });

    // Logs Section
    // Logs
    const logsContainer = document.getElementById('project-detail-logs');
    logsContainer.innerHTML = '';
    
    if (project.logs && project.logs.length > 0) {
        // Sort logs by date desc
        const sortedLogs = [...project.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedLogs.forEach(log => {
            const logEl = document.createElement('div');
            logEl.className = 'log-entry';
            
            let iconClass = 'system';
            let icon = 'fas fa-info';
            
            if (log.type === 'activity') {
                iconClass = 'activity';
                icon = 'fas fa-clock';
            } else if (log.user && log.user !== 'System') {
                iconClass = 'user';
                icon = 'fas fa-user';
            }

            let detailsHtml = '';
            if (log.details) {
                detailsHtml = `
                    <div class="log-details">
                        ${log.details.tasks ? `<div class="log-detail-row"><span class="log-label">Tarefas:</span> <span>${log.details.tasks}</span></div>` : ''}
                        ${log.details.time ? `<div class="log-detail-row"><span class="log-label">Duração:</span> <span>${log.details.time}</span></div>` : ''}
                        ${log.details.obs ? `<div class="log-detail-row"><span class="log-label">Obs:</span> <span>${log.details.obs}</span></div>` : ''}
                    </div>
                `;
            }
            
            logEl.innerHTML = `
                <div class="log-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="log-content">
                    <div class="log-header">
                        <div class="log-author">
                            ${log.user} 
                            ${log.role ? `<span class="log-author-role">(${log.role})</span>` : ''}
                        </div>
                        <div class="log-date">${new Date(log.date).toLocaleString()}</div>
                    </div>
                    <div class="log-body">${log.action}</div>
                    ${detailsHtml}
                </div>
            `;
            logsContainer.appendChild(logEl);
        });
    } else {
        logsContainer.innerHTML = '<p class="empty-logs">Nenhum registro encontrado.</p>';
    }

    detailModal.style.display = 'flex';
    
    // Set current project ID for activity log
    document.getElementById('activity-log-modal').dataset.projectId = project.id;

    // Initialize chat bound to this project
    currentProject = p;
    initProjectChat();

    // Populate Excel area with a download link when applicable
    renderExcelForProject(p);
  }

  // Activity Log Modal
  const activityModal = document.getElementById('activity-log-modal');
    const activityBtn = document.getElementById('add-activity-btn');
    const closeActivityBtn = document.getElementById('close-activity-log');
    const cancelActivityBtn = document.getElementById('cancel-activity-log');
    const activityForm = document.getElementById('activity-log-form');

    if (activityBtn) {
        activityBtn.addEventListener('click', () => {
            const projectId = activityModal.dataset.projectId;
            const project = projects.find(p => p.id === projectId);
            
            if (project) {
                const select = document.getElementById('al-professional');
                select.innerHTML = '<option value="">Selecione...</option>';
                
                project.professionals.forEach(p => {
                    const option = document.createElement('option');
                    option.value = p.name;
                    option.textContent = `${p.name} - ${p.role}`;
                    option.dataset.role = p.role;
                    option.dataset.seniority = p.seniority;
                    select.appendChild(option);
                });
                
                // Set default date to today
                document.getElementById('al-date').valueAsDate = new Date();
                
                activityModal.style.display = 'flex';
            }
        });
    }
    
    // --- New Project Modal Logic ---
    const newProjectBtn = document.getElementById('new-project-btn');
    const newProjectModal = document.getElementById('new-project-modal');
    const closeNewProjectBtn = document.getElementById('close-new-project');
    const cancelNewProjectBtn = document.getElementById('cancel-new-project');
    const newProjectForm = document.getElementById('new-project-form');

    if (newProjectBtn && newProjectModal) {
        newProjectBtn.addEventListener('click', () => {
            newProjectModal.style.display = 'flex';
        });

        const closeNewProjectModal = () => {
            newProjectModal.style.display = 'none';
            newProjectForm.reset();
        };

        if (closeNewProjectBtn) closeNewProjectBtn.addEventListener('click', closeNewProjectModal);
        if (cancelNewProjectBtn) cancelNewProjectBtn.addEventListener('click', closeNewProjectModal);

        window.addEventListener('click', (e) => {
            if (e.target === newProjectModal) {
                closeNewProjectModal();
            }
        });

        newProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('np-name').value;
            const owner = document.getElementById('np-owner').value;
            const status = document.getElementById('np-status').value;
            const start = document.getElementById('np-start').value;
            const end = document.getElementById('np-end').value;
            const budget = parseFloat(document.getElementById('np-budget').value) || 0;
            const proposalType = document.getElementById('np-type').value;
            const requirements = document.getElementById('np-requirements').value;
            const stakeholders = document.getElementById('np-stakeholders').value;
            const metrics = document.getElementById('np-metrics').value;

            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;

            const newProject = {
                id: newId,
                name,
                owner,
                status,
                start,
                end,
                tags: ['Novo'],
                proposalType,
                budget,
                requirements,
                stakeholders,
                metrics,
                professionals: [],
                logs: [{ 
                    date: new Date().toISOString(), 
                    user: 'System', 
                    action: 'Projeto criado',
                    type: 'system'
                }]
            };

            projects.push(newProject);
            renderTable(projects);
            applyFilters();
            renderMetrics(projects);
            
            closeNewProjectModal();
        });
    }

    if (closeActivityBtn) {
        closeActivityBtn.addEventListener('click', () => {
            activityModal.style.display = 'none';
            activityForm.reset();
        });
    }

    if (cancelActivityBtn) {
        cancelActivityBtn.addEventListener('click', () => {
            activityModal.style.display = 'none';
            activityForm.reset();
        });
    }

    if (activityForm) {
        activityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const projectId = activityModal.dataset.projectId;
            const project = projects.find(p => p.id === projectId);
            
            if (project) {
                const profSelect = document.getElementById('al-professional');
                const selectedOption = profSelect.options[profSelect.selectedIndex];
                
                const date = document.getElementById('al-date').value;
                const start = document.getElementById('al-start').value;
                const end = document.getElementById('al-end').value;
                const tasks = document.getElementById('al-tasks').value;
                const obs = document.getElementById('al-obs').value;

                // Calculate duration
                const startTime = new Date(`2000-01-01T${start}`);
                const endTime = new Date(`2000-01-01T${end}`);
                const diffMs = endTime - startTime;
                const diffHrs = Math.floor(diffMs / 3600000);
                const diffMins = Math.round(((diffMs % 3600000) / 60000));
                const duration = `${diffHrs}h ${diffMins}m`;

                const newLog = {
                    date: new Date().toISOString(),
                    user: selectedOption.value,
                    role: `${selectedOption.dataset.role} - ${selectedOption.dataset.seniority}`,
                    action: 'Registro de Atividade',
                    type: 'activity',
                    details: {
                        tasks: tasks,
                        time: `${date} (${start} - ${end}) • Total: ${duration}`,
                        obs: obs
                    }
                };

                if (!project.logs) project.logs = [];
                project.logs.push(newLog);
                
                // Update actual hours for professional (mock logic)
                const prof = project.professionals.find(p => p.name === selectedOption.value);
                if (prof) {
                    prof.hoursActual = (prof.hoursActual || 0) + (diffMs / 3600000);
                }

                activityModal.style.display = 'none';
                activityForm.reset();
                
                // Refresh details
                showProjectDetails(projectId);
            }
        });
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target == detailModal) { // Fixed: modal -> detailModal
            detailModal.style.display = "none";
        }
        if (event.target == newProjectModal) {
            newProjectModal.style.display = "none";
        }
        if (event.target == activityModal) {
            activityModal.style.display = "none";
        }
    }
});