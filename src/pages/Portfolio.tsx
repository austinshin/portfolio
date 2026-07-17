import { professionalProjects, personalProjects, Project } from '../data/projects'

const ProjectBlock = ({ project }: { project: Project }) => (
  <div className="item-block">
    <div className="item-header">
      <h3>{project.title}</h3>
      {project.period && <span className="item-period">{project.period}</span>}
    </div>
    {project.company && <div className="item-sub">{project.company}</div>}
    <ul>
      {project.description.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
    {(project.demoUrl || project.githubUrl) && (
      <p>
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Live demo
          </a>
        )}
        {project.demoUrl && project.githubUrl && ' · '}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
      </p>
    )}
    <div className="tag-row">
      {project.tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  </div>
)

const Portfolio = () => {
  return (
    <>
      <h1>Portfolio</h1>

      <h2>Professional</h2>
      {professionalProjects.map((project) => (
        <ProjectBlock key={project.id} project={project} />
      ))}

      <h2>Personal</h2>
      {personalProjects.map((project) => (
        <ProjectBlock key={project.id} project={project} />
      ))}
    </>
  )
}

export default Portfolio
