import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// --- ÍCONES COM CORES FORÇADAS (Para garantir que apareçam) ---
const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f62fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
)

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#da1e28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
)

const USERS = {
  TECH: { id: 1, name: 'Daniel', role: 'TECH' },
  PM:   { id: 2, name: 'Ana',    role: 'PM' }
}

const API_URL = ""

// --- COMPONENTES ---

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="btn-secondary">Cancelar</button>
                    <button onClick={onConfirm} className="btn-danger">Confirmar Exclusão</button>
                </div>
            </div>
        </div>
    )
}

const Header = ({ currentUser, setCurrentUser, setPmView }) => (
    <header className="ibm-header">
        <div className="ibm-logo-container">
            <div className="ibm-logo-strip"></div>
            <span className="ibm-logo-text">IBM SGH</span>
        </div>
        <nav className="ibm-nav">
            <ul>
                <li><a href="#" className={currentUser.role === 'PM' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentUser(USERS.PM); setPmView('dashboard'); }}>Gestão (PM)</a></li>
                <li><a href="#" className={currentUser.role === 'TECH' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentUser(USERS.TECH); }}>Técnico</a></li>
            </ul>
        </nav>
    </header>
)

const TechForm = ({ form, setForm, workItems, onSubmit }) => {
    const [rateInfo, setRateInfo] = useState({ label: '', val: 1.0 })
    
    useEffect(() => {
        if (!form.work_item_id || !form.date) { setRateInfo({ label: '', val: 1.0 }); return; }
        
        const project = workItems.find(w => w.ID === parseInt(form.work_item_id));
        if (!project || !project.contract) return;

        const date = new Date(form.date + "T00:00:00");
        const day = date.getDay();
        const c = project.contract;
        
        let label = "Comercial (Seg-Sex)"; 
        let val = c.rate_business;

        if (day === 0) { label = "Domingo/Feriado"; val = c.rate_sun_holiday; }
        else if (day === 6) { label = "Sábado"; val = c.rate_sat_day; }
        else if (form.start_time) {
            const h = parseInt(form.start_time.split(':')[0]);
            if (h >= 18 && h < 22) { label = "Noturno (Evening)"; val = c.rate_evening; }
            else if (h >= 22 || h < 9) { label = "Madrugada (Night)"; val = c.rate_night; }
        }
        setRateInfo({ label, val })
    }, [form.work_item_id, form.date, form.start_time, workItems])

    const manualVal = parseFloat((form.manual_hours || "0").toString().replace(',', '.')) || 0;
    const estimated = (manualVal * rateInfo.val).toFixed(2);

    return (
        <form onSubmit={onSubmit} className="form-container">
            <div className="form-group">
                <label>Selecione o Projeto <span style={{color:'red'}}>*</span></label>
                <select className="form-control" value={form.work_item_id} onChange={e => setForm({...form, work_item_id: e.target.value})} required>
                    <option value="" disabled>-- Selecione --</option>
                    {workItems.map(wi => <option key={wi.ID} value={wi.ID}>{wi.wi_code} - {wi.description}</option>)}
                </select>
            </div>
            <div className="form-group"><label>Data</label><input type="date" className="form-control" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            
            {rateInfo.label && (
                <div className="info-box">
                    <div className="info-box-header">
                        <div>
                            <div className="info-label">Regra Detectada</div>
                            <div className="info-value">{rateInfo.label}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <div className="info-label">Multiplicador</div>
                            <div className="info-multiplier">{rateInfo.val}x</div>
                        </div>
                    </div>
                    {manualVal > 0 && (
                        <div className="info-box-footer">
                            <span>Lançamento: <strong>{manualVal}h</strong></span>
                            <span>Faturável: <strong style={{color:'#198038'}}>{estimated}h</strong></span>
                        </div>
                    )}
                </div>
            )}

            <div className="form-section">
                <div className="form-grid-3">
                    <div className="form-group" style={{marginBottom:0}}><label>Início</label><input type="time" className="form-control" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} required /></div>
                    <div className="form-group" style={{marginBottom:0}}><label>Fim</label><input type="time" className="form-control" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} required /></div>
                    <div className="form-group" style={{marginBottom:0}}>
                        <label style={{color:'#0f62fe'}}>Horas (Qtd)</label>
                        <input type="text" className="form-control" value={form.manual_hours} onChange={e => setForm({...form, manual_hours: e.target.value})} required placeholder="Ex: 8.0" style={{borderColor: '#0f62fe'}} />
                    </div>
                </div>
            </div>
            <div className="form-group"><label>Descrição</label><textarea className="form-control" rows="5" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea></div>
            <button type="submit" className="submit-btn" style={{width: '100%'}}>Registrar</button>
        </form>
    )
}

const PMDashboard = ({ workItems, onSelectProject, onEdit, onDelete }) => (
    <div className="projects-table-wrapper">
       <table className="projects-table">
           <thead><tr><th>Status</th><th>WI</th><th>Descrição</th><th>Budget</th><th style={{textAlign:'right'}}>Ações</th></tr></thead>
           <tbody>
               {workItems.map(wi => (
                   <tr key={wi.ID} className="project-row">
                       <td onClick={() => onSelectProject(wi)} style={{cursor:'pointer'}}><span className="project-status-chip in_progress">Ativo</span></td>
                       <td onClick={() => onSelectProject(wi)} style={{cursor:'pointer', color:'#0f62fe', fontWeight:600}}>{wi.wi_code}</td>
                       <td onClick={() => onSelectProject(wi)} style={{cursor:'pointer'}}>{wi.description}</td>
                       <td onClick={() => onSelectProject(wi)} style={{cursor:'pointer'}}>{wi.used_hours.toFixed(1)} / {wi.total_budget_hours}h</td>
                       <td style={{textAlign:'right'}}>
                           <div style={{display:'inline-flex', gap:'12px', justifyContent:'flex-end'}}>
                               <button onClick={(e) => {e.stopPropagation(); onEdit(wi)}} title="Editar"
                                   className="action-btn">
                                   <IconEdit />
                               </button>
                               <button onClick={(e) => {e.stopPropagation(); onDelete(wi.ID)}} title="Excluir"
                                   className="action-btn delete">
                                   <IconTrash />
                               </button>
                           </div>
                       </td>
                   </tr>
               ))}
           </tbody>
       </table>
    </div>
)

const PMCreateProject = ({ newProject, setNewProject, onSubmit }) => (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <h3 style={{marginBottom: '1.5rem'}}>Novo Projeto & Regras</h3>
        <form onSubmit={onSubmit}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div className="form-group">
                    <label>CN (Contrato)</label>
                    <input className="form-control" value={newProject.contract_number} onChange={e=>setNewProject({...newProject, contract_number: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>WI Code</label>
                    <input className="form-control" value={newProject.code} onChange={e=>setNewProject({...newProject, code: e.target.value})} required />
                </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1rem'}}>
                <div className="form-group">
                    <label>Descrição</label>
                    <input className="form-control" value={newProject.description} onChange={e=>setNewProject({...newProject, description: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Budget</label>
                    <input type="number" className="form-control" value={newProject.total_budget} onChange={e=>setNewProject({...newProject, total_budget: e.target.value})} required />
                </div>
            </div>

            <div style={{background:'#f4f4f4', padding:'1.5rem', borderRadius:'4px', marginTop:'1rem', border:'1px solid #e0e0e0'}}>
                <h4 style={{fontSize:'14px', marginBottom:'1rem', color:'#0f62fe'}}>Tarifas (Multiplicadores)</h4>
                
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1rem'}}>
                    <div className="form-group">
                        <label style={{fontSize:'12px'}}>Seg-Sex (09-18)</label>
                        <input type="number" step="0.1" className="form-control" value={newProject.rate_business} onChange={e=>setNewProject({...newProject, rate_business: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label style={{fontSize:'12px'}}>Seg-Sex (18-22)</label>
                        <input type="number" step="0.1" className="form-control" value={newProject.rate_evening} onChange={e=>setNewProject({...newProject, rate_evening: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label style={{fontSize:'12px'}}>Seg-Sex (22-09)</label>
                        <input type="number" step="0.1" className="form-control" value={newProject.rate_night} onChange={e=>setNewProject({...newProject, rate_night: e.target.value})} />
                    </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem'}}>
                    <div className="form-group">
                        <label style={{fontSize:'12px'}}>Sábado (09-18)</label>
                        <input type="number" step="0.1" className="form-control" value={newProject.rate_sat_day} onChange={e=>setNewProject({...newProject, rate_sat_day: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label style={{fontSize:'12px'}}>Sábado (18-00)</label>
                        <input type="number" step="0.1" className="form-control" value={newProject.rate_sat_night} onChange={e=>setNewProject({...newProject, rate_sat_night: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label style={{fontSize:'12px'}}>Dom/Fer (00-00)</label>
                        <input type="number" step="0.1" className="form-control" value={newProject.rate_sun_holiday} onChange={e=>setNewProject({...newProject, rate_sun_holiday: e.target.value})} />
                    </div>
                </div>
            </div>
            <button className="submit-btn" style={{width:'100%', marginTop:'1.5rem'}}>Criar Projeto</button>
        </form>
    </div>
)

const PMEditProject = ({ project, onCancel, onSave }) => {
    const [editForm, setEditForm] = useState({ description: project.description, total_budget: project.total_budget_hours })
    const handleSubmit = (e) => { e.preventDefault(); onSave(project.ID, editForm); }
    return (
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <h3>Editar Projeto: {project.wi_code}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Descrição</label><input className="form-control" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} required /></div>
                <div className="form-group"><label>Budget Total</label><input type="number" className="form-control" value={editForm.total_budget} onChange={e => setEditForm({...editForm, total_budget: e.target.value})} required /></div>
                <div style={{display:'flex', gap:'1rem'}}><button type="submit" className="submit-btn">Salvar</button><button type="button" onClick={onCancel} className="submit-btn" style={{background:'#ccc', color:'#000'}}>Cancelar</button></div>
            </form>
        </div>
    )
}

const ProjectDetail = ({ project, entries, onBack }) => { if (!project) return <div>Carregando...</div>; const percentage = Math.min(((project.used_hours || 0) / (project.total_budget_hours || 1)) * 100, 100).toFixed(1); let barColor = percentage > 90 ? '#da1e28' : (percentage > 75 ? '#f1c21b' : '#0f62fe'); return (<div><button onClick={onBack} style={{background:'none', border:'none', color:'#0f62fe', cursor:'pointer', marginBottom:'1rem'}}>← Voltar</button><div style={{marginBottom:'2rem', borderBottom:'1px solid #e0e0e0', paddingBottom:'2rem'}}><h2 style={{fontSize:'24px', fontWeight:300, marginBottom:'0.5rem'}}>{project.description}</h2><div style={{width: '100%', height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden', marginTop:'1rem'}}><div style={{width: `${percentage}%`, height: '100%', background: barColor, transition: 'width 0.5s ease'}}></div></div><div style={{display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'12px', color:'#6f6f6f'}}><span>Utilização: {percentage}%</span><span>{project.used_hours.toFixed(1)}h / {project.total_budget_hours}h</span></div></div><div className="projects-table-wrapper" style={{maxHeight:'500px', overflowY:'auto', background:'#fff'}}><table className="projects-table" style={{fontSize:'13px'}}><thead style={{position:'sticky', top:0, zIndex:1, background:'#f4f4f4'}}><tr><th>Data</th><th>Profissional</th><th>Início</th><th>Fim</th><th>Relógio</th><th style={{color:'#0f62fe'}}>Rate</th><th>Horas</th><th>Atividade</th></tr></thead><tbody>{entries.map(entry => { const impliedRate = entry.manual_hours > 0 ? (entry.hours_billable / entry.manual_hours).toFixed(1) : "0.0"; return (<tr key={entry.ID}><td>{new Date(entry.date).toLocaleDateString()}</td><td style={{fontWeight:600}}>{entry.employee?.name || 'Tech'}</td><td>{entry.start_time}</td><td>{entry.end_time}</td><td style={{color:'#6f6f6f'}}>{(entry.calculated_duration || 0).toFixed(2)}h</td><td style={{fontWeight:'bold', color:'#0f62fe'}}>{impliedRate}x</td><td style={{fontWeight:'bold', fontSize:'14px', color:'#000'}}>{(entry.manual_hours || 0).toFixed(2)}h</td><td>{entry.description}</td></tr>) })}</tbody></table></div></div>)}
const PMLogs = ({ logs }) => (<div className="projects-table-wrapper"><table className="logs-table"><thead><tr><th>Data</th><th>Usuário</th><th>Ação</th></tr></thead><tbody>{logs.map((log, idx) => (<tr key={idx}><td>{log.timestamp}</td><td>{log.user_name}</td><td>{log.action}</td></tr>))}</tbody></table></div>)

function App() {
  const [currentUser, setCurrentUser] = useState(USERS.PM)
  const [workItems, setWorkItems] = useState([])
  const [logs, setLogs] = useState([])
  const [message, setMessage] = useState(null)
  const [pmView, setPmView] = useState('dashboard')
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectEntries, setProjectEntries] = useState([])
  const [form, setForm] = useState({work_item_id: '', date: new Date().toISOString().split('T')[0], start_time: '09:00', end_time: '18:00', manual_hours: '', description: ''})
  
  const [newProject, setNewProject] = useState({
      contract_number: '', code: '', description: '', total_budget: '',
      rate_business: '1.0', rate_evening: '1.5', rate_night: '2.0',
      rate_sat_day: '1.5', rate_sat_night: '2.0', rate_sun_holiday: '2.5'
  })
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalText, setModalText] = useState("");

  useEffect(() => { if (workItems.length > 0 && !form.work_item_id) setForm(prev => ({...prev, work_item_id: workItems[0].ID})) }, [workItems])
  useEffect(() => { fetchData() }, [pmView, currentUser])
  useEffect(() => { if (selectedProject && pmView === 'detail') fetchProjectDetails(selectedProject.ID) }, [selectedProject, pmView])

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/workitems`)
      setWorkItems(res.data || [])
      if (currentUser.role === 'PM') {
          const l = await axios.get(`${API_URL}/audit-logs`)
          setLogs(Array.isArray(l.data) ? l.data : [])
      }
    } catch (e) { console.error(e) }
  }

  const fetchProjectDetails = async (id) => { try { const res = await axios.get(`${API_URL}/workitems/${id}/details`); setProjectEntries(res.data) } catch (e) {} }

  const parseNumber = (val) => { if (!val) return 0; if (typeof val === 'number') return val; return parseFloat(val.toString().replace(',', '.')) || 0; }

  const handleLaunchHours = async (e) => {
    e.preventDefault()
    if (!form.work_item_id) return
    try {
      await axios.post(`${API_URL}/entries`, {
        employee_id: currentUser.id, work_item_id: parseInt(form.work_item_id), date: form.date, start_time: form.start_time, end_time: form.end_time, manual_hours: parseNumber(form.manual_hours), description: form.description
      })
      setMessage({ type: 'success', text: 'Sucesso!' }); fetchData(); setForm(p => ({...p, description: '', manual_hours: ''}))
    } catch (e) { setMessage({ type: 'error', text: e.response?.data?.error || "Erro ao salvar" }) }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
        await axios.post(`${API_URL}/workitems`, {
            ...newProject,
            total_budget: parseNumber(newProject.total_budget),
            rate_business: parseNumber(newProject.rate_business),
            rate_evening: parseNumber(newProject.rate_evening),
            rate_night: parseNumber(newProject.rate_night),
            rate_sat_day: parseNumber(newProject.rate_sat_day),
            rate_sat_night: parseNumber(newProject.rate_sat_night),
            rate_sun_holiday: parseNumber(newProject.rate_sun_holiday),
            manager_name: currentUser.name
        })
        setMessage({ type: 'success', text: 'Projeto Criado!' })
        setNewProject({contract_number: '', code: '', description: '', total_budget: '', rate_business: '1.0', rate_evening: '1.5', rate_night: '2.0', rate_sat_day: '1.5', rate_sat_night: '2.0', rate_sun_holiday: '2.5'})
        setPmView('dashboard')
        fetchData()
    } catch (e) { 
        setMessage({ type: 'error', text: e.response?.data?.error || "Erro ao criar." }) 
    }
  }

  const handleEditProject = async (id, updatedData) => {
      try { await axios.put(`${API_URL}/workitems/${id}`, { description: updatedData.description, total_budget: parseFloat(updatedData.total_budget) }); setMessage({ type: 'success', text: 'Editado!' }); setPmView('dashboard'); fetchData() } catch (e) { setMessage({ type: 'error', text: "Erro." }) }
  }

  const confirmDelete = (id) => {
      setModalText("Tem certeza que deseja excluir este projeto? Todo o histórico será perdido.");
      setModalAction(() => async () => {
          try { await axios.delete(`${API_URL}/workitems/${id}`); setMessage({ type: 'success', text: 'Excluído!' }); fetchData(); setModalOpen(false); } catch (e) { setMessage({ type: 'error', text: "Erro." }); setModalOpen(false); }
      });
      setModalOpen(true);
  }

  return (
    <>
      <ConfirmModal isOpen={modalOpen} title="Excluir Projeto" message={modalText} onConfirm={modalAction} onCancel={() => setModalOpen(false)} />
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} setPmView={setPmView} />
      <main>
        {message && <div style={{padding:'1rem', marginBottom:'1rem', background: message.type==='error'?'#fff1f1':'#defbe6', borderLeft: message.type==='error'?'4px solid red':'4px solid green', color: message.type==='error'?'red':'green'}}>{message.text}</div>}
        <div className="projects-container">
            {currentUser.role === 'PM' ? (
                <>
                    <div className="projects-header"><h1>Gestão de Contratos</h1></div>
                    <div className="pm-tabs">
                        <button className={`pm-tab ${pmView === 'dashboard'||pmView ==='detail'?'active':''}`} onClick={() => setPmView('dashboard')}>Dashboard</button>
                        <button className={`pm-tab ${pmView === 'create'?'active':''}`} onClick={() => setPmView('create')}>+ Criar Projeto</button>
                        <button className={`pm-tab ${pmView === 'logs'?'active':''}`} onClick={() => setPmView('logs')}>Logs</button>
                    </div>
                    {pmView === 'dashboard' && <PMDashboard workItems={workItems} onSelectProject={(wi) => { setSelectedProject(wi); setPmView('detail'); }} onEdit={(wi) => { setSelectedProject(wi); setPmView('edit'); }} onDelete={confirmDelete} />}
                    {pmView === 'detail' && <ProjectDetail project={workItems.find(w => w.ID === selectedProject?.ID) || selectedProject} entries={projectEntries} onBack={() => setPmView('dashboard')} />}
                    {pmView === 'create' && <PMCreateProject newProject={newProject} setNewProject={setNewProject} onSubmit={handleCreateProject} />}
                    {pmView === 'edit' && selectedProject && <PMEditProject project={selectedProject} onCancel={() => setPmView('dashboard')} onSave={handleEditProject} />}
                    {pmView === 'logs' && <PMLogs logs={logs} />}
                </>
            ) : (
                <>
                    <div className="projects-header"><h1>Portal do Técnico</h1></div>
                    <TechForm form={form} setForm={setForm} workItems={workItems} onSubmit={handleLaunchHours} />
                </>
            )}
        </div>
      </main>
    </>
  )
}

export default App