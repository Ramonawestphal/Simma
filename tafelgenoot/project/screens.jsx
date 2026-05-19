// Simma — desktop screens.

const { useState, useEffect, useMemo } = React;

// Helpers
const cookById = (id) => COOKS.find(c => c.id === id);
const learnerById = (id) => LEARNERS.find(l => l.id === id);

// ─── Saved recipes (localStorage) ────────────────────────────────────────
function readSaved() {
  try { return new Set(JSON.parse(localStorage.getItem("simma_saved") || "[]")); }
  catch (e) { return new Set(); }
}
function writeSaved(set) {
  try { localStorage.setItem("simma_saved", JSON.stringify([...set])); } catch (e) {}
}
function useSavedRecipes() {
  const [saved, setSaved] = useState(readSaved);
  const toggle = (id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      writeSaved(next);
      return next;
    });
  };
  return [saved, toggle];
}
// Expose to other modules
window.__useSavedRecipes = useSavedRecipes;

// ─── Filter logic ────────────────────────────────────────────────────────
function matchesFilter(session, filter) {
  if (!filter) return true;
  const cook = cookById(session.cookId);
  if (!cook) return false;
  if (filter === "Nearby") {
    // Jamila is in Centrum — nearby = walking neighborhoods
    return ["Centrum", "Noord", "Delfshaven", "Crooswijk"].includes(cook.neighborhood);
  }
  if (filter === "This week") {
    return /23 May|24 May|25 May|28 May/.test(session.date);
  }
  if (filter === "Vegetarian") {
    // None of our seeded sessions are explicitly vegetarian
    return false;
  }
  // Cuisine match
  return cook.cuisine === filter;
}

function Stars({ rating = 5 }) {
  const full = Math.floor(rating);
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= full ? 1 : 0.3 }}>
          <Icon.Star size={12} />
        </span>
      ))}
    </span>
  );
}

function MetaInline({ icon: I, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: "var(--ink-3)", display: "inline-flex" }}><I size={15} /></span>
      <span>{children}</span>
    </span>
  );
}

function SpotsPill({ left }) {
  if (left <= 0) return <span className="pill" style={{ background: "var(--paper-2)", color: "var(--ink-3)" }}>Fully booked</span>;
  if (left === 1) return <span className="pill pill-rust">Last spot</span>;
  return <span className="pill pill-mustard">{left} spots left</span>;
}

function MatchPill({ pct }) {
  return (
    <span className="pill pill-plum" style={{ gap: 5 }}>
      <span style={{ display: "inline-flex" }} className="sparkle-ico"><Icon.Sparkle size={12} /></span>
      {pct}% match
    </span>
  );
}

// ─── DISCOVER ────────────────────────────────────────────────────────────────

function Discover({ onOpenSession, onOpenCooks, account, onClearAccount }) {
  const [active, setActive] = useState(null);
  const [saved, toggleSaved] = useSavedRecipes();
  const allRecommended = SESSIONS.filter(s => s.match !== null);
  const allFresh = SESSIONS.filter(s => s.match === null);

  const recommended = allRecommended.filter(s => matchesFilter(s, active));
  const fresh = allFresh.filter(s => matchesFilter(s, active));
  const totalMatching = recommended.length + fresh.length;

  const greetingName = account?.answers?.name || "Jamila";
  const accountRole = account?.role;

  return (
    <div className="screen">
      <div className="container">
        {/* Welcome nudge — adapts to account state */}
        <div style={{ paddingTop: 28 }}>
          {account ? (
            <div className="nudge" style={{ borderColor: "var(--teal)", background: "var(--teal-soft)" }}>
              <span className="nudge-mark" style={{ background: "var(--teal)", color: "var(--paper)" }}>
                <Icon.Check size={18}/>
              </span>
              <div className="nudge-text">
                <b>Your Simma account is set up, {greetingName}.</b>{" "}
                {accountRole === "host"
                  ? <>Your kitchen is in <i>draft</i>. Eline reviews every host within a day or two — you'll hear from her soon.</>
                  : <>We've saved your preferences. The matches below are filtered to what you told us you'd love to learn.</>}
              </div>
              <button className="text-link" onClick={onClearAccount}>Reset</button>
            </div>
          ) : (
            <div className="nudge">
              <span className="nudge-mark"><Icon.Heart size={18} /></span>
              <div className="nudge-text">
                <b>Welcome back, Jamila.</b> It's been twelve days since you last cooked with someone. Lena still has two spots open on Saturday.
                {" "}<a href="Signup.html" className="nudge-cta-link">Not signed up? <i>Join the table →</i></a>
              </div>
              <a href="Signup.html" className="nudge-cta">Sign up <Icon.Arrow size={14} /></a>
            </div>
          )}
        </div>

        {/* Hero */}
        <div className="hero">
          <div>
            <div className="eyebrow eyebrow-rust" style={{ marginBottom: 16 }}>
              <Icon.Asterisk size={11} /> &nbsp; Rotterdam · Spring '26
            </div>
            <h1 className="h-hero">Good afternoon,<br/><span className="display-italic">{greetingName}.</span></h1>
            <p className="story" style={{ marginTop: 22, maxWidth: 460 }}>
              Six cooks in your neighborhood are setting the table this week.
              What would you like to learn today?
            </p>
            <div className="filters" style={{ marginTop: 28 }}>
              {FILTERS.map(f => (
                <button key={f}
                  className={"pill pill-filter" + (active === f ? " is-active" : "")}
                  onClick={() => setActive(active === f ? null : f)}>
                  {f}
                </button>
              ))}
              {active && (
                <button className="pill pill-filter pill-clear" onClick={() => setActive(null)}>
                  Clear ×
                </button>
              )}
            </div>
            {active && (
              <div className="muted" style={{ marginTop: 14, fontSize: 14, fontStyle: "italic", fontFamily: "var(--display)" }}>
                {totalMatching === 0
                  ? <>No sessions match <b style={{ color: "var(--ink)" }}>{active}</b> right now. Try another filter.</>
                  : <>Showing {totalMatching} session{totalMatching === 1 ? "" : "s"} matching <b style={{ color: "var(--ink)" }}>{active}</b>.</>}
              </div>
            )}
          </div>

          <div className="hero-photo-wrap">
            <span className="hero-tag">This week's table</span>
            <img className="hero-photo" src={FOOD_PHOTOS.table} alt="A full dining table"/>
          </div>
        </div>

        <div className="rule-double" style={{ marginTop: 8, marginBottom: 56 }}></div>

        {/* Recommended for you */}
        {recommended.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <div className="section-header">
              <div className="lead">
                <div className="eyebrow eyebrow-plum">
                  <span className="sparkle-ico" style={{ display: "inline-flex" }}><Icon.Sparkle size={12} /></span>
                  AI-matched for {greetingName}
                </div>
                <h2 className="h-section">Recommended for you</h2>
              </div>
              <div className="subtle" style={{ maxWidth: 320, textAlign: "right", fontSize: 14 }}>
                Picked by Simma based on the cuisines you've saved, your neighborhood,
                and your usual free afternoons.
              </div>
            </div>

            <div className="grid-3">
              {recommended.map((s, i) => (
                <SessionCard key={s.id} session={s} index={i} onOpen={() => onOpenSession(s.id)}
                             saved={saved.has(s.id)} onToggleSave={() => toggleSaved(s.id)}/>
              ))}
            </div>
          </section>
        )}

        {/* Meet your cooks */}
        <section style={{ marginBottom: 80 }}>
          <div className="section-header">
            <div className="lead">
              <div className="eyebrow eyebrow-rust">— A Simma roster</div>
              <h2 className="h-section">Meet your cooks</h2>
            </div>
            <button className="text-link" onClick={onOpenCooks}>See all six &nbsp;→</button>
          </div>

          <div className="cooks-row">
            {COOKS.map(c => <CookCard key={c.id} cook={c} />)}
          </div>
        </section>

        {/* Newly added */}
        {fresh.length > 0 && (
          <section style={{ marginBottom: 60 }}>
            <div className="section-header">
              <div className="lead">
                <div className="eyebrow">— Just published</div>
                <h2 className="h-section">Newly added</h2>
              </div>
              <div className="subtle" style={{ fontSize: 14 }}>
                {fresh.length} new sessions · updated {new Date().toLocaleDateString("en-GB", { weekday: "long" })}
              </div>
            </div>

            <div className="grid-3">
              {fresh.map((s, i) => (
                <SessionCard key={s.id} session={s} index={recommended.length + i} onOpen={() => onOpenSession(s.id)}
                             saved={saved.has(s.id)} onToggleSave={() => toggleSaved(s.id)}/>
              ))}
            </div>
          </section>
        )}

        {/* Empty state when filtered to nothing */}
        {totalMatching === 0 && (
          <section style={{ marginBottom: 80, textAlign: "center", padding: "60px 20px" }} className="paper">
            <div className="eyebrow eyebrow-rust" style={{ marginBottom: 16, justifyContent: "center" }}>
              <Icon.Asterisk size={11}/> Nothing here yet
            </div>
            <h2 className="h-section" style={{ marginBottom: 12 }}>No matches for <span className="display-italic">{active}</span></h2>
            <p className="story" style={{ margin: "0 auto", maxWidth: 460 }}>
              Try clearing the filter or pick a different one — there are six cooks setting tables this week.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setActive(null)}>
              Show everything
            </button>
          </section>
        )}

        {/* Recent learners */}
        <section style={{ marginBottom: 80 }}>
          <div className="rule" style={{ marginBottom: 28 }}></div>
          <div className="section-header">
            <div className="lead">
              <div className="eyebrow eyebrow-teal">— The other half of the table</div>
              <h2 className="h-section">Learners near you, this week</h2>
            </div>
            <div className="subtle" style={{ fontSize: 14, maxWidth: 280, textAlign: "right" }}>
              Younger neighbors who joined a Simma session in the past seven days.
            </div>
          </div>

          <div className="cooks-row">
            {LEARNERS.map(l => (
              <div key={l.id} className="cook-card">
                <div className="cook-portrait">
                  <img src={l.photo} alt={l.name}/>
                  <span className="frame"></span>
                </div>
                <div>
                  <div className="h-small">{l.name}, {l.age}</div>
                  <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>
                    {l.neighborhood} · learning {l.learning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SessionCard({ session, index, onOpen, saved, onToggleSave }) {
  const cook = cookById(session.cookId);
  const num = String((index ?? 0) + 1).padStart(2, "0");
  return (
    <article className="session-card card-tap" onClick={onOpen}>
      <div className="session-img" style={ session.image ? null : { background: session.imageTint }}>
        {session.image
          ? <img src={session.image} alt={session.dish}/>
          : <span className="placeholder-tag">[ {cook.cuisine.toLowerCase()} · {session.dish.toLowerCase()} ]</span>}
        <span className="session-num">No. {num}</span>
        {session.match !== null && (
          <span className="match-tag">
            <MatchPill pct={session.match} />
          </span>
        )}
        {onToggleSave && (
          <button
            className={"save-btn" + (saved ? " is-saved" : "")}
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            aria-label={saved ? "Remove from your archive" : "Save recipe"}>
            <Icon.Heart size={16}/>
          </button>
        )}
      </div>
      <div className="session-body">
        <div className="eyebrow eyebrow-rust" style={{ color: cook.tagColor }}>{cook.cuisine}</div>
        <h3 className="h-card">{session.dish}</h3>
        <p className="story" style={{ fontSize: 16, margin: 0 }}>
          “{session.storyShort}”
        </p>

        <div className="session-meta-row">
          <MetaInline icon={Icon.Calendar}>{session.date}</MetaInline>
          <MetaInline icon={Icon.Clock}>{session.time.split(" — ")[0]}</MetaInline>
          <SpotsPill left={session.spotsLeft} />
        </div>

        <div className="session-cook-row">
          <img className="avatar" src={cook.photo} alt={cook.name}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{cook.name} {cook.surname.charAt(0)}., {cook.age}</div>
            <div className="muted" style={{ fontSize: 13 }}>{cook.neighborhood}</div>
          </div>
          <Stars rating={cook.rating} />
        </div>
      </div>
    </article>
  );
}

function CookCard({ cook, onOpen }) {
  return (
    <article className="cook-card card-tap" onClick={onOpen}>
      <div className="cook-portrait">
        <img src={cook.photo} alt={cook.name} />
        <span className="frame"></span>
      </div>
      <div>
        <div className="eyebrow" style={{ color: cook.tagColor, fontSize: 11 }}>{cook.cuisine}</div>
        <div className="h-small" style={{ marginTop: 4 }}>{cook.name}, {cook.age}</div>
        <div className="muted" style={{ fontSize: 13.5, marginTop: 4, fontStyle: "italic", fontFamily: "var(--display)" }}>
          “{cook.signature}”
        </div>
      </div>
    </article>
  );
}

// ─── COOKS LIST (own screen) ─────────────────────────────────────────────────

function CooksList({ onOpenCook }) {
  return (
    <div className="screen">
      <div className="container">
        <div style={{ padding: "56px 0 36px" }}>
          <div className="eyebrow eyebrow-rust" style={{ marginBottom: 14 }}>
            <Icon.Asterisk size={11} /> &nbsp; The Simma roster
          </div>
          <h1 className="h-hero" style={{ fontSize: 64 }}>
            Six neighbors,<br/><span className="display-italic">six kitchens.</span>
          </h1>
          <p className="story" style={{ marginTop: 22, maxWidth: 620 }}>
            Each Simma cook has been preparing one dish since long before you or I were born.
            They've offered to set their table for a Saturday — bring the ingredients, bring your time.
          </p>
        </div>

        <div className="rule-double" style={{ marginBottom: 32 }}></div>

        <div className="grid-2" style={{ gap: 40, marginBottom: 60 }}>
          {COOKS.map((c, i) => (
            <CookFeature key={c.id} cook={c} num={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CookFeature({ cook, num }) {
  return (
    <article className="paper" style={{ padding: 24, display: "grid", gridTemplateColumns: "160px minmax(0, 1fr)", gap: 22, alignItems: "start" }}>
      <div className="cook-portrait" style={{ aspectRatio: "3 / 4", borderRadius: 4 }}>
        <img src={cook.photo} alt={cook.name}/>
        <span className="frame"></span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ color: cook.tagColor, marginBottom: 8 }}>
          No. 0{num} &nbsp;·&nbsp; {cook.cuisine}
        </div>
        <h3 className="h-card">{cook.name} {cook.surname}</h3>
        <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
          {cook.age} years old · {cook.neighborhood}, {cook.city}
        </div>
        <div className="rule" style={{ margin: "14px 0" }}></div>
        <div className="story" style={{ fontSize: 16 }}>{cook.bio}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
          <Stars rating={cook.rating}/>
          <span className="subtle" style={{ fontSize: 14 }}>{cook.rating} · {cook.reviews} sessions</span>
          <span className="pill" style={{ background: "var(--paper-2)", marginLeft: "auto" }}>Signature · {cook.signature}</span>
        </div>
      </div>
    </article>
  );
}

// ─── SESSION DETAIL ──────────────────────────────────────────────────────────

function SessionDetail({ session, onBack, onSignUp }) {
  const cook = cookById(session.cookId);
  const joined = (session.joinedLearnerIds || []).map(learnerById).filter(Boolean);
  const [saved, toggleSaved] = useSavedRecipes();
  const isSaved = saved.has(session.id);

  return (
    <div className="screen">
      <div className="container">
        <div style={{ padding: "24px 0 8px" }}>
          <button className="text-link" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon.Back size={14}/> Back to discover
          </button>
        </div>

        <div className="detail-grid">
          {/* Left column */}
          <div>
            <div className="eyebrow eyebrow-rust" style={{ color: cook.tagColor, marginBottom: 14 }}>
              {cook.cuisine} &nbsp;·&nbsp; with {cook.name}
            </div>
            <h1 className="h-hero" style={{ fontSize: 68 }}>
              {session.dish.split(" ")[0]}
              {session.dish.includes(" ") && <><br/><span className="display-italic">{session.dish.split(" ").slice(1).join(" ")}</span></>}
            </h1>
            <div className="muted" style={{ marginTop: 12, fontSize: 16 }}>{session.dishSub}</div>

            <div className="detail-hero-img" style={{ marginTop: 32, ...(session.image ? null : { background: session.imageTint })}}>
              {session.image && <img src={session.image} alt={session.dish}/>}
            </div>

            {/* Story */}
            <div style={{ marginTop: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>— The story behind this dish</div>
              <p className="story" style={{ fontSize: 22, color: "var(--ink)", marginTop: 0 }}>
                “{session.storyLong}”
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
                <img className="avatar" src={cook.photo} alt={cook.name}/>
                <div>
                  <div style={{ fontWeight: 600 }}>{cook.name} {cook.surname}</div>
                  <div className="muted" style={{ fontSize: 14 }}>{cook.neighborhood}, {cook.city}</div>
                </div>
              </div>
            </div>

            {/* Cook bio */}
            <div className="rule-double" style={{ marginTop: 56, marginBottom: 36 }}></div>
            <div style={{ display: "grid", gridTemplateColumns: "200px minmax(0, 1fr)", gap: 28, alignItems: "start" }}>
              <div className="cook-portrait" style={{ aspectRatio: "3 / 4", borderRadius: 4 }}>
                <img src={cook.photo} alt={cook.name}/>
                <span className="frame"></span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="eyebrow eyebrow-rust">Your cook</div>
                <h3 className="h-card" style={{ marginTop: 8 }}>{cook.name}, {cook.age}</h3>
                <div className="muted" style={{ marginTop: 4 }}>
                  <MetaInline icon={Icon.Pin}>{cook.neighborhood}, {cook.city}</MetaInline>
                </div>
                <div className="rule" style={{ margin: "14px 0" }}></div>
                <p className="story" style={{ marginTop: 0 }}>{cook.bio}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
                  <Stars rating={cook.rating}/>
                  <span className="subtle" style={{ fontSize: 14 }}>
                    {cook.rating} from {cook.reviews} previous sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Joined learners */}
            {joined.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <div className="eyebrow eyebrow-teal" style={{ marginBottom: 14 }}>— Who's joining</div>
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <div className="joined">
                    {joined.map(l => <img key={l.id} src={l.photo} alt={l.name}/>)}
                  </div>
                  <div className="subtle" style={{ fontSize: 15 }}>
                    {joined.map(l => l.name).join(", ")} {joined.length === 1 ? "is" : "are"} already signed up.
                    {session.spotsLeft > 0 && ` ${session.spotsLeft} more ${session.spotsLeft === 1 ? "spot" : "spots"} open.`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="detail-aside">
            <div className="paper" style={{ padding: 24 }}>
              <div className="meta-list">
                <div className="meta-row">
                  <span className="meta-ico"><Icon.Calendar size={20}/></span>
                  <div style={{ flex: 1 }}>
                    <div className="meta-label">When</div>
                    <div className="meta-value">{session.date}</div>
                    <div className="muted" style={{ fontSize: 14 }}>{session.time}</div>
                  </div>
                </div>
                <div className="meta-row">
                  <span className="meta-ico"><Icon.Pin size={20}/></span>
                  <div style={{ flex: 1 }}>
                    <div className="meta-label">Where</div>
                    <div className="meta-value">{session.location}</div>
                  </div>
                </div>
                <div className="meta-row">
                  <span className="meta-ico"><Icon.Users size={20}/></span>
                  <div style={{ flex: 1 }}>
                    <div className="meta-label">Group</div>
                    <div className="meta-value">{session.maxSpots - session.spotsLeft} / {session.maxSpots} signed up</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI match */}
            {session.match !== null && (
              <div className="ai-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span className="sparkle-ico"><Icon.Sparkle size={16}/></span>
                  <div className="eyebrow eyebrow-plum" style={{ margin: 0 }}>Why this match</div>
                  <span style={{ flex: 1 }}></span>
                  <span className="display" style={{ fontSize: 28, color: "var(--plum)" }}>{session.match}%</span>
                </div>
                <p className="subtle" style={{ fontSize: 14.5, margin: "6px 0 16px", lineHeight: 1.5 }}>
                  {session.matchReason}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <MatchBar label="Cuisine"      pct={session.matchBreakdown.cuisine} />
                  <MatchBar label="Distance"     pct={session.matchBreakdown.distance} />
                  <MatchBar label="Availability" pct={session.matchBreakdown.availability} />
                </div>
              </div>
            )}

            <div className="paper" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SpotsPill left={session.spotsLeft} />
                <span className="subtle" style={{ fontSize: 13 }}>No payment — just ingredients</span>
              </div>
              <button className="btn btn-primary btn-block btn-lg" onClick={onSignUp}>
                Sign up &amp; get the shopping list
              </button>
              <button
                className={"btn btn-block" + (isSaved ? " btn-saved" : " btn-ghost")}
                style={{ minHeight: 50 }}
                onClick={() => toggleSaved(session.id)}>
                <Icon.Heart size={16}/>
                {isSaved ? "Saved to your archive" : "Save this recipe"}
              </button>
              <div className="muted" style={{ fontSize: 13, textAlign: "center" }}>
                You can cancel up to 24 hours before.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MatchBar({ label, pct }) {
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }}></div></div>
      <div className="bar-val">{pct}%</div>
    </div>
  );
}

// ─── SHOPPING LIST ───────────────────────────────────────────────────────────

function Shopping({ session, onBack, onConfirm }) {
  const cook = cookById(session.cookId);
  const [done, setDone] = useState(() => new Set());
  const toggle = (key) => setDone(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const total =
    (session.ingredients.fresh?.length || 0) +
    (session.ingredients.pantry?.length || 0);

  return (
    <div className="screen">
      <div className="container">
        <div style={{ padding: "24px 0 8px" }}>
          <button className="text-link" onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon.Back size={14}/> Back to session
          </button>
        </div>

        <div className="detail-grid">
          <div>
            <div className="eyebrow eyebrow-rust">— Your ticket to the table</div>
            <h1 className="h-hero" style={{ fontSize: 64, marginTop: 14 }}>
              The shopping<br/><span className="display-italic">list.</span>
            </h1>
            <p className="story" style={{ marginTop: 18, maxWidth: 540 }}>
              For <i>{session.dish}</i> with {cook.name} on {session.date}.
              You bring the ingredients — no money changes hands, that's the whole idea.
            </p>

            <div className="info-banner" style={{ marginTop: 28 }}>
              <span style={{ color: "var(--teal)", display: "inline-flex", marginTop: 2 }}>
                <Icon.Heart size={18}/>
              </span>
              <div>
                <b>You bring the groceries — that's your ticket.</b><br/>
                We add a little extra on a few items so {cook.name} can send leftovers home with you.
              </div>
            </div>

            {/* Fresh */}
            {session.ingredients.fresh.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <h2 className="h-card">Fresh produce</h2>
                  <div className="eyebrow">— Buy day-of</div>
                </div>
                <div className="rule" style={{ margin: "14px 0 4px" }}></div>
                <div className="paper" style={{ padding: "4px 24px", marginTop: 8 }}>
                  {session.ingredients.fresh.map((it, i) => {
                    const key = `f-${i}`;
                    const isDone = done.has(key);
                    return (
                      <div key={key} className={"check-row" + (isDone ? " is-done" : "")} onClick={() => toggle(key)}>
                        <span className="check-num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="check-box">{isDone && <Icon.Check size={14}/>}</span>
                        <span className="check-label">{it.name}</span>
                        <span className="check-amount">{it.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pantry */}
            {session.ingredients.pantry.length > 0 && (
              <div style={{ marginTop: 36 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <h2 className="h-card">Pantry &amp; bottles</h2>
                  <div className="eyebrow">— From the supermarket</div>
                </div>
                <div className="rule" style={{ margin: "14px 0 4px" }}></div>
                <div className="paper" style={{ padding: "4px 24px", marginTop: 8 }}>
                  {session.ingredients.pantry.map((it, i) => {
                    const key = `p-${i}`;
                    const isDone = done.has(key);
                    const num = session.ingredients.fresh.length + i + 1;
                    return (
                      <div key={key} className={"check-row" + (isDone ? " is-done" : "")} onClick={() => toggle(key)}>
                        <span className="check-num">{String(num).padStart(2, "0")}</span>
                        <span className="check-box">{isDone && <Icon.Check size={14}/>}</span>
                        <span className="check-label">{it.name}</span>
                        <span className="check-amount">{it.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="story" style={{ marginTop: 36, fontSize: 17 }}>
              {cook.name} brings: {session.cookBrings}.
            </p>
          </div>

          {/* Sidebar */}
          <aside className="detail-aside">
            <div className="paper" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <img className="avatar avatar-lg" src={cook.photo} alt={cook.name}/>
                <div>
                  <div className="eyebrow" style={{ color: cook.tagColor }}>Your cook</div>
                  <div className="h-small" style={{ marginTop: 4 }}>{cook.name} {cook.surname}</div>
                  <div className="muted" style={{ fontSize: 13.5 }}>{cook.neighborhood}</div>
                </div>
              </div>
              <div className="rule" style={{ margin: "18px 0" }}></div>
              <div className="meta-list" style={{ marginTop: -8 }}>
                <div className="meta-row" style={{ borderBottom: 0, padding: "8px 0" }}>
                  <span className="meta-ico"><Icon.Calendar size={18}/></span>
                  <div className="meta-value" style={{ fontSize: 15 }}>{session.date} · {session.time.split(" — ")[0]}</div>
                </div>
                <div className="meta-row" style={{ borderBottom: 0, padding: "8px 0" }}>
                  <span className="meta-ico"><Icon.Pin size={18}/></span>
                  <div className="meta-value" style={{ fontSize: 15 }}>{session.location}</div>
                </div>
              </div>
            </div>

            <div className="paper" style={{ padding: 22 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>— Progress</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span className="display" style={{ fontSize: 42 }}>{done.size}</span>
                <span className="muted" style={{ fontSize: 16 }}>/ {total} gathered</span>
              </div>
              <div className="bar-track" style={{ marginTop: 10, height: 6 }}>
                <div className="bar-fill" style={{ width: `${(done.size / Math.max(1,total)) * 100}%`, background: "var(--rust)" }}></div>
              </div>
            </div>

            <button className="btn btn-ghost btn-block" style={{ minHeight: 50 }}>
              <Icon.Copy size={18}/> Copy to grocery app
            </button>
            <button className="btn btn-primary btn-block btn-lg" onClick={onConfirm}>
              <Icon.Check size={18}/> Confirm participation
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

function Messages() {
  const [history, setHistory] = useState([]);   // {role, text}[]
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const sentinelRef = React.useRef(null);

  const send = async () => {
    const text = draft.trim();
    if (!text || pending) return;
    setHistory(h => [...h, { role: "user", text }]);
    setDraft("");
    setPending(true);
    try {
      const reply = await window.claude.complete({
        messages: [
          { role: "user", content:
`You are Eline, the warm, gentle matchmaker at Simma — a small Rotterdam project that pairs older home cooks with younger neighbors who want to learn a heritage recipe.

You are messaging Jamila (28, lives in Centrum, learning Surinamese). She recently cooked Pom with Lena, 78, in Overschie.

Reply in 1-3 short sentences. Warm, unhurried. No emoji. Talk like a thoughtful friend, not a chatbot. Reference Simma details where helpful (cooks: Lena/Surinamese, Mirza/Bosnian burek, Carl/Dutch appletaart, Giovanna/Italian lasagna, Fatma/Turkish gözleme, Mike/Cantonese bao).

Jamila says: ${text}` }
        ]
      });
      setHistory(h => [...h, { role: "ai", text: (reply || "").trim() || "Sorry — I lost my words for a moment. Could you ask me again?" }]);
    } catch (e) {
      setHistory(h => [...h, { role: "ai", text: "I couldn't reach my notes just now. Try again in a moment?" }]);
    } finally {
      setPending(false);
    }
  };

  React.useEffect(() => {
    if (sentinelRef.current) {
      sentinelRef.current.scrollIntoView ? null : null; // intentionally no scrollIntoView per safety
    }
  }, [history]);

  return (
    <div className="screen">
      <div className="container">
        <div className="messages-shell">
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div className="eyebrow eyebrow-plum" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Icon.Sparkle size={11}/> Your Simma assistant
            </div>
            <h1 className="h-section">A gentle check-in.</h1>
            <p className="story" style={{ marginTop: 12, fontSize: 17 }}>
              Simma sends you a few warm notes around each session — never spam, never urgent.
            </p>
          </div>

          <div className="rule-double" style={{ margin: "32px 0 12px" }}></div>

          {CHAT.map((block, bi) => (
            <div key={bi}>
              <div className="chat-divider">{block.day}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {block.messages.map((m, i) => {
                  if (m.role === "ai") {
                    return (
                      <div key={i} className="bubble-row">
                        <span className="ai-avatar"><Icon.Sparkle size={14}/></span>
                        <div className="bubble bubble-ai">{m.text}</div>
                      </div>
                    );
                  }
                  if (m.role === "user") {
                    return (
                      <div key={i} className="bubble-row user">
                        <div className="bubble bubble-user">{m.text}</div>
                      </div>
                    );
                  }
                  if (m.role === "ai-actions") {
                    return (
                      <div key={i} className="chat-actions">
                        {m.actions.map((a, j) => (
                          <button key={j} className={"chat-action" + (a.primary ? " primary" : "")}>{a.label}</button>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {/* Live thread */}
          {(history.length > 0 || pending) && (
            <div>
              <div className="chat-divider">Today · live</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {history.map((m, i) => (
                  m.role === "ai" ? (
                    <div key={i} className="bubble-row">
                      <span className="ai-avatar"><Icon.Sparkle size={14}/></span>
                      <div className="bubble bubble-ai">{m.text}</div>
                    </div>
                  ) : (
                    <div key={i} className="bubble-row user">
                      <div className="bubble bubble-user">{m.text}</div>
                    </div>
                  )
                ))}
                {pending && (
                  <div className="bubble-row">
                    <span className="ai-avatar"><Icon.Sparkle size={14}/></span>
                    <div className="bubble bubble-ai bubble-typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Real input — talks to the Simma assistant for real */}
          <form className="chat-live-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <span className="sparkle-ico" style={{ marginRight: 8 }}><Icon.Sparkle size={14}/></span>
            <input
              className="chat-live-field"
              placeholder="Ask Eline something — try “Who's a good first cook for me?”"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={pending}/>
            <button type="submit" className="btn btn-primary chat-live-send" disabled={pending || !draft.trim()}>
              {pending ? "…" : <><Icon.Arrow size={14}/></>}
            </button>
          </form>
          <div className="muted" style={{ fontSize: 13, marginTop: 10, fontStyle: "italic", fontFamily: "var(--display)" }}>
            This thread is live — Eline responds with real generative text so you can test the assistant.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

function Profile({ onOpenSession }) {
  const [role, setRole] = useState("student");
  return (
    <div className="screen">
      <div className="container">
        <div className="profile-hero">
          <img className="avatar avatar-xl" src={LEARNERS[0].photo} alt="Jamila"/>
          <div style={{ flex: 1 }}>
            <div className="eyebrow eyebrow-rust" style={{ marginBottom: 10 }}>— Your Simma profile</div>
            <h1 className="h-hero" style={{ fontSize: 60 }}>
              Jamila <span className="display-italic">El-Amrani.</span>
            </h1>
            <div className="muted" style={{ marginTop: 12, fontSize: 16 }}>
              Centrum, Rotterdam · Member since March 2025 · Learning Surinamese
            </div>
          </div>
          <div className="seg">
            <button className={role === "student" ? "is-active" : ""} onClick={() => setRole("student")}>Student</button>
            <button className={role === "host"    ? "is-active" : ""} onClick={() => setRole("host")}>Host</button>
          </div>
        </div>

        <div className="rule-double" style={{ marginBottom: 32 }}></div>

        {role === "student" ? <StudentView onOpenSession={onOpenSession}/> : <HostView/>}
      </div>
    </div>
  );
}

function StudentView({ onOpenSession }) {
  const [saved] = useSavedRecipes();
  const archive = [
    { sessionId: "pom-lena",          date: "24 May 2026", note: "Lena's mother's biscuit-tin recipe." },
    { sessionId: "appletaart-carl",   date: "5 Apr 2026",  note: "Slightly less sugar — let the apple speak." },
    { sessionId: "gozleme-fatma",     date: "12 Feb 2026", note: "Patience pays you back in flavor." },
  ];
  // Combine canned archive with anything the user has just saved in this session
  const savedExtra = [...saved].filter(id => !archive.find(a => a.sessionId === id)).map(id => ({
    sessionId: id, date: "Just now", note: "You saved this from a session card.",
  }));
  const fullArchive = [...savedExtra, ...archive];
  const savedCount = fullArchive.length;
  return (
    <div style={{ paddingBottom: 60 }}>
      <div className="stat-grid" style={{ marginBottom: 48 }}>
        <Stat num="04" label="Sessions joined"/>
        <Stat num="03" label="Cuisines learned"/>
        <Stat num={String(savedCount).padStart(2, "0")} label="Recipes saved"/>
      </div>

      {/* Upcoming */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-header">
          <div className="lead">
            <div className="eyebrow">— Tomorrow</div>
            <h2 className="h-section">Your next table</h2>
          </div>
        </div>

        <article className="paper" style={{ padding: 24, display: "grid", gridTemplateColumns: "240px minmax(0, 1fr) auto", gap: 28, alignItems: "center" }}>
          <div className="cook-portrait" style={{ aspectRatio: "16 / 11" }}>
            <img src={FOOD_PHOTOS.pom} alt="Pom"/>
            <span className="frame"></span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow eyebrow-rust">Surinamese · with Lena</div>
            <h3 className="h-card" style={{ marginTop: 6 }}>Pom</h3>
            <div className="muted" style={{ marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <MetaInline icon={Icon.Calendar}>Sat 24 May · 14:00</MetaInline>
              <MetaInline icon={Icon.Pin}>Overschie</MetaInline>
            </div>
          </div>
          <button className="btn btn-outline" onClick={() => onOpenSession("pom-lena")}>View session</button>
        </article>
      </section>

      {/* Heritage archive */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-header">
          <div className="lead">
            <div className="eyebrow eyebrow-rust">— Recipes you've gathered</div>
            <h2 className="h-section">Your heritage archive</h2>
          </div>
          <div className="subtle" style={{ fontSize: 14 }}>{savedCount} saved · only visible to you</div>
        </div>

        <div className="paper" style={{ padding: "4px 28px" }}>
          {fullArchive.map((a, i) => {
            const s = SESSIONS.find(x => x.id === a.sessionId);
            if (!s) return null;
            const c = cookById(s.cookId);
            return (
              <div key={i} className="check-row" style={{ cursor: "default" }}>
                <span className="check-num">{String(i + 1).padStart(2, "0")}</span>
                <img className="avatar avatar-sm" src={c.photo} alt={c.name}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span className="h-small">{s.dish}</span>
                    <span className="muted" style={{ fontSize: 13 }}>· {c.name} {c.surname} · {a.date}</span>
                  </div>
                  <div className="story" style={{ fontSize: 15, marginTop: 4 }}>“{a.note}”</div>
                </div>
                <button className="text-link">Open</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cooks you've met */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-header">
          <div className="lead">
            <div className="eyebrow">— On a first-name basis</div>
            <h2 className="h-section">Cooks you've met</h2>
          </div>
        </div>
        <div className="cooks-row">
          {COOKS.slice(0, 3).map(c => <CookCard key={c.id} cook={c} />)}
        </div>
      </section>
    </div>
  );
}

function HostView() {
  const [form, setForm] = useState({
    dish: "", story: "", ingredients: "", date: "", maxParticipants: 4,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ paddingBottom: 60 }}>
      <div className="stat-grid" style={{ marginBottom: 48 }}>
        <Stat num="03" label="Sessions hosted"/>
        <Stat num="11" label="Students welcomed"/>
        <Stat num="4.9 ★" label="Average rating"/>
      </div>

      {/* Active session */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-header">
          <div className="lead">
            <div className="eyebrow eyebrow-rust">— Open right now</div>
            <h2 className="h-section">Your upcoming session</h2>
          </div>
          <button className="text-link">Manage all →</button>
        </div>

        <article className="paper" style={{ padding: 24, display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 28, alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow eyebrow-rust">Surinamese · Pom</div>
            <h3 className="h-card" style={{ marginTop: 6 }}>Pom for four</h3>
            <div className="muted" style={{ marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <MetaInline icon={Icon.Calendar}>Sat 24 May · 14:00</MetaInline>
              <MetaInline icon={Icon.Users}>2 of 4 signed up</MetaInline>
              <span className="pill pill-mustard">2 spots open</span>
            </div>
            <div className="joined" style={{ marginTop: 14 }}>
              {[0, 3].map(i => <img key={i} src={LEARNERS[i].photo} alt={LEARNERS[i].name}/>)}
            </div>
          </div>
          <button className="btn btn-outline btn-lg">Manage session</button>
        </article>
      </section>

      {/* Offer a new dish */}
      <section style={{ marginBottom: 56 }}>
        <div className="section-header">
          <div className="lead">
            <div className="eyebrow">— Set the table again</div>
            <h2 className="h-section">Offer a new dish</h2>
          </div>
          <div className="subtle" style={{ fontSize: 14, maxWidth: 280, textAlign: "right" }}>
            Simma turns your text into a shopping list for your students.
          </div>
        </div>

        <div className="paper" style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Name of the dish</label>
            <input className="input" placeholder="e.g. Oma's appeltaart"
                   value={form.dish} onChange={e => upd("dish", e.target.value)}/>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>The story behind this dish</label>
            <textarea className="textarea"
                      placeholder="Where did this dish come from? Whose hands made it before yours?"
                      value={form.story} onChange={e => upd("story", e.target.value)}/>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>What should students bring?</label>
            <textarea className="textarea"
                      placeholder="e.g. 1 kg apples, 200 g cold butter, 1 lemon, 2 tsp cinnamon…"
                      value={form.ingredients} onChange={e => upd("ingredients", e.target.value)}/>
            <span className="help">
              <span className="sparkle-ico"><Icon.Sparkle size={12}/></span>
              Simma will format this into a tidy list for each student.
            </span>
          </div>

          <div className="field">
            <label>Date &amp; time</label>
            <input className="input" placeholder="Sat 14 Jun · 14:00"
                   value={form.date} onChange={e => upd("date", e.target.value)}/>
          </div>

          <div className="field">
            <label>Maximum students</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[2,3,4,5,6].map(n => (
                <button key={n}
                  className="pill pill-filter"
                  onClick={() => upd("maxParticipants", n)}
                  style={{
                    minWidth: 50, minHeight: 50,
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    background: form.maxParticipants === n ? "var(--rust)" : "var(--paper)",
                    color: form.maxParticipants === n ? "var(--paper)" : "var(--ink)",
                    borderColor: form.maxParticipants === n ? "var(--rust)" : "var(--border)",
                  }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button className="btn btn-ghost">Save draft</button>
            <button className="btn btn-primary"><Icon.Plus size={18}/> Publish session</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div className="stat">
      <span className="stat-num">{num}</span>
      <span className="stat-lbl" style={{ maxWidth: 130, textAlign: "right" }}>{label}</span>
    </div>
  );
}

Object.assign(window, {
  Discover, CooksList, SessionDetail, Shopping, Messages, Profile,
});
