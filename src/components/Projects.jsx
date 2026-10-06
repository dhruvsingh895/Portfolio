import { lazy, Suspense, useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Github } from './BrandIcons';
import { moreProjects, profile, projects } from '../data';
import { ExternalLink, SectionLabel, TextLink } from './UI';
import ProjectArt from './ProjectArt';
import TiltButton from './TiltButton';
import ProjectWorlds from './ProjectWorlds';

const ProjectDetail = lazy(() => import('./ProjectDetail'));

export default function Projects() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="work" className="work section-shell" aria-labelledby="work-title">
      <div className="section-heading" data-reveal>
        <div>
          <SectionLabel number="02">SELECTED WORK / 2025—2026</SectionLabel>
          <h2 id="work-title">
            Ideas into <span className="serif-accent">impact.</span>
          </h2>
        </div>
        <p>
          A few things I’ve built.
          <br />
          Each one, a different kind of challenge.
        </p>
      </div>
      <ProjectWorlds />
      <div className="project-grid">
        {projects.map((project, index) => (
          <article
            className={`project-card ${index === 0 ? 'featured-project' : ''}`}
            key={project.id}
            data-reveal
          >
            <TiltButton
              className="project-art-button"
              onClick={() => setSelected(project)}
              aria-label={`Read the ${project.name} case study`}
              data-cursor="VIEW"
            >
              <ProjectArt id={project.id} />
              <span className="project-open">
                <ArrowUpRight size={24} />
              </span>
            </TiltButton>
            <div className="project-info">
              <div>
                <div className="project-category mono">
                  <span>{project.number} /</span> {project.category}
                </div>
                <button className="project-title" onClick={() => setSelected(project)}>
                  {project.name}
                  <ArrowUpRight size={24} />
                </button>
                <p>{project.description}</p>
              </div>
              <div className="project-info-right">
                <div className="tech-tags">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <button className="inline-link" onClick={() => setSelected(project)}>
                    Case study <Plus size={15} />
                  </button>
                  <ExternalLink
                    href={project.github}
                    aria-label={`${project.name} source on GitHub`}
                  >
                    <Github size={16} />
                  </ExternalLink>
                  <ExternalLink href={project.demo} className="inline-link">
                    {project.demoLabel || 'Live demo'} <ArrowUpRight size={15} />
                  </ExternalLink>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="more-work" data-reveal>
        <span className="mono">MORE FROM THE WORKBENCH</span>
        {moreProjects.map((project) => (
          <ExternalLink className="archive-project" href={project.url} key={project.name}>
            <span>{project.name}</span>
            <span className="mono">{project.type}</span>
            <ArrowUpRight size={20} />
          </ExternalLink>
        ))}
        <TextLink href={profile.github}>
          Explore all repositories <Github size={15} />
        </TextLink>
      </div>
      {selected && (
        <Suspense
          fallback={
            <div className="detail-loading" role="status">
              Opening case study…
            </div>
          }
        >
          <ProjectDetail project={selected} onClose={() => setSelected(null)} />
        </Suspense>
      )}
    </section>
  );
}
