import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Erro ao buscar projetos');
        }
        return res.json()
      })
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="loading">Carregando projetos...</div>
  if (error) return <div className="error">Erro: {error}</div>

  return (
    <div className="container">
      <h1>Gerenciamento de Projetos</h1>
      
      {projects.length === 0 ? (
        <p>Nenhum projeto encontrado.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project._id || index} className="project-card">
              <h2>{project.name || 'Projeto Sem Nome'}</h2>
              <div className="project-info">
                <p><strong>Status:</strong> <span className={`status ${project.status?.toLowerCase()}`}>{project.status || 'N/A'}</span></p>
                <p><strong>Responsável:</strong> {project.responsible || project.owner || 'Não atribuído'}</p>
                {project.description && <p className="description">{project.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
