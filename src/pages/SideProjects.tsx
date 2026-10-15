import { personalProjects, SIDE_PROJECT_IDS } from '../data/projects'
import { ProjectBlock, byRecency } from './Portfolio'

const SideProjects = () => {
  const sideProjects = personalProjects.filter((p) => SIDE_PROJECT_IDS.includes(p.id))

  return (
    <>
      <h1>Side Projects</h1>
      <p>Experiments in wiring AI agents together to do real work on their own.</p>
      {[...sideProjects].sort(byRecency).map((project) => (
        <ProjectBlock key={project.id} project={project} />
      ))}
    </>
  )
}

export default SideProjects
