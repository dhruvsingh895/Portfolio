import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Armchair,
  Check,
  MoveRight,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
} from 'lucide-react';
import { projects } from '../data';
import { useMediaQuery } from '../hooks';
import { ExternalLink } from './UI';

const departments = ['Engineering', 'Design', 'Operations'];
const initialSeats = Array.from({ length: 18 }, (_, id) => ({
  id,
  department: Math.floor(id / 6),
  occupied: [0, 2, 4, 7, 10, 12, 13, 16].includes(id),
}));

function Office() {
  const [seats, setSeats] = useState(initialSeats);
  const [department, setDepartment] = useState(0);
  const [selected, setSelected] = useState(1);
  const [message, setMessage] = useState('Select a desk to explore its allocation.');
  const seat = seats[selected];
  const occupied = seats.filter((item) => item.occupied).length;
  function choose(id) {
    setSelected(id);
    setDepartment(seats[id].department);
    setMessage(
      `Desk ${String(id + 1).padStart(2, '0')} selected. ${seats[id].occupied ? 'Allocated' : 'Available'}.`,
    );
  }
  function allocate() {
    setSeats((items) =>
      items.map((item) => (item.id === selected ? { ...item, occupied: !item.occupied } : item)),
    );
    setMessage(
      `Desk ${String(selected + 1).padStart(2, '0')} ${seat.occupied ? 'released' : 'allocated'} in this demonstration.`,
    );
  }
  return (
    <div className="world-layout">
      <div className="office-stage world-stage">
        <div className="world-stage-label">
          <span>
            <i /> WORKSPACE / FLOOR 01
          </span>
          <span>18 SAMPLE DESKS</span>
        </div>
        <div className="office-room">
          <div className="office-wall wall-back" />
          <div className="office-wall wall-side" />
          <div className="office-floor">
            <div className="office-aisle" aria-hidden="true">
              BUILD SOMETHING TOGETHER
            </div>
            {seats.map((item) => (
              <button
                key={item.id}
                className={`office-desk ${item.occupied ? 'is-occupied' : ''} ${selected === item.id ? 'is-selected' : ''} ${department === item.department ? 'in-department' : 'outside-department'}`}
                aria-label={`Desk ${item.id + 1}, ${departments[item.department]}, ${item.occupied ? 'allocated' : 'available'}`}
                aria-pressed={selected === item.id}
                onClick={() => choose(item.id)}
                style={{ '--desk-column': item.id % 6, '--desk-row': Math.floor(item.id / 6) }}
              >
                <span className="desk-surface" aria-hidden="true">
                  <span className="desk-monitor">
                    <span />
                  </span>
                  <span className="desk-keyboard" />
                  <span className="desk-number">{String(item.id + 1).padStart(2, '0')}</span>
                  <span className="desk-lamp" />
                </span>
                <span className="desk-leg leg-a" />
                <span className="desk-leg leg-b" />
                <span className="desk-chair" />
              </button>
            ))}
            <div className="office-planter planter-one" aria-hidden="true">
              ✳
            </div>
            <div className="office-planter planter-two" aria-hidden="true">
              ✳
            </div>
          </div>
        </div>
        <div className="office-legend">
          <span>
            <i /> Available
          </span>
          <span>
            <i /> Allocated
          </span>
          <span>Hover or tap a desk</span>
        </div>
      </div>
      <div className="world-control-panel">
        <span className="world-eyebrow">01 / SPACE, MADE INTELLIGENT</span>
        <h3>
          A place for
          <br />
          <em>every idea.</em>
        </h3>
        <p>Explore a miniature workspace. Choose a team, select a desk, and try an allocation.</p>
        <div className="department-controls" role="group" aria-label="Choose department">
          {departments.map((name, i) => (
            <button key={name} aria-pressed={department === i} onClick={() => choose(i * 6 + 1)}>
              {name}
            </button>
          ))}
        </div>
        <div className="desk-inspector">
          <span>
            <Armchair size={16} /> DESK {String(selected + 1).padStart(2, '0')}
          </span>
          <strong>{seat.occupied ? 'Allocated' : 'Available'}</strong>
          <small>
            {departments[seat.department]} · {occupied}/18 desks allocated
          </small>
        </div>
        <ol className="allocation-steps">
          <li className="complete">Choose team</li>
          <li className="complete">Select desk</li>
          <li className={seat.occupied ? 'complete' : ''}>Allocate</li>
        </ol>
        <button className="world-action" onClick={allocate}>
          {seat.occupied ? 'Release this desk' : 'Allocate this desk'}
          <MoveRight size={16} />
        </button>
        <p className="world-status" role="status">
          {message}
        </p>
        <button
          className="world-reset"
          onClick={() => {
            setSeats(initialSeats);
            setSelected(1);
            setDepartment(0);
            setMessage('Office demonstration reset.');
          }}
        >
          <RotateCcw size={12} /> Reset office
        </button>
      </div>
    </div>
  );
}

const vehicles = [
  { lane: 0, duration: 7, start: 0.04 },
  { lane: 1, duration: 10, start: 0.37 },
  { lane: 2, duration: 8, start: 0.17 },
  { lane: 3, duration: 12, start: 0.72 },
  { lane: 0, duration: 9, start: 0.58 },
];
function Traffic({ reducedMotion, active }) {
  const [running, setRunning] = useState(!reducedMotion);
  const [detections, setDetections] = useState(true);
  const [count, setCount] = useState(0);
  const cars = useRef([]),
    elapsed = useRef(0),
    crossed = useRef(0);
  function draw(seconds) {
    elapsed.current += seconds;
    let total = 0;
    vehicles.forEach((car, i) => {
      const travel = car.start + elapsed.current / car.duration;
      // The vehicle reference point crosses y=166 at progress .6 on the 332px road.
      total += Math.max(0, Math.floor(travel + 0.4) - Math.floor(car.start + 0.4));
      cars.current[i]?.style.setProperty('--travel', `${(travel % 1) * 360 - 50}px`);
    });
    if (total !== crossed.current) {
      crossed.current = total;
      setCount(total);
    }
  }
  useEffect(() => {
    draw(0);
  }, []);
  useEffect(() => {
    if (reducedMotion) setRunning(false);
  }, [reducedMotion]);
  useEffect(() => {
    if (!running || reducedMotion || !active) return;
    let request, last;
    function frame(time) {
      if (last !== undefined) draw(Math.min((time - last) / 1000, 0.1));
      last = time;
      request = requestAnimationFrame(frame);
    }
    request = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(request);
  }, [running, reducedMotion, active]);
  return (
    <div className="world-layout">
      <div className={`world-stage traffic-stage ${detections ? 'show-detections' : ''}`}>
        <div className="world-stage-label">
          <span>
            <i /> TRAFFIC VISION / SIMULATION
          </span>
          <span>{running && !reducedMotion ? 'RUNNING' : 'PAUSED'}</span>
        </div>
        <div className="traffic-diorama">
          <div className="mini-road">
            <div className="road-stripe stripe-one" />
            <div className="road-stripe stripe-two" />
            <div className="road-stripe stripe-three" />
            <div className="counting-line">
              <span>COUNTING LINE</span>
            </div>
            {vehicles.map((car, i) => (
              <div
                key={i}
                ref={(node) => (cars.current[i] = node)}
                className={`world-car car-body-${i}`}
                style={{ '--lane': car.lane }}
                aria-hidden="true"
              >
                <div className="vehicle-roof" />
                <div className="vehicle-windshield" />
                <div className="vehicle-lights" />
                <div className="vehicle-box">
                  <span>VEHICLE {String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="road-building building-one" />
          <div className="road-building building-two" />
          <div className="road-building building-three" />
        </div>
        <div className="traffic-world-hud">
          <span>
            <strong>{String(count).padStart(3, '0')}</strong>SIMULATED CROSSINGS
          </span>
          <ScanLine size={32} />
          <span>DETECT → TRACK → COUNT</span>
        </div>
      </div>
      <div className="world-control-panel">
        <span className="world-eyebrow">02 / A DIFFERENT WAY TO SEE</span>
        <h3>
          Movement.
          <br />
          <em>Understood.</em>
        </h3>
        <p>
          A miniature road makes the pipeline tangible. Watch vehicles cross the line and the
          counter respond.
        </p>
        <div className="pipeline-steps">
          <span>
            01 <b>Detect</b>
            <small>Locate each vehicle</small>
          </span>
          <span>
            02 <b>Track</b>
            <small>Follow its movement</small>
          </span>
          <span>
            03 <b>Count</b>
            <small>Register a crossing</small>
          </span>
        </div>
        <div className="traffic-controls">
          {!reducedMotion && (
            <button className="world-action" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause size={15} /> : <Play size={15} />}
              {running ? 'Pause traffic' : 'Resume traffic'}
            </button>
          )}
          <button
            className="world-secondary"
            aria-pressed={detections}
            onClick={() => setDetections((value) => !value)}
          >
            Detection boxes {detections ? 'on' : 'off'}
          </button>
        </div>
        <button
          className="world-secondary"
          onClick={() => {
            setRunning(false);
            draw(2);
          }}
        >
          Advance simulation 2 seconds
        </button>
        <p className="world-status">
          Procedural demonstration, not a live camera feed or a model accuracy benchmark.
        </p>
        <button
          className="world-reset"
          onClick={() => {
            elapsed.current = 0;
            crossed.current = 0;
            setCount(0);
            draw(0);
          }}
        >
          <RotateCcw size={12} /> Reset counter
        </button>
      </div>
    </div>
  );
}

const initialTasks = [
  { id: 'api', title: 'Define the API', tag: 'BACKEND', column: 0 },
  { id: 'design', title: 'Design the dashboard', tag: 'DESIGN', column: 0 },
  { id: 'data', title: 'Connect the database', tag: 'ENGINEERING', column: 1 },
];
const columns = ['To do', 'In progress', 'Done'];
function Taskflow() {
  const [tasks, setTasks] = useState(initialTasks),
    [message, setMessage] = useState('Move a card to get things flowing.'),
    [dragging, setDragging] = useState(null),
    [celebration, setCelebration] = useState(0);
  function move(id, column) {
    const task = tasks.find((item) => item.id === id);
    if (!task || !Number.isInteger(column) || column < 0 || column > 2 || task.column === column)
      return;
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, column } : item)));
    setMessage(`${task.title} moved to ${columns[column]}.`);
    if (column === 2) setCelebration((value) => value + 1);
    setDragging(null);
  }
  return (
    <div className="task-world">
      <div className="task-world-heading">
        <div>
          <span className="world-eyebrow">03 / SMALL MOVES. REAL MOMENTUM.</span>
          <h3>
            Make room for <em>focus.</em>
          </h3>
        </div>
        <p>
          Drag cards between columns, or use each card’s move menu. These are sample tasks you can
          play with.
        </p>
      </div>
      <div className="interactive-board">
        {columns.map((name, column) => (
          <section
            key={name}
            className={`interactive-column ${dragging ? 'accepts-drop' : ''}`}
            aria-label={`${name} tasks`}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(event) => {
              event.preventDefault();
              move(event.dataTransfer.getData('text/plain'), column);
            }}
          >
            <h4>
              <i />
              {name}
              <span>{tasks.filter((task) => task.column === column).length}</span>
            </h4>
            <div className="task-drop-area">
              {tasks
                .filter((task) => task.column === column)
                .map((task) => (
                  <div
                    key={task.id}
                    className="interactive-task"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', task.id);
                      event.dataTransfer.effectAllowed = 'move';
                      setDragging(task.id);
                    }}
                    onDragEnd={() => setDragging(null)}
                  >
                    <span className="task-demo-tag">
                      {task.tag}
                      {column === 2 && <Check size={13} />}
                    </span>
                    <h5>{task.title}</h5>
                    <p>
                      {column === 2
                        ? 'One less thing between you and the idea.'
                        : 'Good work begins with a little momentum.'}
                    </p>
                    <label>
                      Move to
                      <select
                        aria-label={`Move ${task.title}`}
                        value={column}
                        onChange={(event) => move(task.id, Number(event.target.value))}
                      >
                        {columns.map((label, i) => (
                          <option value={i} key={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
              {tasks.every((task) => task.column !== column) && (
                <div className="empty-column">
                  {column === 2 ? 'Your next small victory goes here.' : 'Room for your next idea.'}
                  <span>DROP A CARD HERE</span>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
      {celebration > 0 && (
        <div className="task-celebration" key={celebration} aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} style={{ '--confetti-index': i }} />
          ))}
        </div>
      )}
      <div className="task-world-footer">
        <p role="status">{message}</p>
        <button
          className="world-reset"
          onClick={() => {
            setTasks(initialTasks);
            setMessage('Task board reset.');
            setCelebration(0);
          }}
        >
          <RotateCcw size={12} /> Reset board
        </button>
      </div>
    </div>
  );
}

export default function ProjectWorlds() {
  const [world, setWorld] = useState(0),
    [active, setActive] = useState(false);
  const root = useRef(null),
    tabs = useRef([]);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  function keyboard(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % 3;
    else if (event.key === 'ArrowLeft') next = (index + 2) % 3;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 2;
    else return;
    event.preventDefault();
    setWorld(next);
    tabs.current[next].focus();
  }
  return (
    <div className="project-worlds" id="workspace" ref={root}>
      <div className="worlds-top">
        <span className="world-eyebrow">THE INTERACTIVE WORKSPACE</span>
        <span>ILLUSTRATIVE DEMOS · EXPLORE & EXPERIMENT</span>
      </div>
      <div className="world-tabs" role="tablist" aria-label="Interactive project worlds">
        {['The office', 'The intersection', 'The flow'].map((name, i) => (
          <button
            key={name}
            ref={(node) => (tabs.current[i] = node)}
            id={`world-tab-${i}`}
            role="tab"
            aria-selected={world === i}
            aria-controls="world-panel"
            tabIndex={world === i ? 0 : -1}
            onKeyDown={(event) => keyboard(event, i)}
            onClick={() => setWorld(i)}
          >
            <span>0{i + 1}</span>
            {name}
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
      <div
        id="world-panel"
        role="tabpanel"
        aria-labelledby={`world-tab-${world}`}
        tabIndex={0}
        key={world}
      >
        {world === 0 ? (
          <Office />
        ) : world === 1 ? (
          <Traffic reducedMotion={reducedMotion} active={active} />
        ) : (
          <Taskflow />
        )}
      </div>
      <div className="worlds-bottom">
        <span>
          EXPLORING <strong>{projects[world].name}</strong>
        </span>
        <ExternalLink href={projects[world].demo}>
          Open real project <ArrowUpRight size={15} />
        </ExternalLink>
      </div>
    </div>
  );
}
