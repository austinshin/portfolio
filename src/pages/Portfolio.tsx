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
    {(project.demoUrl || project.githubUrl || project.docsUrl) && (
      <p>
        {[
          project.demoUrl && { label: 'Live demo', url: project.demoUrl },
          project.githubUrl && { label: 'GitHub', url: project.githubUrl },
          project.docsUrl && { label: 'API docs', url: project.docsUrl },
        ]
          .filter((link): link is { label: string; url: string } => Boolean(link))
          .map((link, i) => (
            <span key={link.label}>
              {i > 0 && ' · '}
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </span>
          ))}
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
