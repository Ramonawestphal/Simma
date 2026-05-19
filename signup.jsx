// Simma — signup wizard. Role picker → one-question-at-a-time questionnaire → personalized card.

const { useState, useEffect, useMemo, useRef } = React;

const SIGNUP_TWEAKS = /*EDITMODE-BEGIN*/{
  "textSize": "m",
  "accent": "rust"
}/*EDITMODE-END*/;

// ─── Question content ──────────────────────────────────────────────────────

const ROTTERDAM = [
  "Centrum", "Noord", "Delfshaven", "Kralingen", "Hillegersberg",
  "Overschie", "Crooswijk", "West", "Zuid", "Charlois", "IJsselmonde",
];

const CUISINE_EXAMPLES = [
  "Surinamese", "Italian", "Turkish", "Bosnian", "Dutch", "Cantonese",
  "Moroccan", "Indonesian", "Persian", "Polish", "Vietnamese", "Caribbean",
  "Greek", "Cape Verdean", "Syrian",
];

const DISH_EXAMPLES = [
  "Pom", "Burek", "Appletaart", "Lasagna", "Gözleme", "Bao",
  "Pastéis", "Bigos", "Pho", "Tagine", "Ghormeh sabzi", "Rendang",
];

const WHY_LEARNER = [
  "Curiosity",
  "Family heritage",
  "Meet new neighbors",
  "Learn from someone older",
  "Cook for someone I love",
  "Slow down on a Sunday",
];

const AVAILABILITY = [
  "Weekday mornings", "Weekday afternoons", "Weekday evenings",
  "Saturday", "Sunday", "Whenever a kitchen is open",
];

const DIETARY = [
  "No restrictions", "Vegetarian", "Halal", "Kosher", "Gluten-free", "Dairy-free", "Nut allergy",
];

const FREQUENCY = [
  { value: "month",   label: "Once a month",        sub: "A quiet, regular rhythm" },
  { value: "weeks",   label: "Every few weeks",     sub: "A few times a season" },
  { value: "mood",    label: "When the mood strikes", sub: "I'll let you know" },
];

// ─── Wizard step definitions ───────────────────────────────────────────────

const HOST_STEPS = [
  {
    key: "name",
    kind: "text",
    eyebrow: "Let's start gently",
    question: "What should we call you?",
    helper: "A first name is plenty — Lena, Mirza, Carl. We'll never share more than what you decide.",
    placeholder: "Your name",
    examples: null,
    optional: false,
  },
  {
    key: "neighborhood",
    kind: "single",
    eyebrow: "Where you cook",
    question: "Which corner of Rotterdam is your kitchen in?",
    helper: "We match learners who live close enough to walk or cycle to your door.",
    options: ROTTERDAM,
    optional: false,
  },
  {
    key: "dish",
    kind: "text",
    eyebrow: "The recipe",
    question: "What's the one dish you'd love to teach?",
    helper: "Don't overthink it — the one you've made a hundred times, the one that smells like home when it's in the oven.",
    placeholder: "e.g. Pom, or my grandmother's appletaart",
    examples: DISH_EXAMPLES,
    optional: false,
  },
  {
    key: "cuisine",
    kind: "text",
    eyebrow: "Where it comes from",
    question: "And which tradition does it come from?",
    helper: "A country, a region, a family — whatever feels true. There's no wrong answer.",
    placeholder: "Surinamese, Bolognese, my mother's…",
    examples: CUISINE_EXAMPLES,
    optional: false,
  },
  {
    key: "story",
    kind: "textarea",
    eyebrow: "The story",
    question: "Tell us the story behind it.",
    helper: "Who taught you? When do you make it? Why does it matter? Take your time — even a few sentences is enough.",
    placeholder: "My mother made this every birthday in Paramaribo…",
    examples: null,
    prompts: [
      "Who first showed you how to make it?",
      "When in the year does it appear on your table?",
      "What's the one thing people get wrong about it?",
    ],
    optional: false,
  },
  {
    key: "frequency",
    kind: "frequency",
    eyebrow: "Your pace",
    question: "How often would you like to host?",
    helper: "There's no pressure — Simma is gentle by design. You can change this any time.",
    optional: false,
  },
  {
    key: "bring",
    kind: "text",
    eyebrow: "Almost there",
    question: "Anything you'd like a learner to bring along?",
    helper: "Optional. Some hosts ask for a fresh ingredient, some for a pair of clean hands, some for nothing at all.",
    placeholder: "A bunch of celery — the smell brings me back home",
    examples: null,
    optional: true,
  },
  {
    key: "photo",
    kind: "photo",
    eyebrow: "Last one — promise",
    question: "Would you like to add a photo?",
    helper: "A friendly portrait helps learners feel at home before they knock. You can skip this and add one later.",
    optional: true,
  },
];

const LEARNER_STEPS = [
  {
    key: "name",
    kind: "text",
    eyebrow: "Welcome",
    question: "What should we call you?",
    helper: "A first name is plenty. We keep things small and personal.",
    placeholder: "Your name",
    examples: null,
    optional: false,
  },
  {
    key: "neighborhood",
    kind: "single",
    eyebrow: "Where you live",
    question: "Which neighborhood do you call home?",
    helper: "We'll show you cooks within a short cycle ride first.",
    options: ROTTERDAM,
    optional: false,
  },
  {
    key: "cuisines",
    kind: "multi",
    eyebrow: "What pulls you in",
    question: "Which cooking traditions are you curious about?",
    helper: "Pick a few — or many. This is just a starting point; you'll discover more as you go.",
    options: CUISINE_EXAMPLES,
    minSelect: 1,
    allowOther: true,
    otherPlaceholder: "Add another tradition…",
    optional: false,
  },
  {
    key: "why",
    kind: "multi",
    eyebrow: "Why you're here",
    question: "What brings you to Simma?",
    helper: "Pick whatever resonates. The hosts love knowing what you're looking for.",
    options: WHY_LEARNER,
    minSelect: 1,
    allowOther: true,
    otherPlaceholder: "Tell us in your own words…",
    optional: false,
  },
  {
    key: "availability",
    kind: "multi",
    eyebrow: "When you're free",
    question: "When are you usually open for an afternoon in someone's kitchen?",
    helper: "Most sessions run three or four hours. Pick the times that fit you.",
    options: AVAILABILITY,
    minSelect: 1,
    optional: false,
  },
  {
    key: "dietary",
    kind: "multi",
    eyebrow: "Good to know",
    question: "Any dietary notes a host should know about?",
    helper: "We'll quietly pass these along so nobody is caught out.",
    options: DIETARY,
    minSelect: 0,
    allowOther: true,
    otherPlaceholder: "e.g. low FODMAP, no shellfish…",
    optional: true,
  },
  {
    key: "photo",
    kind: "photo",
    eyebrow: "Last one",
    question: "Would you like to add a photo?",
    helper: "Hosts like seeing who's coming for the afternoon — but skip this if you'd rather. You can always add one later.",
    optional: true,
  },
];

// ─── Affirmations between steps ────────────────────────────────────────────

const AFFIRMATIONS = [
  "Lovely.",
  "Beautiful.",
  "Got it.",
  "That's a good one.",
  "Wonderful — thank you.",
  "Noted.",
  "Mm, that sounds nice.",
  "Perfect.",
];
function pickAffirmation(i) { return AFFIRMATIONS[i % AFFIRMATIONS.length]; }

// ─── Stock portraits offered if user skips photo ───────────────────────────

const HOST_STOCK = (typeof HOST_PHOTOS !== "undefined" && HOST_PHOTOS) || [];
const LEARNER_STOCK = (typeof LEARNER_PHOTOS !== "undefined" && LEARNER_PHOTOS) || [];

// ═══════════════════════════════════════════════════════════════════════════
// App
// ═══════════════════════════════════════════════════════════════════════════

function SignupApp() {
  const [stage, setStage] = useState("role");   // role | wizard | done
  const [role, setRole] = useState(null);       // 'host' | 'learner'
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1); // 1 forward, -1 back
  const [t, setTweak] = useTweaks(SIGNUP_TWEAKS);

  useEffect(() => {
    document.body.setAttribute("data-text", t.textSize);
    document.body.setAttribute("data-accent", t.accent);
  }, [t.textSize, t.accent]);

  const steps = role === "host" ? HOST_STEPS : role === "learner" ? LEARNER_STEPS : [];
  const total = steps.length;
  const step  = steps[stepIdx] || null;
  const value = step ? answers[step.key] : null;

  const canAdvance = useMemo(() => {
    if (!step) return false;
    if (step.optional) return true;
    if (step.kind === "text" || step.kind === "textarea") return value && value.trim().length > 0;
    if (step.kind === "single" || step.kind === "frequency") return !!value;
    if (step.kind === "multi") return Array.isArray(value) && value.length >= (step.minSelect ?? 1);
    if (step.kind === "photo") return true; // skip OK
    return false;
  }, [step, value]);

  const pickRole = (r) => {
    setRole(r);
    setStepIdx(0);
    setAnswers({});
    setDirection(1);
    setStage("wizard");
  };

  const setAnswer = (val) => setAnswers(a => ({ ...a, [step.key]: val }));
  const toggleMulti = (opt) => {
    setAnswers(a => {
      const cur = Array.isArray(a[step.key]) ? a[step.key] : [];
      return { ...a, [step.key]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] };
    });
  };

  const advance = () => {
    if (stepIdx + 1 >= total) {
      setStage("done");
    } else {
      setDirection(1);
      setStepIdx(i => i + 1);
    }
  };
  const back = () => {
    if (stepIdx === 0) {
      setDirection(-1);
      setStage("role");
    } else {
      setDirection(-1);
      setStepIdx(i => i - 1);
    }
  };

  const restart = () => {
    setStage("role");
    setRole(null);
    setStepIdx(0);
    setAnswers({});
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="signup-page">
      <TopBar onHome={() => window.location.href = "Simma.html"} />

      {stage === "role" && <RolePicker onPick={pickRole} />}

      {stage === "wizard" && (
        <Wizard
          role={role}
          step={step}
          stepIdx={stepIdx}
          total={total}
          value={value}
          direction={direction}
          answers={answers}
          onSetAnswer={setAnswer}
          onToggleMulti={toggleMulti}
          canAdvance={canAdvance}
          onAdvance={advance}
          onBack={back}
        />
      )}

      {stage === "done" && (
        <FinalCard role={role} answers={answers} onRestart={restart} />
      )}

      <TweaksPanel>
        <TweakSection label="Reading" />
        <TweakRadio label="Text size" value={t.textSize}
          options={[
            { value: "m",  label: "Normal" },
            { value: "l",  label: "Larger" },
            { value: "xl", label: "Largest" },
          ]}
          onChange={(v) => setTweak("textSize", v)} />
        <TweakSection label="Mood" />
        <TweakRadio label="Accent" value={t.accent}
          options={[
            { value: "rust",    label: "Rust" },
            { value: "teal",    label: "Teal" },
            { value: "mustard", label: "Mustard" },
            { value: "plum",    label: "Plum" },
          ]}
          onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </div>
  );
}

// ─── Top bar ───────────────────────────────────────────────────────────────

function TopBar({ onHome }) {
  return (
    <header className="signup-top">
      <span className="brand" onClick={onHome}>
        Sim<span className="brand-dot"></span>ma
      </span>
      <span className="signup-top-aside">
        Already have an account? <button className="text-link">Sign in</button>
      </span>
    </header>
  );
}

// ─── Role picker ───────────────────────────────────────────────────────────

function RolePicker({ onPick }) {
  return (
    <div className="signup-shell signup-role screen">
      <div className="signup-eyebrow eyebrow eyebrow-rust">
        <span className="rule-dot"></span> Welcome to Simma
      </div>
      <h1 className="display h-hero signup-h1">
        How would you like<br/>
        to join the table?
      </h1>
      <p className="signup-lead story">
        Two ways in. You can switch later if you like — most people do, eventually.
      </p>

      <div className="role-grid">
        <RoleCard
          role="host"
          tag="For cooks who love to share"
          title="I'd like to host"
          tagline="Open my kitchen for an afternoon"
          body="You have a dish — or three — that means something. We help a younger neighbor learn it the way you learned it: by being there."
          bullets={["You set the day and the pace", "We bring the learner and ingredients", "No money changes hands"]}
          photo={HOST_STOCK[0]}
          onPick={() => onPick("host")}
        />
        <RoleCard
          role="learner"
          tag="For curious neighbors"
          title="I'd like to learn"
          tagline="Find a kitchen to spend an afternoon in"
          body="You want to cook with your hands, next to someone who's done it a thousand times. We match you with hosts close by who'd love to share."
          bullets={["Three- to four-hour sessions", "Walking or cycling distance", "Bring an appetite, that's it"]}
          photo={LEARNER_STOCK[0]}
          onPick={() => onPick("learner")}
        />
      </div>

      <p className="signup-fine">
        Simma is a small Rotterdam project. We never sell your details, and there's a real person — Eline — you can write to any time.
      </p>
    </div>
  );
}

function RoleCard({ role, tag, title, tagline, body, bullets, photo, onPick }) {
  return (
    <button className={"role-card role-card-" + role} onClick={onPick}>
      <div className="role-photo">
        {photo
          ? <img src={photo} alt=""/>
          : <div className="role-photo-fallback"></div>}
        <span className="role-tag">{tag}</span>
      </div>
      <div className="role-body">
        <h2 className="display h-card">{title}</h2>
        <p className="role-tagline">{tagline}</p>
        <p className="role-text">{body}</p>
        <ul className="role-bullets">
          {bullets.map((b, i) => (
            <li key={i}>
              <span className="role-check"><Icon.Check size={12}/></span>
              {b}
            </li>
          ))}
        </ul>
        <span className="role-cta">
          {role === "host" ? "Start as a host" : "Start as a learner"} <Icon.Arrow size={16}/>
        </span>
      </div>
    </button>
  );
}

// ─── Wizard frame ──────────────────────────────────────────────────────────

function Wizard({ role, step, stepIdx, total, value, direction, answers, onSetAnswer, onToggleMulti, canAdvance, onAdvance, onBack }) {
  const isFirst = stepIdx === 0;
  const isLast  = stepIdx === total - 1;

  const onKey = (e) => {
    if (e.key === "Enter" && canAdvance && step.kind !== "textarea") onAdvance();
  };

  return (
    <div className="signup-shell signup-wizard" onKeyDown={onKey}>
      <Progress current={stepIdx + 1} total={total} role={role} />

      <div key={stepIdx} className={"wiz-screen " + (direction > 0 ? "wiz-in-fwd" : "wiz-in-back")}>
        <div className="wiz-head">
          <div className={"eyebrow " + (role === "host" ? "eyebrow-rust" : "eyebrow-teal")}>
            {!isFirst && <span className="wiz-affirm display-italic">{pickAffirmation(stepIdx)} &nbsp;·&nbsp; </span>}
            {step.eyebrow}
          </div>
          <h2 className="display h-section wiz-question">{step.question}</h2>
          {step.helper && <p className="wiz-helper">{step.helper}</p>}
        </div>

        <div className="wiz-body">
          <StepBody
            step={step}
            value={value}
            answers={answers}
            onSet={onSetAnswer}
            onToggle={onToggleMulti}
            onSubmitEnter={() => canAdvance && onAdvance()}
          />
        </div>

        <div className="wiz-foot">
          <button className="wiz-back" onClick={onBack}>
            <Icon.Back size={16}/> Back
          </button>
          <div className="wiz-foot-right">
            {step.optional && !canAdvanceFilled(step, value) && (
              <button className="text-link" onClick={onAdvance}>Skip for now</button>
            )}
            <button
              className={"btn btn-primary btn-lg" + (canAdvance ? "" : " is-disabled")}
              disabled={!canAdvance}
              onClick={onAdvance}>
              {isLast ? "Finish" : "Continue"} <Icon.Arrow size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function canAdvanceFilled(step, value) {
  if (step.kind === "text" || step.kind === "textarea") return value && value.trim().length > 0;
  if (step.kind === "single" || step.kind === "frequency") return !!value;
  if (step.kind === "multi") return Array.isArray(value) && value.length > 0;
  if (step.kind === "photo") return !!value;
  return false;
}

// ─── Progress ──────────────────────────────────────────────────────────────

function Progress({ current, total, role }) {
  return (
    <div className="progress-row">
      <div className="progress-text">
        <span className="progress-num display-italic">{current}</span>
        <span className="progress-of">of {total}</span>
        <span className="progress-role">
          <span className="rule-dot"></span>
          {role === "host" ? "Hosting" : "Learning"}
        </span>
      </div>
      <div className="progress-bar">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={"prog-tick " + (i < current ? "is-done" : "")}></span>
        ))}
      </div>
    </div>
  );
}

// ─── Step body switcher ────────────────────────────────────────────────────

function StepBody({ step, value, answers, onSet, onToggle, onSubmitEnter }) {
  if (step.kind === "text")     return <TextStep step={step} value={value} onSet={onSet} onSubmitEnter={onSubmitEnter}/>;
  if (step.kind === "textarea") return <TextareaStep step={step} value={value} onSet={onSet}/>;
  if (step.kind === "single")   return <SingleStep step={step} value={value} onSet={onSet}/>;
  if (step.kind === "multi")    return <MultiStep step={step} value={value} onToggle={onToggle} onSet={onSet}/>;
  if (step.kind === "frequency")return <FrequencyStep value={value} onSet={onSet}/>;
  if (step.kind === "photo")    return <PhotoStep value={value} onSet={onSet} role={answers.__role}/>;
  return null;
}

// ─── Text input step ───────────────────────────────────────────────────────

function TextStep({ step, value, onSet, onSubmitEnter }) {
  const ref = useRef(null);
  useEffect(() => { ref.current && ref.current.focus(); }, []);
  return (
    <div className="step-stack">
      <input
        ref={ref}
        className="input input-xl"
        type="text"
        placeholder={step.placeholder}
        value={value || ""}
        onChange={(e) => onSet(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmitEnter(); }}
      />
      {step.examples && (
        <div className="example-row">
          <span className="example-label">Examples to spark something —</span>
          <div className="example-chips">
            {step.examples.slice(0, 8).map(ex => (
              <button
                key={ex}
                className="chip chip-example"
                onClick={() => onSet(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Textarea step ─────────────────────────────────────────────────────────

function TextareaStep({ step, value, onSet }) {
  const ref = useRef(null);
  useEffect(() => { ref.current && ref.current.focus(); }, []);
  return (
    <div className="step-stack">
      <textarea
        ref={ref}
        className="textarea textarea-xl"
        placeholder={step.placeholder}
        value={value || ""}
        onChange={(e) => onSet(e.target.value)}
      />
      {step.prompts && (
        <div className="prompts-row">
          <span className="prompts-label">If you'd like a nudge —</span>
          <ul className="prompts-list">
            {step.prompts.map((p, i) => <li key={i}><span className="prompts-bullet">·</span> {p}</li>)}
          </ul>
        </div>
      )}
      <div className="textarea-meta">
        <span className="muted">{(value || "").trim().split(/\s+/).filter(Boolean).length} words</span>
        <span className="muted">No need to polish — we'll help shape it later</span>
      </div>
    </div>
  );
}

// ─── Single-select step ───────────────────────────────────────────────────

function SingleStep({ step, value, onSet }) {
  return (
    <div className="option-grid">
      {step.options.map(opt => (
        <button
          key={opt}
          className={"opt " + (value === opt ? "is-active" : "")}
          onClick={() => onSet(opt)}>
          <span className="opt-radio">{value === opt && <span className="opt-radio-dot"></span>}</span>
          <span className="opt-label">{opt}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Multi-select step ────────────────────────────────────────────────────

function MultiStep({ step, value, onToggle, onSet }) {
  const selected = Array.isArray(value) ? value : [];
  const builtins = step.options;
  const customs = selected.filter(s => !builtins.includes(s));
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState("");
  const otherRef = useRef(null);

  useEffect(() => {
    if (otherOpen && otherRef.current) otherRef.current.focus();
  }, [otherOpen]);

  const commitOther = () => {
    const v = otherText.trim();
    if (!v) { setOtherOpen(false); return; }
    if (!selected.includes(v)) onSet([...selected, v]);
    setOtherText("");
    setOtherOpen(false);
  };

  const removeCustom = (c) => onSet(selected.filter(s => s !== c));

  return (
    <div className="step-stack">
      <div className="chip-grid">
        {builtins.map(opt => {
          const on = selected.includes(opt);
          return (
            <button key={opt} className={"chip chip-select " + (on ? "is-active" : "")} onClick={() => onToggle(opt)}>
              {on && <span className="chip-check"><Icon.Check size={11}/></span>}
              {opt}
            </button>
          );
        })}

        {/* Custom entries already added */}
        {customs.map(c => (
          <button key={c} className="chip chip-select is-active chip-custom" onClick={() => removeCustom(c)} title="Remove">
            <span className="chip-check"><Icon.Check size={11}/></span>
            {c}
            <span className="chip-x">×</span>
          </button>
        ))}

        {/* Other entry */}
        {step.allowOther && !otherOpen && (
          <button className="chip chip-other" onClick={() => setOtherOpen(true)}>
            <span className="chip-plus"><Icon.Plus size={12}/></span>
            Other
          </button>
        )}
        {step.allowOther && otherOpen && (
          <span className="chip-input-wrap">
            <input
              ref={otherRef}
              className="chip-input"
              type="text"
              placeholder={step.otherPlaceholder || "Type your own…"}
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitOther();
                if (e.key === "Escape") { setOtherText(""); setOtherOpen(false); }
              }}
              onBlur={commitOther}
            />
          </span>
        )}
      </div>
      <div className="multi-meta">
        <span className="muted">{selected.length} selected</span>
        {step.minSelect > 0 && selected.length < step.minSelect && (
          <span className="muted">— pick at least {step.minSelect} to continue</span>
        )}
        {step.allowOther && (
          <span className="muted" style={{ marginLeft: "auto" }}>
            Don't see yours? Tap <i>Other</i> to add one.
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Frequency step ────────────────────────────────────────────────────────

function FrequencyStep({ value, onSet }) {
  return (
    <div className="freq-grid">
      {FREQUENCY.map(f => (
        <button key={f.value} className={"freq-card " + (value === f.value ? "is-active" : "")} onClick={() => onSet(f.value)}>
          <span className="freq-radio">{value === f.value && <span className="freq-radio-dot"></span>}</span>
          <div>
            <div className="freq-label display h-small">{f.label}</div>
            <div className="freq-sub muted">{f.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Photo step ────────────────────────────────────────────────────────────

function PhotoStep({ value, onSet, role }) {
  // Allow "uploading" by selecting one of the friendly stock portraits.
  // Real upload would replace this in production.
  const offers = (role === "host" ? HOST_STOCK : LEARNER_STOCK).slice(0, 4);
  return (
    <div className="step-stack">
      <div className="photo-row">
        <button className="photo-upload">
          <div className="photo-upload-ico"><Icon.Plus size={22}/></div>
          <div className="photo-upload-label">Upload a photo</div>
          <div className="photo-upload-sub muted">JPG or PNG, up to 8 MB</div>
        </button>
        <div className="photo-or">
          <span className="rule-dot"></span>
          <span className="display-italic">or</span>
          <span className="rule-dot"></span>
        </div>
        <div className="photo-quick">
          <div className="photo-quick-label muted">Pick a placeholder for now —</div>
          <div className="photo-quick-grid">
            {offers.map((src, i) => (
              <button key={src} className={"photo-thumb " + (value === src ? "is-active" : "")} onClick={() => onSet(src)}>
                <img src={src} alt=""/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Final personalized card ───────────────────────────────────────────────

function FinalCard({ role, answers, onRestart }) {
  if (role === "host")    return <HostFinalCard answers={answers} onRestart={onRestart} />;
  if (role === "learner") return <LearnerFinalCard answers={answers} onRestart={onRestart} />;
  return null;
}

function HostFinalCard({ answers, onRestart }) {
  const photo = answers.photo || HOST_STOCK[1];
  const name  = answers.name || "Friend";
  const dish  = answers.dish || "your recipe";
  const cuisine = answers.cuisine || "your kitchen";
  const story = answers.story || "";
  const freqLabel = (FREQUENCY.find(f => f.value === answers.frequency) || {}).label || "When the mood strikes";
  return (
    <div className="final-wrap screen">
      <div className="final-eyebrow eyebrow eyebrow-rust">
        <span className="rule-dot"></span> Your Simma card · Draft
      </div>
      <h1 className="display h-hero final-h1">
        Welcome, <span className="display-italic">{name}.</span>
      </h1>
      <p className="story final-lead">
        Here's how your kitchen will appear to learners. You can polish anything you like, any time.
      </p>

      <article className="cookbook-card">
        <div className="cookbook-stamp">
          <span className="display-italic">Recipe №</span>
          <span className="cookbook-stamp-num display">{String(Math.floor(Math.random() * 90) + 10).padStart(2,"0")}</span>
        </div>
        <div className="cookbook-grid">
          <div className="cookbook-photo">
            <img src={photo} alt={name}/>
            <span className="cookbook-photo-cap">{name}'s kitchen · {answers.neighborhood || "Rotterdam"}</span>
          </div>
          <div className="cookbook-body">
            <div className="eyebrow eyebrow-rust">{cuisine} · A recipe to share</div>
            <h2 className="display h-section cookbook-dish">{dish}</h2>

            <div className="cookbook-meta">
              <div className="cookbook-meta-row">
                <span className="meta-ico"><Icon.Pin size={16}/></span>
                <span><span className="meta-label-i">Cooking in</span> {answers.neighborhood || "Rotterdam"}</span>
              </div>
              <div className="cookbook-meta-row">
                <span className="meta-ico"><Icon.Calendar size={16}/></span>
                <span><span className="meta-label-i">Hosting</span> {freqLabel.toLowerCase()}</span>
              </div>
              {answers.bring && (
                <div className="cookbook-meta-row">
                  <span className="meta-ico"><Icon.Heart size={16}/></span>
                  <span><span className="meta-label-i">Bring along</span> {answers.bring}</span>
                </div>
              )}
            </div>

            {story && (
              <div className="cookbook-story">
                <div className="quote-mark display-italic">“</div>
                <p className="story cookbook-story-text">{story}</p>
              </div>
            )}
          </div>
        </div>

        <div className="cookbook-foot">
          <span className="display-italic">— {name}, signed today.</span>
          <span className="cookbook-credit">Simma · Rotterdam</span>
        </div>
      </article>

      <div className="final-actions">
        <button className="btn btn-primary btn-lg" onClick={() => { window.__simmaCompleteSignup("host", answers); window.location.href = "Simma.html"; }}>
          Set up my first session <Icon.Arrow size={16}/>
        </button>
        <button className="btn btn-ghost btn-lg" onClick={onRestart}>Start over</button>
      </div>

      <p className="final-note story">
        Within a day or two, our matchmaker Eline will write to suggest a first learner. She reads every introduction by hand.
      </p>
    </div>
  );
}

function LearnerFinalCard({ answers, onRestart }) {
  const photo = answers.photo || LEARNER_STOCK[0];
  const name  = answers.name || "Friend";
  const cuisines = Array.isArray(answers.cuisines) ? answers.cuisines : [];
  const why = Array.isArray(answers.why) ? answers.why : [];
  const avail = Array.isArray(answers.availability) ? answers.availability : [];
  const diet = Array.isArray(answers.dietary) ? answers.dietary : [];
  return (
    <div className="final-wrap screen">
      <div className="final-eyebrow eyebrow eyebrow-teal">
        <span className="rule-dot"></span> Your Simma card · Draft
      </div>
      <h1 className="display h-hero final-h1">
        Hello, <span className="display-italic">{name}.</span>
      </h1>
      <p className="story final-lead">
        Here's what hosts will see when you ask to join their kitchen. Tweak it whenever you like.
      </p>

      <article className="learner-card">
        <div className="learner-card-left">
          <div className="learner-portrait">
            <img src={photo} alt={name}/>
            <span className="learner-portrait-frame"></span>
          </div>
          <div className="learner-id">
            <div className="display h-card learner-name">{name}</div>
            <div className="muted">
              {answers.neighborhood || "Rotterdam"}
            </div>
          </div>
        </div>

        <div className="learner-card-right">
          <div className="eyebrow eyebrow-teal">Hoping to learn</div>
          <div className="chip-row">
            {cuisines.slice(0, 6).map(c => <span key={c} className="pill pill-teal">{c}</span>)}
            {cuisines.length === 0 && <span className="muted">—</span>}
          </div>

          <div className="learner-section">
            <div className="eyebrow">Drawn to Simma by</div>
            <div className="chip-row">
              {why.map(w => <span key={w} className="pill">{w}</span>)}
              {why.length === 0 && <span className="muted">—</span>}
            </div>
          </div>

          <div className="learner-grid">
            <div>
              <div className="eyebrow">Free</div>
              <ul className="bare-list">
                {avail.map(a => <li key={a}>· {a}</li>)}
                {avail.length === 0 && <li className="muted">—</li>}
              </ul>
            </div>
            <div>
              <div className="eyebrow">Dietary</div>
              <ul className="bare-list">
                {diet.length === 0 && <li>· No restrictions</li>}
                {diet.map(d => <li key={d}>· {d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </article>

      <div className="final-actions">
        <button className="btn btn-primary btn-lg" onClick={() => { window.__simmaCompleteSignup("learner", answers); window.location.href = "Simma.html"; }}>
          Show me cooks nearby <Icon.Arrow size={16}/>
        </button>
        <button className="btn btn-ghost btn-lg" onClick={onRestart}>Start over</button>
      </div>

      <p className="final-note story">
        Within a day, Eline — our matchmaker — will pick three cooks she thinks you'll love and write you a short note about each.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SignupApp />);

// ─── Persist on completion ────────────────────────────────────────────────
window.__simmaCompleteSignup = function (role, answers) {
  try {
    const payload = { role, answers, completedAt: Date.now() };
    localStorage.setItem("simma_account", JSON.stringify(payload));
    localStorage.setItem("simma_signup_toast", "1");
  } catch (e) { /* sandbox may block */ }
};
