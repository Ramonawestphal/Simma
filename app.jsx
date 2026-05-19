// Simma — app shell with top nav and screen routing.

const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "textSize": "m",
  "accent": "rust"
}/*EDITMODE-END*/;

function App() {
  // Top-level nav: discover | cooks | messages | profile
  const [tab, setTab] = useStateApp("discover");
  // Flow within session: null | 'detail' | 'shopping'
  const [flow, setFlow] = useStateApp(null);
  const [selectedId, setSelectedId] = useStateApp(null);
  const [toast, setToast] = useStateApp(null);
  const [account, setAccount] = useStateApp(() => {
    try { return JSON.parse(localStorage.getItem("simma_account") || "null"); }
    catch (e) { return null; }
  });
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // One-time welcome toast after signup
  useEffectApp(() => {
    try {
      if (localStorage.getItem("simma_signup_toast") === "1") {
        const a = JSON.parse(localStorage.getItem("simma_account") || "null");
        const name = a?.answers?.name || "friend";
        const role = a?.role;
        setToast(role === "host"
          ? `Welcome to Simma, ${name} — Eline will write to you within a day.`
          : `You're in, ${name}. Cooks near you are loading below.`);
        localStorage.removeItem("simma_signup_toast");
      }
    } catch (e) { /* sandbox */ }
  }, []);

  useEffectApp(() => {
    document.body.setAttribute("data-text", t.textSize);
    document.body.setAttribute("data-accent", t.accent);
  }, [t.textSize, t.accent]);

  useEffectApp(() => {
    if (!toast) return;
    const long = toast.includes("Welcome to Simma") || toast.includes("You're in,");
    const id = setTimeout(() => setToast(null), long ? 6000 : 2800);
    return () => clearTimeout(id);
  }, [toast]);

  // Scroll to top whenever the visible screen changes
  useEffectApp(() => {
    window.scrollTo({ top: 0 });
  }, [tab, flow, selectedId]);

  const selectedSession = selectedId ? SESSIONS.find(s => s.id === selectedId) : null;

  const openSession = (id) => { setSelectedId(id); setFlow("detail"); };
  const goShopping  = () => setFlow("shopping");
  const confirmJoin = () => {
    setFlow(null); setSelectedId(null); setTab("discover");
    setToast("You're in! Lena will see you tomorrow.");
  };
  const backFromDetail = () => { setFlow(null); setSelectedId(null); };
  const backFromShopping = () => setFlow("detail");

  const switchTab = (next) => {
    setFlow(null);
    setSelectedId(null);
    setTab(next);
  };

  // Decide what to render
  let main = null;
  if (flow === "detail" && selectedSession) {
    main = <SessionDetail session={selectedSession} onBack={backFromDetail} onSignUp={goShopping} />;
  } else if (flow === "shopping" && selectedSession) {
    main = <Shopping session={selectedSession} onBack={backFromShopping} onConfirm={confirmJoin} />;
  } else if (tab === "discover") {
    main = <Discover onOpenSession={openSession} onOpenCooks={() => setTab("cooks")} account={account} onClearAccount={() => { try { localStorage.removeItem("simma_account"); } catch (e) {} setAccount(null); }}/>;
  } else if (tab === "cooks") {
    main = <CooksList onOpenCook={() => {}} />;
  } else if (tab === "messages") {
    main = <Messages />;
  } else if (tab === "profile") {
    main = <Profile onOpenSession={openSession} />;
  }

  return (
    <div className="page">
      <Nav tab={tab} onChange={switchTab}/>
      <main style={{ flex: 1 }}>{main}</main>
      <Footer/>
      {toast && (
        <div className="toast">
          <Icon.Check size={16}/>
          {toast}
        </div>
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

function Nav({ tab, onChange }) {
  const links = [
    { id: "discover", label: "Discover" },
    { id: "cooks",    label: "Cooks" },
    { id: "messages", label: "Messages" },
    { id: "profile",  label: "Profile" },
  ];
  return (
    <header className="nav">
      <div className="nav-inner">
        <span className="brand" onClick={() => onChange("discover")}>
          Sim<span className="brand-dot"></span>ma
        </span>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.id}>
              <button
                className={"nav-link" + (tab === l.id ? " is-active" : "")}
                onClick={() => onChange(l.id)}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <span className="nav-spacer"></span>
        <span className="subtle" style={{ fontSize: 13.5, letterSpacing: "0.04em" }}>Rotterdam</span>
        <span className="nav-profile" onClick={() => onChange("profile")}>
          <img className="avatar avatar-sm" src={LEARNERS[0].photo} alt="Ramona"/>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Ramona</span>
        </span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <span className="brand" style={{ fontSize: 28 }}>
              Sim<span className="brand-dot"></span>ma
            </span>
            <p className="story" style={{ fontSize: 15, marginTop: 14, maxWidth: 360 }}>
              A small Rotterdam project that pairs older cooks with younger neighbors,
              one heritage recipe at a time. No money changes hands — only ingredients,
              stories, and an afternoon.
            </p>
          </div>
          <div>
            <h4>Discover</h4>
            <ul>
              <li>This week</li>
              <li>By cuisine</li>
              <li>By neighborhood</li>
              <li>Meet the cooks</li>
            </ul>
          </div>
          <div>
            <h4>For cooks</h4>
            <ul>
              <li>Host a session</li>
              <li>Cook's guide</li>
              <li>Insurance & safety</li>
            </ul>
          </div>
          <div>
            <h4>Simma</h4>
            <ul>
              <li>Our story</li>
              <li>Partners</li>
              <li>Privacy</li>
              <li>Press kit</li>
            </ul>
          </div>
        </div>
        <div className="footer-credit">
          <span>© 2026 Simma — Rotterdam, the Netherlands</span>
          <span><span className="display-italic">Cook together.</span> &nbsp;Eat together.</span>
        </div>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
