import { professionalProjects, personalProjects, Project } from '../data/projects'

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
}

// Parses "May 2018 - Jan 2021", "Feb 2025 - Present", "2026" into sortable dates
function parsePeriod(period?: string): { start: number; end: number } {
  if (!period) return { start: 0, end: 0 }
  const parts = period.split('-').map((p) => p.trim())
  const parseOne = (text: string, isEnd: boolean): number => {
    if (/present/i.test(text)) return Number.MAX_SAFE_INTEGER
    const monthMatch = text.match(/([A-Za-z]{3,})\s+(\d{4})/)
    if (monthMatch) {
      const month = MONTHS[monthMatch[1].slice(0, 3).toLowerCase()] ?? 0
      return new Date(Number(monthMatch[2]), month).getTime()
    }
    const yearMatch = text.match(/(\d{4})/)
    if (yearMatch) return new Date(Number(yearMatch[1]), isEnd ? 11 : 0).getTime()
    return 0
  }
  const start = parseOne(parts[0], false)
  const end = parts.length > 1 ? parseOne(parts[1], true) : parseOne(parts[0], true)
  return { start, end }
}

// Newest first: ongoing projects lead (most recently started first),
// finished projects follow by how recently they ended
function byRecency(a: Project, b: Project): number {
  const pa = parsePeriod(a.period)
  const pb = parsePeriod(b.period)
  if (pb.end !== pa.end) return pb.end - pa.end
  return pb.start - pa.start
}

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
      {[...professionalProjects].sort(byRecency).map((project) => (
        <ProjectBlock key={project.id} project={project} />
      ))}

      <h2>Personal</h2>
      {[...personalProjects].sort(byRecency).map((project) => (
        <ProjectBlock key={project.id} project={project} />
      ))}
    </>
  )
}

export default Portfolio
