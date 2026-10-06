import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { Github } from './BrandIcons';
import ProjectArt from './ProjectArt';
import { ExternalLink } from './UI';

export default function ProjectDetail({ project, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    document.documentElement.classList.add('modal-open');
    window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: true }));
    return () => {
      element.close();
      document.documentElement.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: false }));
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="detail-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      data-lenis-prevent
    >
      <div className="dialog-content">
        <div className="dialog-top">
          <span className="mono">PROJECT {project.number} / A CLOSER LOOK</span>
          <button
            className="dialog-close"
            aria-label="Close case study"
            onClick={onClose}
            autoFocus
          >
            <X size={21} />
          </button>
        </div>
        <div className="dialog-heading">
          <span className="mono">
            {project.category} · {project.date}
          </span>
          <h2 id="detail-title">
            {project.name}
            <span>.</span>
          </h2>
          <p>{project.fullName}</p>
        </div>
        <ProjectArt id={project.id} />
        <div className="dialog-metrics">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
        <div className="case-study-text">
          {[
            ['The challenge', project.challenge],
            ['The approach', project.approach],
            ['The outcome', project.outcome],
          ].map(([heading, copy], i) => (
            <div key={heading}>
              <span className="mono">0{i + 1}</span>
              <div>
                <h3>{heading}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="tech-tags">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="dialog-actions">
          <ExternalLink className="button button-primary" href={project.demo}>
            {project.demoLabel || 'Explore live demo'}
            <ArrowUpRight size={18} />
          </ExternalLink>
          <ExternalLink className="button button-outline" href={project.github}>
            <Github size={17} />
            View source
          </ExternalLink>
        </div>
        <p className="dialog-note">
          Project figures are from my résumé and repository documentation. Visual previews are
          illustrative interface studies.
        </p>
      </div>
    </dialog>
  );
}
