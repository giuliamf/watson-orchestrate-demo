// Sample data for workers
const workers = [
    {
        id: 1,
        name: "Cleber Neumann Ribeiro",
        title: "IBM Expert Labs Delivery Manager - Cloud, Power VS and Guardium",
        photo: "https://randomuser.me/api/portraits/men/50.jpg",
        position: { x: 640, y: 120 },
        skills: ["Delivery Leadership", "Cloud", "Security"],
        slack: "@cleber",
        domains: ["Delivery Management", "IBM Cloud", "Power VS"],
        certifications: ["IBM Cloud Advocate"],
        industries: ["Cross-industry"],
        experiences: "Leader for delivery across Cloud, Power VS and Guardium.",
        tier: 'leader'
    },
    {
        id: 1,
        name: "Cleber Neumann Ribeiro",
        title: "IBM Expert Labs Delivery Manager - Cloud, Power VS and Guardium",
        photo: "https://randomuser.me/api/portraits/men/50.jpg",
        position: { x: 640, y: 120 },
        skills: ["Delivery Leadership", "Cloud", "Security"],
        slack: "@cleber",
        domains: ["Delivery Management", "IBM Cloud", "Power VS"],
        certifications: ["IBM Cloud Advocate"],
        industries: ["Cross-industry"],
        experiences: "Leader for delivery across Cloud, Power VS and Guardium."
    },
    {
        id: 15,
        name: "Rogério Galacci",
        title: "IBM Technology Expert Labs, Brazil Delivery Leader",
        photo: "https://randomuser.me/api/portraits/men/14.jpg",
        position: { x: 540, y: 40 },
        skills: ["Leadership", "Delivery"],
        slack: "@rogerio",
        domains: ["Expert Labs"],
        certifications: [],
        industries: ["Cross-industry"],
        experiences: "Leads Expert Labs delivery in Brazil."
    },
    {
        id: 16,
        name: "Paulo Torres",
        title: "LA Cloud Principal, IBM Technology Expert Labs",
        photo: "https://randomuser.me/api/portraits/men/20.jpg",
        position: { x: 980, y: 40 },
        skills: ["Cloud", "Leadership"],
        slack: "@paulo",
        domains: ["Cloud Architecture"],
        certifications: [],
        industries: ["Cross-industry"],
        experiences: "Regional principal for cloud initiatives."
    },
    {
        id: 2,
        name: "Álvaro Alex Capal",
        title: "IBM Expert Labs Delivery Chief Architect",
        photo: "https://randomuser.me/api/portraits/men/2.jpg",
        position: { x: 200, y: 400 },
        skills: ["Architecture", "Cloud Transformation", "OpenShift"],
        slack: "@alvaro",
        domains: ["Enterprise Architecture", "Cloud Strategy", "Application Modernization"],
        certifications: ["IBM Certified Architect", "Red Hat Certified Architect", "AWS Solutions Architect"],
        industries: ["Financial Services", "Telecommunications", "Manufacturing"],
        experiences: "20+ years in enterprise architecture and digital transformation. Specializes in designing complex hybrid cloud solutions and application modernization strategies. Has led major transformation projects for Fortune 500 companies."
    },
    {
        id: 3,
        name: "Renato Xavier",
        title: "IBM Expert Labs Delivery Cloud Architect",
        photo: "https://randomuser.me/api/portraits/men/3.jpg",
        position: { x: 600, y: 400 },
        skills: ["Cloud", "OpenShift", "VMWare"],
        slack: "@renato",
        domains: ["Cloud Architecture", "Containerization", "Virtualization"],
        certifications: ["IBM Cloud Architect", "Red Hat OpenShift", "VMWare Certified Professional"],
        industries: ["Banking", "Insurance", "Public Sector"],
        experiences: "12 years of experience in cloud architecture and implementation. Expert in OpenShift deployments and VMWare infrastructure. Has designed and implemented cloud solutions for major banks and government agencies.",
        tier: 'team'
    },
    {
        id: 4,
        name: "Anderson Paiva",
        title: "IBM Expert Labs Delivery Cloud Advisory Solution Engineer",
        photo: "https://randomuser.me/api/portraits/men/4.jpg",
        position: { x: 1000, y: 400 },
        skills: ["Cloud", "SAP", "Financial Services"],
        slack: "@anderson",
        domains: ["Cloud Advisory", "SAP on Cloud", "Solution Engineering"],
        certifications: ["IBM Cloud Technical Specialist", "SAP Certified", "Financial Services Cloud"],
        industries: ["Banking", "Insurance", "Investment"],
        experiences: "10 years specializing in cloud solutions for financial services. Expert in SAP workloads on cloud platforms. Has advised major banks on cloud migration strategies and implemented secure cloud environments for financial institutions.",
        tier: 'team'
    },
    {
        id: 5,
        name: "Felipe Akahoshi",
        title: "IBM Expert Labs Delivery Intern",
        photo: "https://randomuser.me/api/portraits/men/5.jpg",
        position: { x: 200, y: 600 },
        skills: ["Cloud", "Development", "Security"],
        slack: "@felipe",
        domains: ["Cloud Development", "Security Implementation", "DevOps"],
        certifications: ["IBM Cloud Essentials", "Security Fundamentals"],
        industries: ["Technology", "Education"],
        experiences: "Recent graduate with strong technical skills in cloud development and security. Currently working on cloud security implementations and automation projects.",
        tier: 'team'
    },
    {
        id: 6,
        name: "Daniel Silva",
        title: "IBM Expert Labs Delivery Intern",
        photo: "https://randomuser.me/api/portraits/men/6.jpg",
        position: { x: 600, y: 600 },
        skills: ["Development", "Data Analysis", "AI"],
        slack: "@daniel",
        domains: ["Application Development", "Data Analytics", "AI Solutions"],
        certifications: ["IBM AI Fundamentals", "Data Science Essentials"],
        industries: ["Retail", "Healthcare"],
        experiences: "Specializing in data analytics and AI solutions. Working on projects involving data processing pipelines and machine learning models for business insights.",
        tier: 'team'
    },
    {
        id: 7,
        name: "Giulia Moura",
        title: "IBM Expert Labs Delivery Intern",
        photo: "https://randomuser.me/api/portraits/women/1.jpg",
        position: { x: 1000, y: 600 },
        skills: ["UX/UI Design", "Cloud", "Financial Services"],
        slack: "@giulia",
        domains: ["User Experience", "Cloud Solutions", "Financial Applications"],
        certifications: ["UX Design", "IBM Cloud Essentials"],
        industries: ["Banking", "Finance", "Insurance"],
        experiences: "Focused on designing user experiences for financial services applications. Working on cloud-based solutions that enhance customer engagement for banking clients.",
        tier: 'team'
    },
    {
        id: 8,
        name: "Oliver Costa da Rocha",
        title: "Cloud Advisory Solution Engineer",
        photo: "https://randomuser.me/api/portraits/men/29.jpg",
        position: { x: 320, y: 580 },
        skills: ["Cloud", "Advisory"],
        slack: "@oliver",
        domains: ["Cloud Advisory"],
        certifications: [],
        industries: ["Financial Services"],
        experiences: "Advises clients on cloud adoption and solution engineering.",
        tier: 'team'
    },
    {
        id: 9,
        name: "Geovani de Mello Miocci",
        title: "IBM Cloud Consultant",
        photo: "https://randomuser.me/api/portraits/men/61.jpg",
        position: { x: 120, y: 640 },
        skills: ["IBM Cloud", "Consulting"],
        slack: "@geovani",
        domains: ["IBM Cloud"],
        certifications: [],
        industries: ["Banking"],
        experiences: "Consultant focused on IBM Cloud workloads.",
        tier: 'team'
    },
    {
        id: 10,
        name: "Ricardo Medea Curci",
        title: "IBM Cloud Consultant",
        photo: "https://randomuser.me/api/portraits/men/63.jpg",
        position: { x: 420, y: 640 },
        skills: ["IBM Cloud"],
        slack: "@ricardo",
        domains: ["IBM Cloud"],
        certifications: [],
        industries: ["Retail"],
        experiences: "Consultant delivering IBM Cloud solutions.",
        tier: 'team'
    },
    {
        id: 11,
        name: "Alexandro Da Silva Nabareti",
        title: "Cloud Advisory Solution Engineer",
        photo: "https://randomuser.me/api/portraits/men/73.jpg",
        position: { x: 420, y: 580 },
        skills: ["Cloud Advisory"],
        slack: "@alexandro",
        domains: ["Cloud Advisory"],
        certifications: [],
        industries: ["Public Sector"],
        experiences: "Advisory engineer for cloud transformations.",
        tier: 'team'
    },
    {
        id: 12,
        name: "Guilherme Steinberger Elias",
        title: "IBM Cloud and AI Solution Architect - Certified Expert IT Architect",
        photo: "https://randomuser.me/api/portraits/men/88.jpg",
        position: { x: 980, y: 580 },
        skills: ["Cloud", "AI", "Architecture"],
        slack: "@guilherme",
        domains: ["Cloud Architecture", "AI Solutions"],
        certifications: ["IBM Certified IT Architect"],
        industries: ["Multiple"],
        experiences: "Architect across cloud and AI solutions.",
        tier: 'team'
    },
    {
        id: 13,
        name: "Pedro Bottoli Santos",
        title: "RPA & Cloud Consultant",
        photo: "https://randomuser.me/api/portraits/men/77.jpg",
        position: { x: 980, y: 640 },
        skills: ["RPA", "Cloud"],
        slack: "@pedro",
        domains: ["Automation", "Cloud"],
        certifications: [],
        industries: ["Multiple"],
        experiences: "Consultant driving automation and cloud projects.",
        tier: 'team'
    },
    {
        id: 15,
        name: "Rogério Galacci",
        title: "IBM Technology Expert Labs, Brazil Delivery Leader",
        photo: "https://randomuser.me/api/portraits/men/14.jpg",
        position: { x: 540, y: 40 },
        skills: ["Leadership", "Delivery"],
        slack: "@rogerio",
        domains: ["Expert Labs"],
        certifications: [],
        industries: ["Cross-industry"],
        experiences: "Leads Expert Labs delivery in Brazil.",
        tier: 'leader'
    },
    {
        id: 16,
        name: "Paulo Torres",
        title: "LA Cloud Principal, IBM Technology Expert Labs",
        photo: "https://randomuser.me/api/portraits/men/20.jpg",
        position: { x: 980, y: 40 },
        skills: ["Cloud", "Leadership"],
        slack: "@paulo",
        domains: ["Cloud Architecture"],
        certifications: [],
        industries: ["Cross-industry"],
        experiences: "Regional principal for cloud initiatives.",
        tier: 'leader'
    },
    {
        id: 8,
        name: "Oliver Costa da Rocha",
        title: "Cloud Advisory Solution Engineer",
        photo: "https://randomuser.me/api/portraits/men/29.jpg",
        position: { x: 320, y: 580 },
        skills: ["Cloud", "Advisory"],
        slack: "@oliver",
        domains: ["Cloud Advisory"],
        certifications: [],
        industries: ["Financial Services"],
        experiences: "Advises clients on cloud adoption and solution engineering."
    },
    {
        id: 9,
        name: "Geovani de Mello Miocci",
        title: "IBM Cloud Consultant",
        photo: "https://randomuser.me/api/portraits/men/61.jpg",
        position: { x: 120, y: 640 },
        skills: ["IBM Cloud", "Consulting"],
        slack: "@geovani",
        domains: ["IBM Cloud"],
        certifications: [],
        industries: ["Banking"],
        experiences: "Consultant focused on IBM Cloud workloads."
    },
    {
        id: 10,
        name: "Ricardo Medea Curci",
        title: "IBM Cloud Consultant",
        photo: "https://randomuser.me/api/portraits/men/63.jpg",
        position: { x: 420, y: 640 },
        skills: ["IBM Cloud"],
        slack: "@ricardo",
        domains: ["IBM Cloud"],
        certifications: [],
        industries: ["Retail"],
        experiences: "Consultant delivering IBM Cloud solutions."
    },
    {
        id: 11,
        name: "Alexandro Da Silva Nabareti",
        title: "Cloud Advisory Solution Engineer",
        photo: "https://randomuser.me/api/portraits/men/73.jpg",
        position: { x: 420, y: 580 },
        skills: ["Cloud Advisory"],
        slack: "@alexandro",
        domains: ["Cloud Advisory"],
        certifications: [],
        industries: ["Public Sector"],
        experiences: "Advisory engineer for cloud transformations."
    },
    {
        id: 12,
        name: "Guilherme Steinberger Elias",
        title: "IBM Cloud and AI Solution Architect - Certified Expert IT Architect",
        photo: "https://randomuser.me/api/portraits/men/88.jpg",
        position: { x: 980, y: 580 },
        skills: ["Cloud", "AI", "Architecture"],
        slack: "@guilherme",
        domains: ["Cloud Architecture", "AI Solutions"],
        certifications: ["IBM Certified IT Architect"],
        industries: ["Multiple"],
        experiences: "Architect across cloud and AI solutions."
    },
    {
        id: 13,
        name: "Pedro Bottoli Santos",
        title: "RPA & Cloud Consultant",
        photo: "https://randomuser.me/api/portraits/men/77.jpg",
        position: { x: 980, y: 640 },
        skills: ["RPA", "Cloud"],
        slack: "@pedro",
        domains: ["Automation", "Cloud"],
        certifications: [],
        industries: ["Multiple"],
        experiences: "Consultant driving automation and cloud projects."
    }
];

// DOM Elements
const muralElement = document.getElementById('mural');
const filtersBtn = document.getElementById('filters-btn');
const projectsBtn = document.getElementById('projects-btn');
const filtersModal = document.getElementById('filters-modal');
const contactModal = document.getElementById('contact-modal');
const workerDetailModal = document.getElementById('worker-detail-modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Initialize panzoom for drag and zoom functionality
let panzoomInstance;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the mural with organized layout
    initializeMural();
    
    // Initialize panzoom
    panzoomInstance = panzoom(muralElement, {
        maxZoom: 4,
        minZoom: 0.5,
        zoomSpeed: 0.1,
        bounds: true,
        boundsPadding: 0.1
    });
    
    // Add zoom controls
    addZoomControls();
    
    // Event listeners for buttons and modals
    setupEventListeners();
});

// Initialize the mural with worker cards
function initializeMural() {
    // Create layout containers
    const leadersRow = document.createElement('div');
    leadersRow.className = 'leaders-row';
    const teamGrid = document.createElement('div');
    teamGrid.className = 'team-grid';

    // Split workers by tier (leaders vs team)
    const allLeaders = workers.filter(w => w.tier === 'leader');
    const allTeam = workers.filter(w => w.tier !== 'leader');
    // Limit display to exactly 9 cards (prefer 3 leaders + 6 team)
    const leaders = allLeaders.slice(0, 3);
    const team = allTeam.slice(0, Math.max(0, 9 - leaders.length));

    leaders.forEach(worker => leadersRow.appendChild(createWorkerCard(worker)));
    team.forEach(worker => teamGrid.appendChild(createWorkerCard(worker)));

    // Clear and append organized containers
    muralElement.innerHTML = '';
    muralElement.appendChild(leadersRow);
    muralElement.appendChild(teamGrid);
}

// Simple spacing algorithm to reduce overlap/close cards
function spreadWorkers(list, minDistance = 150) {
    const items = list.map(w => ({ ...w, position: { ...w.position } }));
    const maxIters = 200;
    const repel = 0.5;
    for (let iter = 0; iter < maxIters; iter++) {
        let moved = false;
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const a = items[i].position;
                const b = items[j].position;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx*dx + dy*dy) || 0.001;
                if (dist < minDistance) {
                    const push = (minDistance - dist) * repel;
                    const ux = dx / dist;
                    const uy = dy / dist;
                    a.x -= ux * push;
                    a.y -= uy * push;
                    b.x += ux * push;
                    b.y += uy * push;
                    moved = true;
                }
            }
        }
        if (!moved) break;
    }
    // keep cards within mural boundaries (roughly)
    const bounds = { x: 40, y: 40, w: 1280, h: 820 };
    items.forEach(it => {
        it.position.x = Math.max(bounds.x, Math.min(bounds.w, it.position.x));
        it.position.y = Math.max(bounds.y, Math.min(bounds.h, it.position.y));
    });
    return items;
}

// Create a worker card element
function createWorkerCard(worker) {
    const card = document.createElement('div');
    card.className = 'worker-card';
    card.dataset.id = worker.id;
    
    card.innerHTML = `
        <div class="worker-info">
            <div class="worker-photo">
                <img src="${worker.photo}" alt="${worker.name}">
            </div>
            <div class="worker-details">
                <h3>${worker.name}</h3>
                <p>${worker.title}</p>
            </div>
        </div>
    `;
    
    // Add click event to show worker details
    card.addEventListener('click', () => {
        showWorkerDetails(worker);
    });
    
    return card;
}

// Show worker details in modal
function showWorkerDetails(worker) {
    // Set worker details in modal
    const imgContainer = document.querySelector('#worker-detail-modal .worker-image');
    if (imgContainer) {
        imgContainer.innerHTML = `<img src="${worker.photo}" alt="${worker.name}">`;
    }
    document.getElementById('worker-name').textContent = worker.name;
    document.getElementById('worker-title').textContent = worker.title;
    document.getElementById('worker-slack').textContent = worker.slack;
    
    // Set domains
    const domainsElement = document.getElementById('worker-domains');
    domainsElement.innerHTML = (worker.domains || [])
        .map(domain => `<li>${domain}</li>`)
        .join('');
    
    // Set skills and certifications
    const skillsElement = document.getElementById('worker-skills');
    skillsElement.innerHTML = (worker.certifications || [])
        .map(cert => `<li>${cert}</li>`)
        .join('');
    
    // Set industries
    const industriesElement = document.getElementById('worker-industries');
    industriesElement.innerHTML = (worker.industries || [])
        .map(industry => `<li>${industry}</li>`)
        .join('');
    
    // Set experiences
    const experiencesElement = document.getElementById('worker-experiences');
    experiencesElement.innerHTML = `<p>${worker.experiences}</p>`;
    
    // Show modal
    workerDetailModal.style.display = 'flex';
}

// Add zoom controls to the mural
function addZoomControls() {
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'zoom-btn';
    zoomInBtn.innerHTML = '+';
    zoomInBtn.addEventListener('click', () => {
        panzoomInstance.zoomIn();
    });
    
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'zoom-btn';
    zoomOutBtn.innerHTML = '-';
    zoomOutBtn.addEventListener('click', () => {
        panzoomInstance.zoomOut();
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'zoom-btn';
    resetBtn.innerHTML = '⟲';
    resetBtn.addEventListener('click', () => {
        panzoomInstance.reset();
    });
    
    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(resetBtn);
    
    document.querySelector('main').appendChild(zoomControls);
}

// Setup event listeners for buttons and modals
function setupEventListeners() {
    // Filters button
    filtersBtn.addEventListener('click', () => {
        filtersModal.style.display = 'flex';
    });
    
    // Projects button navigates to the Projects dashboard
    if (projectsBtn) {
        projectsBtn.addEventListener('click', () => {
            window.location.href = 'projects.html';
        });
    }
    
    // Close buttons for modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtersModal.style.display = 'none';
            contactModal.style.display = 'none';
            workerDetailModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === filtersModal) {
            filtersModal.style.display = 'none';
        }
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
        }
        if (event.target === workerDetailModal) {
            workerDetailModal.style.display = 'none';
        }
    });
    
    // Filter functionality
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            const skill = option.querySelector('span').textContent;
            filterWorkersBySkill(skill);
            filtersModal.style.display = 'none';
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchWorkers(searchTerm);
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, you would send the form data to a server
        alert('Thank you for your message! We will get back to you soon.');
        contactModal.style.display = 'none';
        contactForm.reset();
    });
}

// Filter workers by skill
function filterWorkersBySkill(skill) {
    const cards = document.querySelectorAll('.worker-card');
    
    cards.forEach(card => {
        const workerId = parseInt(card.dataset.id);
        const worker = workers.find(w => w.id === workerId);
        
        if (worker.skills.includes(skill)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search workers by name or title
function searchWorkers(searchTerm) {
    const cards = document.querySelectorAll('.worker-card');
    
    cards.forEach(card => {
        const workerId = parseInt(card.dataset.id);
        const worker = workers.find(w => w.id === workerId);
        
        if (worker.name.toLowerCase().includes(searchTerm) || 
            worker.title.toLowerCase().includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
