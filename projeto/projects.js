document.addEventListener('DOMContentLoaded', () => {
  const projects = [
    { id: 1, name: 'Itau', owner: 'Felipe Akahoshi', status: 'in_progress', start: '2025-06-01', end: '', tags: ['Cloud', 'Migration', 'Azure'],
      proposalType: 'Fixed Price', budget: 450000,
      professionals: [
        { name: 'Felipe Akahoshi', role: 'Lead Architect', seniority: 'Senior' },
        { name: 'Giulia Moura', role: 'UX Designer', seniority: 'Intern' },
        { name: 'Bruno Silva', role: 'Cloud Engineer', seniority: 'Mid' }
      ]
    },
    { id: 2, name: 'Casas Bahia', owner: 'Giulia Moura', status: 'completed', start: '2025-02-10', end: '2025-06-30', tags: ['Data', 'Analytics', 'Retail'],
      proposalType: 'Time & Materials', budget: 320000,
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
        p.tags.join(' ').toLowerCase().includes(q)
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
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${person.name}</td>
        <td>${person.role}</td>
        <td>${formatBanda(person.seniority)}</td>
      `;
      tbodyProf.appendChild(tr);
    });

    // Initialize chat bound to this project
    currentProject = p;
    initProjectChat();

    // Show the modal
    detailModal.style.display = 'flex';
    // Populate Excel area with a download link when applicable
    renderExcelForProject(p);
  }

  // Show a simple download link for the project Excel file (Itau only)
  function renderExcelForProject(p) {
    const container = document.querySelector('.excel-placeholder');
    if (!container) return;

    // Reset container content
    container.innerHTML = '';

    // Only provide the link for the Itau project
    if ((p.name || '').toLowerCase() !== 'itau') {
    container.innerHTML = '<p>Nenhum arquivo Excel associado a este projeto.</p>';
      return;
    }

    const fileUrl = 'projeto_casas_bahia.xlsx';
    const label = document.createElement('div');
    label.style.marginBottom = '12px';
    label.style.color = 'var(--ibm-gray-70)';
    label.textContent = 'Arquivo Excel:';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Baixar arquivo Excel do projeto';
    link.style.display = 'inline-block';
    link.style.padding = '8px 12px';
    link.style.border = '1px solid var(--ibm-gray-30)';
    link.style.borderRadius = '4px';
    link.style.backgroundColor = 'var(--ibm-white)';
    link.style.color = 'var(--ibm-gray-100)';

    container.appendChild(label);
    container.appendChild(link);
  }

  function initProjectChat() {
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    if (!messages || !input || !sendBtn) return;

    messages.innerHTML = '';
    input.value = '';
    addChatMessage(`Olá! Pergunte sobre ${currentProject.name}: orçamento, tipo de proposta, responsável, status, datas, tags ou profissionais (funções, banda).`, 'bot');

    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      addChatMessage(text, 'user');
      const reply = answerProjectQuestion(text, currentProject);
      addChatMessage(reply, 'bot');
      input.value = '';
    };

    // Reset listeners by cloning nodes (to avoid duplicate handlers)
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    const newSend = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSend, sendBtn);

    newInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        send();
      }
    });
    newSend.addEventListener('click', send);
  }

  function addChatMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function answerProjectQuestion(q, p) {
    const s = q.toLowerCase();
    if (s.includes('budget') || s.includes('price') || s.includes('cost') || s.includes('orçamento')) {
      return `Orçamento: ${formatCurrencyBRL(p.budget)}. Tipo de proposta: ${p.proposalType}.`;
    }
    if (s.includes('proposal') || s.includes('proposta')) {
      return `O tipo de proposta é ${p.proposalType}.`;
    }
    if (s.includes('owner') || s.includes('who') || s.includes('responsável')) {
      return `Responsável: ${p.owner}.`;
    }
    if (s.includes('status')) {
      return `Status: ${formatStatus(p.status)}.`;
    }
    if (s.includes('date') || s.includes('timeline') || s.includes('start') || s.includes('end') || s.includes('data')) {
      return `Cronograma: ${p.start || '-'} → ${p.end || '-'}.`;
    }
    if (s.includes('tag') || s.includes('area') || s.includes('domain') || s.includes('tags')) {
      return `Tags: ${p.tags.join(', ')}.`;
    }
    if (s.includes('professional') || s.includes('team') || s.includes('role') || s.includes('seniority') || s.includes('banda') || s.includes('profissional') || s.includes('equipe') || s.includes('função')) {
      const list = (p.professionals || []).map(pr => `${pr.name} — ${pr.role} (${formatBanda(pr.seniority)})`).join('; ');
      return list ? `Profissionais: ${list}.` : 'Nenhum profissional listado.';
    }
    return 'Posso responder sobre orçamento, tipo de proposta, responsável, status, datas, tags e profissionais (funções, banda).';
  }
});
