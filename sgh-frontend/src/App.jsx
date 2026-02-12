import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.scss'

// Carbon Design System Components
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  Button,
  TextInput,
  Select,
  SelectItem,
  TextArea,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  Tag,
  Tile,
  Grid,
  Column,
  Loading,
  InlineNotification,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ProgressBar,
  ContentSwitcher,
  Switch,
  Checkbox
} from '@carbon/react'

// Carbon Icons
import {
  Edit,
  TrashCan,
  ChevronLeft,
  ChevronRight,
  Add,
  Search,
  Save,
  Close
} from '@carbon/icons-react'

const USERS = {
  TECH: { id: 1, name: 'Daniel', role: 'TECH' },
  PM:   { id: 2, name: 'Ana',    role: 'PM' }
}

const API_URL = "http://localhost:8080"

// --- COMPONENTES ---

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      open={isOpen}
      modalHeading={title}
      primaryButtonText="Confirmar Exclusão"
      secondaryButtonText="Cancelar"
      onRequestClose={onCancel}
      onRequestSubmit={onConfirm}
      danger
    >
      <p>{message}</p>
    </Modal>
  )
}

const Header = ({ currentUser, setCurrentUser, setPmView }) => (
  <CarbonHeader aria-label="IBM SIGHT">
    <HeaderName prefix="">
      <div className="sgh-logo-container">
        <div className="sgh-logo-strip"></div>
        <span className="sgh-logo-text">IBM SIGHT</span>
      </div>
    </HeaderName>
    <HeaderNavigation aria-label="IBM SIGHT">
      <HeaderMenuItem
        isActive={currentUser.role === 'PM'}
        onClick={() => { setCurrentUser(USERS.PM); setPmView('list'); }}
      >
        Gestão (PM)
      </HeaderMenuItem>
      <HeaderMenuItem
        isActive={currentUser.role === 'TECH'}
        onClick={() => setCurrentUser(USERS.TECH)}
      >
        Técnico
      </HeaderMenuItem>
    </HeaderNavigation>
  </CarbonHeader>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Algo deu errado.</h3>
          <p>Por favor, recarregue a página.</p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      );
    }

    return this.props.children; 
  }
}

const TechWeeklyView = ({ currentUser, workItems }) => {
    const getSunday = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.setDate(diff));
    }

    const [weekStart, setWeekStart] = useState(getSunday(new Date()));
    const [entries, setEntries] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) return "";
        return date.toISOString().split('T')[0];
    }
    
    const formatLabel = (date) => {
        if (!(date instanceof Date) || isNaN(date)) return { day: "", date: "" };
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return { day: days[date.getDay()], date: `${date.getDate()} ${months[date.getMonth()]}` };
    };

    useEffect(() => {
        fetchEntries();
        setSelectedEntry(null);
    }, [weekStart, currentUser]);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const startStr = formatDate(weekDays[0]);
            const endStr = formatDate(weekDays[6]);
            const res = await axios.get(`${API_URL}/entries?employee_id=${currentUser.id}&start_date=${startStr}&end_date=${endStr}`);
            
            if (Array.isArray(res.data)) {
                const map = {};
                res.data.forEach(e => {
                    const d = e.date.split('T')[0];
                    if (!map[e.work_item_id]) map[e.work_item_id] = {};
                    map[e.work_item_id][d] = e;
                });
                setEntries(map);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCell = (workItemId, date, entry, value) => {
        try {
            const dateStr = formatDate(date);
            if (!dateStr) return;

            const [y, m, d] = dateStr.split('-').map(Number);
            const localDate = new Date(y, m - 1, d);
            
            setSelectedEntry({
                workItemId,
                date: dateStr,
                value: value || "",
                description: entry?.description || "",
                existingId: entry?.ID,
                displayDate: localDate.toLocaleDateString('pt-BR')
            });
        } catch (e) {
            console.error("Error selecting cell:", e);
        }
    };

    const handleInputChange = (e) => {
        if (selectedEntry) {
            setSelectedEntry({ ...selectedEntry, value: e.target.value });
        }
    };

    const handleManualSubmit = async () => {
        if (!selectedEntry) return;
        setSubmitting(true);
        setSaveStatus(""); 

        try {
            const cleanValue = selectedEntry.value.toString().replace(',', '.');
            const val = parseFloat(cleanValue) || 0;
            
            if (val <= 0 && !selectedEntry.description && !selectedEntry.existingId) {
                alert("Por favor, insira horas ou descrição válida.");
                setSubmitting(false);
                return;
            }

            let res;
            if (selectedEntry.existingId) {
                res = await axios.put(`${API_URL}/entries/${selectedEntry.existingId}`, {
                    manual_hours: val,
                    description: selectedEntry.description
                });
            } else {
                 res = await axios.post(`${API_URL}/entries`, {
                    employee_id: currentUser.id,
                    work_item_id: selectedEntry.workItemId,
                    date: selectedEntry.date,
                    start_time: "09:00",
                    end_time: "18:00",
                    manual_hours: val,
                    description: selectedEntry.description
                });
            }

            const newEntry = selectedEntry.existingId ? res.data : { ...res.data, ID: res.data.id };
            
            setEntries(prev => ({
                ...prev,
                [selectedEntry.workItemId]: {
                    ...prev[selectedEntry.workItemId] || {},
                    [selectedEntry.date]: newEntry
                }
            }));
            
            if (!selectedEntry.existingId) {
                 setSelectedEntry(prev => ({ ...prev, existingId: newEntry.ID }));
            }

            setSaveStatus("saved");
            alert("Enviado com sucesso!");
            setTimeout(() => setSaveStatus(""), 3000);

        } catch (e) {
            console.error(e);
            setSaveStatus("error");
            alert("Erro ao enviar: " + (e.response?.data?.error || e.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDescriptionChange = (e) => {
        const val = e.target.value;
        if (selectedEntry) {
            const updated = { ...selectedEntry, description: val };
            setSelectedEntry(updated);
        }
    };

    const getTotalHours = (workItemId) => {
        if (!entries[workItemId]) return 0;
        return Object.values(entries[workItemId]).reduce((acc, curr) => acc + (curr.manual_hours || 0), 0).toFixed(1);
    };

    return (
        <div className="tech-timesheet" style={{width: '100%'}}>
            {/* Navegação de Semana */}
            <div style={{
                backgroundColor: 'var(--cds-layer-01)',
                padding: '1.5rem',
                borderRadius: '4px',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0'
                }}>
                    <Button
                        kind="secondary"
                        size="md"
                        hasIconOnly
                        renderIcon={ChevronLeft}
                        iconDescription="Semana anterior"
                        onClick={() => setWeekStart(new Date(weekStart.setDate(weekStart.getDate() - 7)))}
                    />
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--cds-text-01)',
                        minWidth: '200px',
                        textAlign: 'center'
                    }}>
                        {formatLabel(weekDays[0]).date} - {formatLabel(weekDays[6]).date}
                    </div>
                    <Button
                        kind="secondary"
                        size="md"
                        hasIconOnly
                        renderIcon={ChevronRight}
                        iconDescription="Próxima semana"
                        onClick={() => setWeekStart(new Date(weekStart.setDate(weekStart.getDate() + 7)))}
                    />
                </div>
                <Button
                    kind="primary"
                    size="md"
                    onClick={() => setWeekStart(getSunday(new Date()))}
                >
                    Hoje
                </Button>
            </div>

            {/* Tabela Timesheet */}
            <div style={{marginBottom: '2rem'}}>
                {loading ? (
                    <Loading description="Carregando..." withOverlay={false} />
                ) : (
                    <div className="timesheet-grid">
                        <div className="timesheet-header">
                            <div className="timesheet-header-cell">Projeto</div>
                            {weekDays.map((d, i) => {
                                const label = formatLabel(d);
                                return (
                                    <div key={i} className="timesheet-header-cell">
                                        <div>{label.day}</div>
                                        <div style={{fontSize: '11px', color: 'var(--cds-text-02)'}}>{label.date}</div>
                                    </div>
                                );
                            })}
                            <div className="timesheet-header-cell">Total</div>
                        </div>

                        {workItems.map(wi => (
                            <div key={wi.ID} className="timesheet-row">
                                <div className="timesheet-row-content">
                                    <div className="timesheet-label-cell">
                                        <strong>{wi.wi_code}</strong>
                                        <div style={{fontSize: '12px', color: 'var(--cds-text-02)'}}>{wi.description}</div>
                                    </div>
                                    {weekDays.map((date, idx) => {
                                        const dateStr = formatDate(date);
                                        const entry = entries[wi.ID]?.[dateStr];
                                        const value = entry?.manual_hours || "";
                                        const isSelected = selectedEntry?.workItemId === wi.ID && selectedEntry?.date === dateStr;
                                        
                                        return (
                                            <div key={idx} className="timesheet-input-cell">
                                                <div className="timesheet-cell-content">
                                                    <input
                                                        type="text"
                                                        className={`timesheet-input ${isSelected ? 'active-cell' : ''}`}
                                                        value={isSelected ? selectedEntry.value : value}
                                                        readOnly
                                                        onFocus={() => handleSelectCell(wi.ID, date, entry, value)}
                                                        placeholder="-"
                                                    />
                                                    <div className="tech-checkbox-center">
                                                        <Checkbox
                                                            id={`checkbox-${wi.ID}-${dateStr}`}
                                                            labelText=""
                                                            checked={isSelected}
                                                            onChange={(e, { checked }) => {
                                                                if (checked) {
                                                                    // Selecionar este dia/célula
                                                                    handleSelectCell(wi.ID, date, entry, value || '');
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="timesheet-total-cell">{getTotalHours(wi.ID)}h</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Painel de Detalhes do Trabalho - Sempre visível */}
            <div className="details-panel">
                <h4>Detalhes do Trabalho</h4>
                <TextArea
                    id="description-input"
                    labelText=""
                    value={selectedEntry?.description || ''}
                    onChange={handleDescriptionChange}
                    rows={6}
                    placeholder="Insira os detalhes do trabalho aqui..."
                    style={{
                        marginBottom: '1.5rem',
                        border: '2px solid #8d8d8d',
                        fontSize: '15px'
                    }}
                    disabled={!selectedEntry}
                />
                <Button
                    kind="primary"
                    size="lg"
                    onClick={handleManualSubmit}
                    disabled={submitting || !selectedEntry}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: 600
                    }}
                >
                    {submitting ? 'Enviando...' : 'Enviar'}
                </Button>
            </div>
        </div>
    );
};

const TechForm = ({ workItems, onSubmit, form, setForm }) => {
    const [rateInfo, setRateInfo] = useState({ label: "", val: 1.0 })

    useEffect(() => {
        let label = "Comercial (Business Hours)";
        let val = 1.0;
        const wi = workItems.find(w => w.ID === parseInt(form.work_item_id));
        if (!wi || !wi.contract) return setRateInfo({ label, val });
        const c = wi.contract;
        
        if (form.date) {
            const d = new Date(form.date + 'T00:00:00');
            const day = d.getDay();
            if (day === 0) { label = "Domingo/Feriado"; val = c.rate_sun_holiday; }
            else if (day === 6) {
                const h = form.start_time ? parseInt(form.start_time.split(':')[0]) : 9;
                if (h >= 18) { label = "Sábado Noturno"; val = c.rate_sat_night; }
                else { label = "Sábado Diurno"; val = c.rate_sat_day; }
            }
        }
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
        <form onSubmit={onSubmit}>
            <Grid narrow>
                <Column sm={4} md={8} lg={16}>
                    <Select
                        id="project-select"
                        labelText="Selecione o Projeto"
                        value={form.work_item_id}
                        onChange={e => setForm({...form, work_item_id: e.target.value})}
                        required
                    >
                        <SelectItem value="" text="-- Selecione --" />
                        {workItems.map(wi => (
                            <SelectItem key={wi.ID} value={wi.ID} text={`${wi.wi_code} - ${wi.description}`} />
                        ))}
                    </Select>
                </Column>

                <Column sm={4} md={4} lg={8}>
                    <TextInput
                        id="date-input"
                        type="date"
                        labelText="Data"
                        value={form.date}
                        onChange={e => setForm({...form, date: e.target.value})}
                    />
                </Column>

                {rateInfo.label && (
                    <Column sm={4} md={8} lg={16}>
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
                                    <span>Faturável: <strong style={{color:'var(--cds-support-02)'}}>{estimated}h</strong></span>
                                </div>
                            )}
                        </div>
                    </Column>
                )}

                <Column sm={4} md={8} lg={16}>
                    <Tile className="form-section">
                        <Grid narrow>
                            <Column sm={4} md={2} lg={5}>
                                <TextInput
                                    id="start-time"
                                    type="time"
                                    labelText="Início"
                                    value={form.start_time}
                                    onChange={e => setForm({...form, start_time: e.target.value})}
                                    required
                                />
                            </Column>
                            <Column sm={4} md={2} lg={5}>
                                <TextInput
                                    id="end-time"
                                    type="time"
                                    labelText="Fim"
                                    value={form.end_time}
                                    onChange={e => setForm({...form, end_time: e.target.value})}
                                    required
                                />
                            </Column>
                            <Column sm={4} md={4} lg={6}>
                                <TextInput
                                    id="manual-hours"
                                    labelText="Horas (Qtd)"
                                    value={form.manual_hours}
                                    onChange={e => setForm({...form, manual_hours: e.target.value})}
                                    required
                                    placeholder="Ex: 8.0"
                                />
                            </Column>
                        </Grid>
                    </Tile>
                </Column>

                <Column sm={4} md={8} lg={16}>
                    <TextArea
                        id="description"
                        labelText="Descrição"
                        rows={5}
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                    />
                </Column>

                <Column sm={4} md={8} lg={16}>
                    <Button type="submit" kind="primary" size="lg" style={{width: '100%'}}>
                        Registrar
                    </Button>
                </Column>
            </Grid>
        </form>
    )
}

const PMDashboard = ({ workItems, onSelectProject, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredWorkItems = workItems.filter(wi => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
            wi.wi_code.toLowerCase().includes(searchLower) ||
            wi.description.toLowerCase().includes(searchLower)
        );
        
        const projectStatus = wi.status || 'active';
        const matchesStatus = statusFilter === 'all' || projectStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const headers = [
        { key: 'status', header: 'Status' },
        { key: 'wi_code', header: 'WI' },
        { key: 'description', header: 'Nome do Projeto' },
        { key: 'responsible', header: 'Responsável' },
        { key: 'budget', header: 'Budget' },
        { key: 'actions', header: 'Ações' }
    ];

    const getStatusTag = (status) => {
        switch(status) {
            case 'active':
                return <Tag type="green">Ativo</Tag>;
            case 'completed':
                return <Tag type="blue">Completo</Tag>;
            case 'on_hold':
                return <Tag type="yellow">On Hold</Tag>;
            default:
                return <Tag type="green">Ativo</Tag>;
        }
    };

    const rows = filteredWorkItems.map(wi => {
        const usedPercent = wi.total_budget_hours > 0 ? (wi.used_hours / wi.total_budget_hours) * 100 : 0;
        
        return {
            id: wi.ID.toString(),
            status: getStatusTag(wi.status || 'active'),
            wi_code: wi.wi_code,
            description: wi.description,
            responsible: wi.owner || wi.responsible || 'Não atribuído',
            budget: (
                <div>
                    <div style={{marginBottom: '0.5rem'}}>
                        {wi.used_hours?.toFixed(1) || 0}h / {wi.total_budget_hours?.toFixed(1) || 0}h
                    </div>
                    <ProgressBar
                        value={usedPercent}
                        max={100}
                        label=""
                        size="small"
                        status={usedPercent > 90 ? 'error' : usedPercent > 75 ? 'warning' : 'success'}
                    />
                </div>
            ),
            actions: (
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <Button
                        kind="ghost"
                        size="sm"
                        hasIconOnly
                        renderIcon={Edit}
                        iconDescription="Editar"
                        onClick={() => onEdit(wi)}
                    />
                    <Button
                        kind="danger--ghost"
                        size="sm"
                        hasIconOnly
                        renderIcon={TrashCan}
                        iconDescription="Excluir"
                        onClick={() => onDelete(wi.ID)}
                    />
                </div>
            ),
            onClick: () => onSelectProject(wi)
        };
    });

    return (
        <Grid fullWidth>
            <Column sm={4} md={8} lg={16}>
                <div style={{marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                    <TextInput
                        id="search-input"
                        labelText=""
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="lg"
                        style={{maxWidth: '400px'}}
                    />
                    
                    <ContentSwitcher
                        selectedIndex={['all', 'active', 'completed', 'on_hold'].indexOf(statusFilter)}
                        onChange={(e) => {
                            const statuses = ['all', 'active', 'completed', 'on_hold'];
                            setStatusFilter(statuses[e.index]);
                        }}
                    >
                        <Switch name="all" text="Todos" />
                        <Switch name="active" text="Ativos" />
                        <Switch name="completed" text="Completos" />
                        <Switch name="on_hold" text="On Hold" />
                    </ContentSwitcher>

                    <span style={{fontSize: '13px', color: 'var(--cds-text-02)'}}>
                        {filteredWorkItems.length} {filteredWorkItems.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
                    </span>
                </div>
            </Column>

            <Column sm={4} md={8} lg={16}>
                <div style={{minHeight: '500px'}}>
                    <DataTable rows={rows} headers={headers}>
                        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                            <TableContainer>
                                <Table {...getTableProps()}>
                                <TableHead>
                                    <TableRow>
                                        {headers.map(header => (
                                            <TableHeader {...getHeaderProps({ header })} key={header.key}>
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.length > 0 ? (
                                        rows.map((row, idx) => {
                                            const workItem = filteredWorkItems[idx];
                                            return (
                                                <TableRow
                                                    {...getRowProps({ row })}
                                                    key={row.id}
                                                    style={{cursor: 'pointer'}}
                                                    onClick={(e) => {
                                                        // Não acionar o clique se for nos botões de ação
                                                        if (e.target.closest('button')) return;
                                                        onSelectProject(workItem);
                                                    }}
                                                >
                                                    {row.cells.map(cell => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={headers.length} style={{textAlign: 'center', padding: '2rem', color: 'var(--cds-text-02)'}}>
                                                Nenhum projeto encontrado
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </DataTable>
                </div>
            </Column>
        </Grid>
    );
};

const PMEditProject = ({ project, onCancel, onSave }) => {
    const [form, setForm] = useState({
        description: project.description || '',
        total_budget: project.total_budget_hours || 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(project.ID, form);
    };

    return (
        <Grid fullWidth>
            <Column sm={4} md={8} lg={16}>
                <div style={{marginBottom: '2rem'}}>
                    <Button
                        kind="ghost"
                        size="sm"
                        renderIcon={ChevronLeft}
                        onClick={onCancel}
                    >
                        Voltar
                    </Button>
                </div>
            </Column>

            <Column sm={4} md={8} lg={16}>
                <h2>Editar Projeto: {project.wi_code}</h2>
            </Column>

            <Column sm={4} md={8} lg={16}>
                <form onSubmit={handleSubmit}>
                    <Grid narrow>
                        <Column sm={4} md={8} lg={16}>
                            <TextInput
                                id="description"
                                labelText="Descrição"
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                                required
                            />
                        </Column>

                        <Column sm={4} md={4} lg={8}>
                            <TextInput
                                id="total-budget"
                                labelText="Budget Total (horas)"
                                type="number"
                                step="0.1"
                                value={form.total_budget}
                                onChange={(e) => setForm({...form, total_budget: e.target.value})}
                                required
                            />
                        </Column>

                        <Column sm={4} md={8} lg={16}>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <Button type="submit" kind="primary">
                                    Salvar Alterações
                                </Button>
                                <Button kind="secondary" onClick={onCancel}>
                                    Cancelar
                                </Button>
                            </div>
                        </Column>
                    </Grid>
                </form>
            </Column>
        </Grid>
    );
};

const ProjectDetail = ({ project, entries, logs, onBack, projectTab, setProjectTab }) => {
    if (!project) return null;

    const [periodFilter, setPeriodFilter] = useState('todos');

    const usedPercent = project.total_budget_hours > 0
        ? (project.used_hours / project.total_budget_hours) * 100
        : 0;

    // Função para filtrar entradas por período
    const filterEntriesByPeriod = (entries) => {
        if (!entries || entries.length === 0) return [];
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return entries.filter(entry => {
            const entryDate = new Date(entry.date);
            
            switch(periodFilter) {
                case 'hoje':
                    return entryDate >= today;
                case 'semana':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate >= weekAgo;
                case 'mes':
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return entryDate >= monthAgo;
                case 'todos':
                default:
                    return true;
            }
        });
    };

    const filteredEntries = filterEntriesByPeriod(entries);

    return (
        <div>
            {/* Header com botão voltar e botão de ação */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <Button
                    kind="secondary"
                    size="sm"
                    onClick={onBack}
                    style={{
                        border: '1px solid var(--cds-border-strong-01)',
                        paddingLeft: '0.75rem',
                        paddingRight: '0.75rem'
                    }}
                >
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <ChevronLeft size={16} />
                        <span>Voltar</span>
                    </div>
                </Button>
                <Button
                    kind="primary"
                    size="md"
                >
                    Gerar Planilha
                </Button>
            </div>

            {/* Card Principal do Projeto - Carbon Design System */}
            <Tile className="project-detail-card" style={{
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid var(--cds-border-subtle-01)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Título do Projeto */}
                <div style={{marginBottom: '2rem'}}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: 'var(--cds-text-01)',
                        letterSpacing: '-0.5px'
                    }}>
                        {project.description}
                    </h1>
                    <div style={{
                        fontSize: '14px',
                        color: 'var(--cds-text-02)',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {project.wi_code}
                    </div>
                </div>

                {/* Separador Visual */}
                <div style={{
                    height: '1px',
                    background: 'var(--cds-border-subtle-01)',
                    marginBottom: '2rem'
                }} />

                {/* Barra de Progresso Grande */}
                <div style={{
                    background: 'var(--cds-layer-02)',
                    padding: '1.5rem',
                    borderRadius: '4px',
                    marginBottom: '2rem',
                    border: '1px solid var(--cds-border-subtle-01)'
                }}>
                    <ProgressBar
                        value={usedPercent}
                        max={100}
                        label=""
                        size="big"
                        status={usedPercent > 90 ? 'error' : usedPercent > 75 ? 'warning' : 'success'}
                    />
                </div>

                {/* Indicadores de Utilização - TAMANHO GRANDE */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    marginBottom: '1rem'
                }}>
                    {/* Card de Utilização */}
                    <div style={{
                        background: 'var(--cds-layer-accent-01)',
                        padding: '1.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--cds-border-subtle-01)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--cds-text-02)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '0.75rem'
                        }}>
                            Utilização do Budget
                        </div>
                        <div style={{
                            fontSize: '48px',
                            fontWeight: '300',
                            color: usedPercent > 90 ? 'var(--cds-support-error)' : usedPercent > 75 ? 'var(--cds-support-warning)' : 'var(--cds-support-success)',
                            lineHeight: '1',
                            letterSpacing: '-1px'
                        }}>
                            {usedPercent.toFixed(1)}%
                        </div>
                    </div>

                    {/* Card de Horas */}
                    <div style={{
                        background: 'var(--cds-layer-accent-01)',
                        padding: '1.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--cds-border-subtle-01)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--cds-text-02)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '0.75rem'
                        }}>
                            Horas Consumidas
                        </div>
                        <div style={{
                            fontSize: '48px',
                            fontWeight: '300',
                            color: 'var(--cds-interactive-01)',
                            lineHeight: '1',
                            letterSpacing: '-1px'
                        }}>
                            {project.used_hours?.toFixed(1) || 0}h
                            <span style={{
                                fontSize: '24px',
                                color: 'var(--cds-text-02)',
                                fontWeight: '400',
                                marginLeft: '0.5rem'
                            }}>
                                / {project.total_budget_hours?.toFixed(1) || 0}h
                            </span>
                        </div>
                    </div>
                </div>
            </Tile>

            {/* Tabs Section - Enhanced with Cards */}
            <Tile style={{
                padding: '2rem',
                border: '1px solid var(--cds-border-subtle-01)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <Tabs>
                    <TabList aria-label="Detalhes do projeto">
                        <Tab onClick={() => setProjectTab('dashboard')}>Dashboard</Tab>
                        <Tab onClick={() => setProjectTab('logs')}>Logs</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {/* Filtros de Período - Card Style */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1.5rem',
                                background: 'var(--cds-layer-accent-01)',
                                borderRadius: '4px',
                                border: '1px solid var(--cds-border-subtle-01)',
                                marginTop: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <span style={{fontSize: '14px', fontWeight: 600, color: 'var(--cds-text-02)'}}>
                                    Filtrar por:
                                </span>
                                <ContentSwitcher
                                    selectedIndex={['todos', 'hoje', 'semana', 'mes'].indexOf(periodFilter)}
                                    onChange={(e) => {
                                        const filters = ['todos', 'hoje', 'semana', 'mes'];
                                        setPeriodFilter(filters[e.index]);
                                    }}
                                    size="sm"
                                >
                                    <Switch name="todos" text="Todos" />
                                    <Switch name="hoje" text="Hoje" />
                                    <Switch name="semana" text="Última Semana" />
                                    <Switch name="mes" text="Último Mês" />
                                </ContentSwitcher>
                                <span style={{fontSize: '14px', color: 'var(--cds-text-02)', marginLeft: 'auto'}}>
                                    {filteredEntries?.length || 0} entradas
                                </span>
                            </div>

                            {/* Table Section with Enhanced Header */}
                            <div>
                                <h4 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    marginBottom: '1.5rem',
                                    color: 'var(--cds-text-01)',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid var(--cds-border-subtle-01)'
                                }}>
                                    Lançamentos Recentes
                                </h4>
                            {filteredEntries && filteredEntries.length > 0 ? (
                                <DataTable
                                    rows={filteredEntries.map((e, idx) => ({
                                        id: idx.toString(),
                                        date: new Date(e.date).toLocaleDateString('pt-BR'),
                                        professional: e.employee_name || 'N/A',
                                        start: e.start_time || '-',
                                        end: e.end_time || '-',
                                        clock: e.manual_hours ? `${e.manual_hours.toFixed(1)}h` : '-',
                                        rate: e.rate_multiplier ? `${e.rate_multiplier}x` : '1.0x',
                                        hours: e.hours_billable ? `${e.hours_billable.toFixed(1)}h` : '-',
                                        activity: e.description || '-'
                                    }))}
                                    headers={[
                                        { key: 'date', header: 'Data' },
                                        { key: 'professional', header: 'Profissional' },
                                        { key: 'start', header: 'Início' },
                                        { key: 'end', header: 'Fim' },
                                        { key: 'clock', header: 'Relógio' },
                                        { key: 'rate', header: 'Rate' },
                                        { key: 'hours', header: 'Horas' },
                                        { key: 'activity', header: 'Atividade' }
                                    ]}
                                >
                                    {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                                        <TableContainer>
                                            <Table {...getTableProps()} size="sm">
                                                <TableHead>
                                                    <TableRow>
                                                        {headers.map(header => (
                                                            <TableHeader {...getHeaderProps({ header })} key={header.key}>
                                                                {header.header}
                                                            </TableHeader>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map(row => (
                                                        <TableRow {...getRowProps({ row })} key={row.id}>
                                                            {row.cells.map(cell => (
                                                                <TableCell key={cell.id}>{cell.value}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </DataTable>
                            ) : (
                                <p>Nenhum lançamento encontrado.</p>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div style={{padding: '1rem 0'}}>
                            <h4 style={{marginBottom: '1rem'}}>Histórico de Alterações</h4>
                            {logs && logs.filter(log => log.details && log.details.includes(project.wi_code)).length > 0 ? (
                                <DataTable
                                    rows={logs.filter(log => log.details && log.details.includes(project.wi_code)).map((log, idx) => ({
                                        id: idx.toString(),
                                        timestamp: new Date(log.timestamp).toLocaleString(),
                                        user: log.user_name,
                                        action: log.action
                                    }))}
                                    headers={[
                                        { key: 'timestamp', header: 'Data/Hora' },
                                        { key: 'user', header: 'Usuário' },
                                        { key: 'action', header: 'Ação' }
                                    ]}
                                >
                                    {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                                        <TableContainer>
                                            <Table {...getTableProps()} size="sm">
                                                <TableHead>
                                                    <TableRow>
                                                        {headers.map(header => (
                                                            <TableHeader {...getHeaderProps({ header })} key={header.key}>
                                                                {header.header}
                                                            </TableHeader>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map(row => (
                                                        <TableRow {...getRowProps({ row })} key={row.id}>
                                                            {row.cells.map(cell => (
                                                                <TableCell key={cell.id}>{cell.value}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </DataTable>
                            ) : (
                                <p>Nenhum log encontrado para este projeto.</p>
                            )}
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            </Tile>
        </div>
    );
};

function App() {
  const [currentUser, setCurrentUser] = useState(USERS.PM)
  const [workItems, setWorkItems] = useState([])
  const [logs, setLogs] = useState([])
  const [message, setMessage] = useState(null)
  const [pmView, setPmView] = useState('list')
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectEntries, setProjectEntries] = useState([])
  const [projectTab, setProjectTab] = useState('dashboard')
  const [form, setForm] = useState({
    work_item_id: '', 
    date: new Date().toISOString().split('T')[0], 
    start_time: '09:00', 
    end_time: '18:00', 
    manual_hours: '', 
    description: ''
  })
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalText, setModalText] = useState("");

  useEffect(() => { 
    if (workItems.length > 0 && !form.work_item_id) 
      setForm(prev => ({...prev, work_item_id: workItems[0].ID})) 
  }, [workItems])
  
  useEffect(() => { fetchData() }, [currentUser])
  useEffect(() => { 
    if (selectedProject && pmView === 'detail') 
      fetchProjectDetails(selectedProject.ID) 
  }, [selectedProject, pmView])

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/workitems`)
      if (Array.isArray(res.data)) {
        setWorkItems(res.data)
      } else {
        console.error("Invalid workitems response", res.data);
        setWorkItems([])
      }
      if (currentUser.role === 'PM') {
          const l = await axios.get(`${API_URL}/audit-logs`)
          setLogs(Array.isArray(l.data) ? l.data : [])
      }
    } catch (e) { console.error(e) }
  }

  const fetchProjectDetails = async (id) => { 
    try { 
      const res = await axios.get(`${API_URL}/workitems/${id}/details`); 
      setProjectEntries(res.data) 
    } catch (e) {
      console.error(e)
    } 
  }

  const parseNumber = (val) => { 
    if (!val) return 0; 
    if (typeof val === 'number') return val; 
    return parseFloat(val.toString().replace(',', '.')) || 0; 
  }

  const handleLaunchHours = async (e) => {
    e.preventDefault()
    if (!form.work_item_id) return
    try {
      await axios.post(`${API_URL}/entries`, {
        employee_id: currentUser.id, 
        work_item_id: parseInt(form.work_item_id), 
        date: form.date, 
        start_time: form.start_time, 
        end_time: form.end_time, 
        manual_hours: parseNumber(form.manual_hours), 
        description: form.description
      })
      setMessage({ type: 'success', text: 'Sucesso!' }); 
      fetchData(); 
      setForm(p => ({...p, description: '', manual_hours: ''}))
    } catch (e) { 
      setMessage({ type: 'error', text: e.response?.data?.error || "Erro ao salvar" }) 
    }
  }

  const handleEditProject = async (id, updatedData) => {
      try { 
        await axios.put(`${API_URL}/workitems/${id}`, { 
          description: updatedData.description, 
          total_budget: parseFloat(updatedData.total_budget) 
        }); 
        setMessage({ type: 'success', text: 'Editado!' }); 
        setPmView('list'); 
        fetchData() 
      } catch (e) { 
        setMessage({ type: 'error', text: "Erro." }) 
      }
  }

  const confirmDelete = (id) => {
      setModalText("Tem certeza que deseja excluir este projeto? Todo o histórico será perdido.");
      setModalAction(() => async () => {
          try { 
            await axios.delete(`${API_URL}/workitems/${id}`); 
            setMessage({ type: 'success', text: 'Excluído!' }); 
            fetchData(); 
            setModalOpen(false); 
          } catch (e) { 
            setMessage({ type: 'error', text: "Erro." }); 
            setModalOpen(false); 
          }
      });
      setModalOpen(true);
  }

  return (
    <div className="sgh-container">
      <ConfirmModal 
        isOpen={modalOpen} 
        title="Excluir Projeto" 
        message={modalText} 
        onConfirm={modalAction} 
        onCancel={() => setModalOpen(false)} 
      />
      <Header 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        setPmView={setPmView} 
      />
      <main style={{paddingTop: '3rem'}}>
        <Grid fullWidth>
          {message && (
            <Column sm={4} md={8} lg={16}>
              <InlineNotification
                kind={message.type === 'error' ? 'error' : 'success'}
                title={message.type === 'error' ? 'Erro' : 'Sucesso'}
                subtitle={message.text}
                onCloseButtonClick={() => setMessage(null)}
                style={{marginBottom: '1rem'}}
              />
            </Column>
          )}
          
          <Column sm={4} md={8} lg={16}>
            <div className="projects-container">
                {currentUser.role === 'PM' ? (
                    <>
                        <div className="projects-header" style={{marginBottom: '3rem', paddingTop: '1rem'}}>
                          <h1 style={{
                            fontSize: '48px',
                            fontWeight: '400',
                            lineHeight: '1.2',
                            color: 'var(--cds-text-01)',
                            margin: 0
                          }}>
                            Gestão de Projetos
                          </h1>
                        </div>
                        {pmView === 'list' && (
                          <PMDashboard 
                            workItems={workItems} 
                            onSelectProject={(wi) => { 
                              setSelectedProject(wi); 
                              setProjectTab('dashboard'); 
                              setPmView('detail'); 
                            }} 
                            onEdit={(wi) => { 
                              setSelectedProject(wi); 
                              setPmView('edit'); 
                            }} 
                            onDelete={confirmDelete} 
                          />
                        )}
                        {pmView === 'detail' && (
                          <ProjectDetail 
                            project={workItems.find(w => w.ID === selectedProject?.ID) || selectedProject} 
                            entries={projectEntries} 
                            logs={logs} 
                            onBack={() => setPmView('list')} 
                            projectTab={projectTab} 
                            setProjectTab={setProjectTab} 
                          />
                        )}
                        {pmView === 'edit' && selectedProject && (
                          <PMEditProject 
                            project={selectedProject} 
                            onCancel={() => setPmView('list')} 
                            onSave={handleEditProject} 
                          />
                        )}
                    </>
                ) : (
                    <>
                        <div className="projects-header" style={{marginBottom: '3rem', paddingTop: '1rem'}}>
                          <h1 style={{
                            fontSize: '48px',
                            fontWeight: '400',
                            lineHeight: '1.2',
                            color: 'var(--cds-text-01)',
                            margin: 0
                          }}>
                            Portal do Técnico
                          </h1>
                        </div>
                        <ErrorBoundary>
                            <TechWeeklyView
                              currentUser={currentUser}
                              workItems={workItems}
                            />
                        </ErrorBoundary>
                    </>
                )}
            </div>
          </Column>
        </Grid>
      </main>
    </div>
  )
}

export default App
