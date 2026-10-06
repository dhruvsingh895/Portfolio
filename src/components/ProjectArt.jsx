import {
  ArrowUpRight,
  Bell,
  Check,
  Circle,
  Command,
  LayoutDashboard,
  Search,
  Sparkles,
  Users,
  Layers3,
  Armchair,
  BarChart3,
  Plus,
  MoreHorizontal,
  Calendar,
  ChevronDown,
} from 'lucide-react';

function BrowserBar({ title }) {
  return (
    <div className="browser-bar">
      <div className="browser-dots">
        <i />
        <i />
        <i />
      </div>
      <span>{title}</span>
      <ArrowUpRight size={11} />
    </div>
  );
}

export function EtharaArt() {
  return (
    <div className="project-art ethara-art" aria-hidden="true">
      <div className="art-grid" />
      <div className="art-brand">
        <span className="ethara-symbol">s</span>
        <span className="seat-brand-name">Seat Allocation System</span>
        <span className="art-brand-sub">SPACE, INTELLIGENTLY ALLOCATED.</span>
      </div>
      <div className="ethara-orbit" />
      <div className="browser-mock ethara-mock">
        <BrowserBar title="seat allocation system / workspace overview" />
        <div className="dashboard-shell">
          <aside className="mock-sidebar">
            <div className="mock-logo">
              <span className="ethara-symbol">s</span>
              <span className="seat-logo-name">
                Seat Allocation
                <br />
                System
              </span>
            </div>
            <div className="mock-workspace">
              Engineering HQ <ChevronDown size={10} />
            </div>
            <small>WORKSPACE</small>
            {[
              [LayoutDashboard, 'Overview'],
              [Armchair, 'Seat allocation'],
              [Users, 'Employees'],
              [Layers3, 'Projects'],
              [BarChart3, 'Analytics'],
            ].map(([Icon, label], i) => (
              <div className={i === 0 ? 'selected' : ''} key={label}>
                <Icon size={12} />
                {label}
              </div>
            ))}
            <div className="mock-ai">
              <Sparkles size={12} /> Ask Allocation AI
            </div>
            <div className="mock-user">
              <span>DS</span>
              <div>
                Dhruv Singh<small>Administrator</small>
              </div>
            </div>
          </aside>
          <div className="mock-dashboard">
            <div className="mock-topbar">
              <span>
                Workspace / <b>Overview</b>
              </span>
              <div>
                <Search size={12} />
                <Bell size={12} />
                <span className="mock-avatar">DS</span>
              </div>
            </div>
            <div className="mock-heading">
              <div>
                <h4>Your workspace, at a glance.</h4>
                <p>Good morning, Dhruv. Let’s make room for great work.</p>
              </div>
              <span>+ Allocate seat</span>
            </div>
            <div className="mock-stats">
              {[
                ['Total employees', '5,000', 'Across all departments'],
                ['Seat utilization', '85%', 'Space, put to good use'],
                ['Active projects', '30', 'Teams moving forward'],
              ].map(([label, value, note]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>
                    {value}
                    <span>↗</span>
                  </strong>
                  <p>{note}</p>
                </div>
              ))}
            </div>
            <div className="mock-widgets">
              <div className="seat-panel">
                <div className="mock-panel-title">
                  Live seat map <span>Floor 01⌄</span>
                </div>
                <div className="seat-grid">
                  {Array.from({ length: 96 }, (_, i) => (
                    <i
                      key={i}
                      className={i % 7 === 0 ? 'empty-seat' : i % 11 === 0 ? 'reserved-seat' : ''}
                    />
                  ))}
                </div>
                <div className="seat-legend">
                  <span>
                    <i />
                    Occupied
                  </span>
                  <span>
                    <i />
                    Available
                  </span>
                  <span>
                    <i />
                    Reserved
                  </span>
                </div>
              </div>
              <div className="utilization-panel">
                <div className="mock-panel-title">By department</div>
                {[
                  ['Engineering', 87],
                  ['Product', 65],
                  ['Design', 51],
                  ['Operations', 72],
                  ['People', 42],
                ].map(([label, size]) => (
                  <div className="department-bar" key={label}>
                    <span>
                      {label}
                      <b>{size}%</b>
                    </span>
                    <div>
                      <i style={{ width: `${size}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mock-ai-prompt">
              <Sparkles size={13} />
              <span>Ask anything about your workspace...</span>
              <span>↵</span>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-metric">
        <span className="metric-dot" />
        <div>
          <span>DESIGNED FOR</span>
          <strong>5,000 people.</strong>
        </div>
        <ArrowUpRight size={26} />
      </div>
      <span className="preview-label">INTERFACE STUDY / 01</span>
    </div>
  );
}

export function VisionArt() {
  const cars = [
    { x: 201, y: 181, w: 35, h: 60, c: '#b4b8bf', id: '012', label: 'CAR 0.92' },
    { x: 283, y: 71, w: 34, h: 62, c: '#535b66', id: '009', label: 'CAR 0.88' },
    { x: 368, y: 195, w: 43, h: 87, c: '#acada8', id: '018', label: 'BUS 0.94' },
    { x: 455, y: 124, w: 34, h: 58, c: '#6d7d8a', id: '021', label: 'CAR 0.91' },
  ];
  return (
    <div className="project-art vision-art" aria-hidden="true">
      <div className="vision-topline">
        <span>
          <span className="record-dot" /> TRAFFIC VISION
        </span>
        <span>CAM_01 · INFERENCE VIEW</span>
      </div>
      <svg className="traffic-feed" viewBox="0 0 650 380" fill="none">
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="650" y2="380">
            <stop stopColor="#202a2c" />
            <stop offset="1" stopColor="#0f171c" />
          </linearGradient>
          <linearGradient id="feedShade">
            <stop stopColor="#0b151b" stopOpacity=".5" />
            <stop offset=".55" stopColor="#101715" stopOpacity="0" />
            <stop offset="1" stopColor="#070e0e" stopOpacity=".6" />
          </linearGradient>
          <pattern id="roadGrain" width="7" height="9" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r=".5" fill="#94a7a8" opacity=".12" />
          </pattern>
        </defs>
        <rect width="650" height="380" fill="#14201e" />
        <path d="M139 0h417l43 380H97z" fill="url(#road)" />
        <path d="M130 0L87 380M565 0l43 380" stroke="#516254" strokeWidth="12" />
        <path d="M150 0l-34 380M546 0l29 380" stroke="#bdc0a1" strokeWidth="2" opacity=".35" />
        <path
          d="M248 0l-15 380M441 0l17 380"
          stroke="#d3d6cf"
          strokeDasharray="27 27"
          opacity=".24"
          strokeWidth="3"
        />
        <path d="M340 0v380M348 0v380" stroke="#b3ab75" opacity=".4" strokeWidth="2" />
        <rect width="650" height="380" fill="url(#roadGrain)" />
        <g opacity=".3" fill="#2b4f3f">
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={i % 2 ? 617 : 37} cy={i * 31} r={24 + (i % 4) * 5} />
          ))}
        </g>
        <path d="M114 284h464" stroke="#abb4c0" strokeDasharray="7 5" opacity=".85" />
        <text x="121" y="301" fill="#cbd2da" fontSize="8" fontFamily="monospace">
          COUNTING LINE
        </text>
        {cars.map((car) => (
          <g key={car.id} className={`detected-car car-${car.id}`}>
            <rect
              x={car.x + 4}
              y={car.y + 5}
              width={car.w}
              height={car.h}
              rx="7"
              fill="#000"
              opacity=".6"
            />
            <rect x={car.x} y={car.y} width={car.w} height={car.h} rx="7" fill={car.c} />
            <rect
              x={car.x + 4}
              y={car.y + 11}
              width={car.w - 8}
              height="11"
              rx="3"
              fill="#182c34"
            />
            <rect
              x={car.x + 5}
              y={car.y + car.h - 16}
              width={car.w - 10}
              height="8"
              rx="2"
              fill="#253640"
            />
            <rect
              x={car.x - 8}
              y={car.y - 9}
              width={car.w + 16}
              height={car.h + 18}
              stroke="#c5cbd2"
              strokeWidth="1.3"
            />
            <rect x={car.x - 8} y={car.y - 23} width="70" height="13" fill="#c5cbd2" />
            <text x={car.x - 4} y={car.y - 14} fill="#10211c" fontSize="8" fontFamily="monospace">
              {car.label}
            </text>
            <path
              d={`M${car.x + car.w / 2} ${car.y + car.h + 9}v24`}
              stroke="#c5cbd2"
              strokeDasharray="3 3"
            />
            <circle cx={car.x + car.w / 2} cy={car.y + car.h / 2} r="2" fill="#c5cbd2" />
          </g>
        ))}
        <rect width="650" height="380" fill="url(#feedShade)" />
      </svg>
      <div className="vision-scan" />
      <div className="vision-hud">
        <span>
          <b>
            85<span>%</span>
          </b>
          DETECTION ACCURACY
        </span>
        <span>
          <b>
            1,000<span>+</span>
          </b>
          FRAMES / MINUTE
        </span>
        <div className="hud-crosshair">⌖</div>
      </div>
      <span className="preview-label">PIPELINE VISUALIZATION / 02</span>
    </div>
  );
}

export function TaskflowArt() {
  const columns = [
    {
      title: 'To do',
      count: 4,
      tasks: [
        {
          tag: 'DESIGN',
          title: 'Design system foundations',
          description: 'Build once. Create consistently.',
          color: 'purple',
        },
        {
          tag: 'BACKEND',
          title: 'Connect the dots',
          description: 'Integrate the task API.',
          color: 'blue',
        },
      ],
    },
    {
      title: 'In progress',
      count: 2,
      tasks: [
        {
          tag: 'DEVELOPMENT',
          title: 'Build something meaningful',
          description: 'One focused task at a time.',
          color: 'purple',
        },
        {
          tag: 'PRODUCT',
          title: 'Make the details count',
          description: 'Refine the little interactions.',
          color: 'orange',
        },
      ],
    },
    {
      title: 'Done',
      count: 8,
      tasks: [
        {
          tag: 'AUTH',
          title: 'A secure foundation',
          description: 'Authentication, sorted.',
          color: 'green',
        },
        {
          tag: 'PLANNING',
          title: 'From idea to action',
          description: 'Set the direction.',
          color: 'blue',
        },
      ],
    },
  ];
  return (
    <div className="project-art taskflow-art" aria-hidden="true">
      <div className="taskflow-art-title">
        <Command size={27} />
        <span>taskflow</span>
        <span className="taskflow-motto">MAKE ROOM FOR FOCUS.</span>
      </div>
      <div className="browser-mock taskflow-mock">
        <BrowserBar title="taskflow / my workspace" />
        <div className="taskflow-nav">
          <span>
            <Command size={15} /> My workspace <ChevronDown size={10} />
          </span>
          <div>
            <Search size={12} />
            <Bell size={12} />
            <span className="mock-avatar">DS</span>
          </div>
        </div>
        <div className="board-heading">
          <div>
            <h4>
              Good things take focus<span>.</span>
            </h4>
            <p>Your ideas. Your pace. Your workspace.</p>
          </div>
          <span>+ New task</span>
        </div>
        <div className="board-tabs">
          <span>Board view</span>
          <span>List view</span>
          <span>Calendar</span>
          <span>
            <Users size={10} /> My team
          </span>
        </div>
        <div className="kanban-board">
          {columns.map((col, i) => (
            <div className="kanban-column" key={col.title}>
              <div className="kanban-title">
                {i === 2 ? <Check size={11} /> : <Circle size={9} />} {col.title}
                <span>{col.count}</span>
                <Plus size={11} />
              </div>
              {col.tasks.map((task, index) => (
                <div className="kanban-task" key={task.title}>
                  <span className={`task-tag ${task.color}`}>{task.tag}</span>
                  <MoreHorizontal size={12} />
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                  <div>
                    <span>
                      <Calendar size={8} /> Jun {12 + index}
                    </span>
                    <span className="tiny-avatar">DS</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="preview-label">INTERFACE STUDY / 03</span>
    </div>
  );
}

export default function ProjectArt({ id }) {
  return id === 'ethara' ? <EtharaArt /> : id === 'vision' ? <VisionArt /> : <TaskflowArt />;
}
