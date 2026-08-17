import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { dogMenu, getPairing, humanMenu, type DogEnergy, type Mood } from './data/menu';
import { getExperienceProfile } from './lib/experience';
import { createSceneContract, mountSceneContract } from './lib/kpgs';
import './three.css';
import './accessibility.css';

const PotjieScene = lazy(() => import('./components/PotjieScene').then((module) => ({ default: module.PotjieScene })));

const moods: { id: Mood; label: string; icon: string }[] = [
  { id: 'slow', label: 'Slow & cosy', icon: '🫕' },
  { id: 'sunny', label: 'Bright & easy', icon: '☀️' },
  { id: 'bold', label: 'Big comfort', icon: '🔥' },
];

const energies: { id: DogEnergy; label: string; icon: string }[] = [
  { id: 'nap', label: 'Nap mode', icon: '😴' },
  { id: 'stroll', label: 'Walkies', icon: '🐕' },
  { id: 'zoomies', label: 'Zoomies', icon: '⚡' },
];

function PotjieFallback() {
  return (
    <>
      <div className="steam steam-a">🐾</div>
      <div className="steam steam-b">•</div>
      <div className="steam steam-c">🐾</div>
      <div className="pot-lid" />
      <div className="pot"><span>slow food<br />fast tails</span></div>
      <div className="pot-leg left" /><div className="pot-leg right" />
    </>
  );
}

function App() {
  const [mood, setMood] = useState<Mood>('slow');
  const [energy, setEnergy] = useState<DogEnergy>('stroll');
  const [online, setOnline] = useState(() => navigator.onLine);
  const profile = useMemo(() => getExperienceProfile(), []);
  const pairing = useMemo(() => getPairing(mood, energy), [mood, energy]);
  const prefersReducedMotion = useReducedMotion();
  const animate = profile.tier !== 'lite' && profile.webgl && !profile.saveData && !prefersReducedMotion;

  useEffect(() => {
    mountSceneContract(createSceneContract(profile));
    const sync = () => setOnline(navigator.onLine);
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, [profile]);

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Paws and Potjie home">
          <span className="brand-mark">P&P</span>
          <span>Paws & Potjie</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#pairing">Pair my table</a>
          <a href="#menu">Menu</a>
          <a href="#promise">Paw-safe promise</a>
        </nav>
        <span
          className="runtime-pill"
          title="Adaptive experience tier"
          aria-label={`${online ? 'Online' : 'Offline'}, ${profile.tier} experience tier`}
        >
          {online ? '●' : '○'} {profile.tier}
        </span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">CAPE TOWN • COMFORT KITCHEN • DOGS WELCOME</p>
          <motion.h1 initial={animate ? { opacity: 0, y: 24 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            Comfort food<br />for the whole <em>pack.</em>
          </motion.h1>
          <p className="hero-lede">A fictional South African kitchen where your potjie gets a seat, your dog gets a bowl, and nobody has to pretend the best part of Sunday lunch is the salad.</p>
          <div className="hero-actions">
            <a className="button primary" href="#pairing">Find our pairing</a>
            <a className="button ghost" href="#menu">Read the menu ↓</a>
          </div>
          <div className="trust-row" aria-label="Experience features">
            <span>Offline-ready</span><span>Mobile-first</span><span>Adaptive 3D</span><span>Reduced-motion aware</span>
          </div>
        </div>

        <div
          className={`potjie-stage ${profile.tier === 'lite' ? '' : 'has-webgl'}`}
          role="img"
          aria-label="An adaptive illustrated potjie scene with paw-shaped steam"
        >
          <div className="sun-disc" />
          {profile.tier === 'lite' ? (
            <PotjieFallback />
          ) : (
            <Suspense fallback={<PotjieFallback />}>
              <PotjieScene tier={profile.tier} animate={animate} />
            </Suspense>
          )}
          <div className="stage-caption"><span>{profile.tier === 'lite' ? 'LITE / CSS' : `THREE / ${profile.tier.toUpperCase()}`}</span><strong>Sunday energy</strong></div>
        </div>
      </section>

      <section className="marquee" aria-label="Kitchen values"><div>GOOD FOOD • GOOD DOGS • GOOD PEOPLE • NO BORING LANDING PAGES • </div></section>

      <section className="pairing-section" id="pairing">
        <div className="section-heading">
          <p className="eyebrow">THE COMFORT COMPASS</p>
          <h2>Tell the kitchen how the pack is feeling.</h2>
          <p>Two taps. One deterministic pairing. No AI theatre required.</p>
        </div>

        <div className="chooser-grid">
          <div className="choice-panel">
            <span className="step">01 / HUMAN</span>
            <h3>What kind of comfort do you need?</h3>
            <div className="choice-buttons">
              {moods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={mood === item.id}
                  className={mood === item.id ? 'selected' : ''}
                  onClick={() => setMood(item.id)}
                ><span aria-hidden="true">{item.icon}</span>{item.label}</button>
              ))}
            </div>
          </div>
          <div className="choice-panel">
            <span className="step">02 / DOG</span>
            <h3>Current tail operating mode?</h3>
            <div className="choice-buttons">
              {energies.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={energy === item.id}
                  className={energy === item.id ? 'selected' : ''}
                  onClick={() => setEnergy(item.id)}
                ><span aria-hidden="true">{item.icon}</span>{item.label}</button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={`${mood}-${energy}`}
            className="pairing-result"
            aria-live="polite"
            initial={animate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animate ? { opacity: 0, y: -8 } : undefined}
            transition={{ duration: .28 }}
          >
            <div className="receipt-tag">KITCHEN RECEIPT / MATCH {mood.toUpperCase()} × {energy.toUpperCase()}</div>
            <p className="pair-line">“{pairing.line}”</p>
            <div className="pair-cards">
              <div><span>FOR YOU</span><strong>{pairing.humanItem.name}</strong><small>{pairing.humanItem.ingredients}</small></div>
              <div className="plus" aria-hidden="true">+</div>
              <div><span>FOR THE SUPERVISOR 🐾</span><strong>{pairing.dogItem.name}</strong><small>{pairing.dogItem.ingredients}</small></div>
            </div>
          </motion.article>
        </AnimatePresence>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading split"><div><p className="eyebrow">FROM THE POT</p><h2>Human comfort.</h2></div><p>Built like a Sunday: warm, generous, and not in a hurry.</p></div>
        <div className="menu-grid">
          {humanMenu.map((item) => <article className="menu-card" key={item.name}><span className="menu-number">{item.accent}</span><div className="dish-icon" aria-hidden="true">🫕</div><h3>{item.name}</h3><p>{item.note}</p><small>{item.ingredients}</small></article>)}
        </div>

        <div className="section-heading split dog-heading"><div><p className="eyebrow">FROM THE PAW PANTRY</p><h2>Dog-side comfort.</h2></div><p>Plain, separate, fictional menu concepts — because the dog does not need your peri-peri.</p></div>
        <div className="menu-grid dog-grid">
          {dogMenu.map((item) => <article className="menu-card" key={item.name}><span className="menu-number">{item.accent}</span><div className="dish-icon" aria-hidden="true">🐾</div><h3>{item.name}</h3><p>{item.note}</p><small>{item.ingredients}</small></article>)}
        </div>
      </section>

      <section className="story-band">
        <p className="eyebrow">WHY THIS EXISTS</p>
        <p className="story-copy">Some restaurants tolerate dogs. <strong>We designed the table around the pack.</strong> Paws & Potjie treats comfort as a shared ritual: smell, warmth, waiting, wandering, and the tiny ceremony of everybody getting their own bowl.</p>
      </section>

      <section className="promise" id="promise">
        <div className="promise-badge" aria-hidden="true">🐾</div>
        <div><p className="eyebrow">THE PAW-SAFE PROMISE</p><h2>Separate bowl. Separate logic.</h2><p>Dog menu concepts use deliberately plain ingredient lists and stay visually separated from the human menu. This is a fictional frontend concept, not veterinary or nutritional advice; real diets should be checked for the individual dog.</p></div>
        <div className="promise-rules"><span>01 No shared seasoning</span><span>02 Ingredient visibility</span><span>03 Human confirmation first</span><span>04 Claims stay bounded</span></div>
      </section>

      <footer>
        <div><span className="brand-mark">P&P</span><h2>Bring the human.<br />Bring the hound.</h2></div>
        <div className="footer-meta"><span>Built in Cape Town 🇿🇦</span><span>TypeScript 7 • React 19 • Three.js • Adaptive PWA</span><span>KPGS boundary: INTERACTION ≠ PRODUCT CLAIM</span><a href="https://github.com/RobynAwesome/paws-and-potjie">Source ↗</a></div>
      </footer>

      {!online && <div className="offline-toast" role="status">Offline mode active — the kitchen still works. 🐾</div>}
    </main>
  );
}

export default App;
