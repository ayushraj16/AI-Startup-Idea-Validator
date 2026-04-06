'use client';

import { useState, useEffect, useRef } from 'react';

const STATUS_MSGS = [
  'Scanning 10,000 market signals...',
  'Profiling your ideal customer...',
  'Stress-testing the business model...',
  'Mapping the competitive landscape...',
  'Calculating profitability vectors...',
  'Assembling the report...',
];

const STEPS = ['Research', 'Market', 'Score', 'Report'];

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 14, height: 14,
      border: '2px solid transparent', borderTopColor: 'currentColor',
      borderRadius: '50%', animation: 'spin 0.7s linear infinite', verticalAlign: 'middle'
    }} />
  );
}

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setFilled(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circ - (filled / 100) * circ;
  const color = score >= 70 ? '#00e5a0' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle
        cx={60} cy={60} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.3s' }}
      />
      <text x={60} y={56} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={700} fontFamily="'DM Mono', monospace">{score}</text>
      <text x={60} y={72} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily="'DM Mono', monospace">/100</text>
    </svg>
  );
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const msgTimer = useRef(null);
  const stepTimers = useRef([]);

  useEffect(() => { setMounted(true); }, []);

  const startProgress = () => {
    setStep(1);
    setMsgIdx(0);
    msgTimer.current = setInterval(() => setMsgIdx(i => (i + 1) % STATUS_MSGS.length), 1800);
    const delays = [900, 1800, 2700];
    delays.forEach((d, i) => {
      const t = setTimeout(() => setStep(i + 2), d);
      stepTimers.current.push(t);
    });
  };

  const stopProgress = () => {
    if (msgTimer.current) clearInterval(msgTimer.current);
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    setReport(null);
    startProgress();

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setTimeout(() => {
          stopProgress();
          setStep(4);
          setTimeout(() => {
            setReport(data.data);
            setLoading(false);
          }, 600);
        }, 3400);
      } else {
        stopProgress();
        setLoading(false);
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      stopProgress();
      setLoading(false);
      alert('Failed to connect to the server.');
    }
  };

  const reset = () => {
    setReport(null);
    setTitle('');
    setDescription('');
    setStep(0);
    setLoading(false);
  };

  const riskColor = (r) =>
    r === 'Low' ? '#00e5a0' : r === 'Medium' ? '#fbbf24' : '#f87171';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0,229,160,0.3); }
          100% { box-shadow: 0 0 0 18px rgba(0,229,160,0); }
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          font-family: 'Light 300', rubik;
          background: #080b10;
          color: #e2e8f0;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .scanline {
          position: fixed; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to bottom, transparent, rgba(0,229,160,0.15), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none; z-index: 999;
        }
        .grid-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .glow-orb {
          position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .page { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; padding: 3rem 1.5rem 4rem; }
        .header { text-align: center; margin-bottom: 3rem; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; letter-spacing: 0.18em; color: #00e5a0;
          border: 1px solid rgba(0,229,160,0.3); border-radius: 20px;
          padding: 4px 14px; margin-bottom: 1.25rem;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #00e5a0; animation: blink 1.5s ease infinite; }
        h1 {
          font-family: 'Light 300', rubik;
          font-size: clamp(28px, 6vw, 46px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -1.5px;
          color: #fff;
        }
        h1 .accent {
          background: linear-gradient(90deg, #00e5a0, #38bdf8, #00e5a0);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 10px; letter-spacing: 0.02em; }
        .form-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }
        .form-wrap::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,229,160,0.5), transparent);
        }
        label {
          display: block; font-size: 10px; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.4); margin-bottom: 8px;
        }
        .field { margin-bottom: 1.25rem; }
        input[type="text"], textarea {
          width: 100%; padding: 12px 14px;
          font-family: 'Light 300', rubik; font-size: 13px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #e2e8f0; outline: none;
          transition: border-color 0.2s, background 0.2s;
          resize: none;
        }
        input[type="text"]:focus, textarea:focus {
          border-color: rgba(0,229,160,0.5);
          background: rgba(0,229,160,0.04);
        }
        textarea { height: 100px; line-height: 1.6; }
        .submit-btn {
          width: 100%; padding: 14px;
          font-family: 'Light 300', rubik; font-size: 14px; font-weight: 700;
          letter-spacing: 0.05em;
          background: #00e5a0; color: #080b10;
          border: none; border-radius: 10px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          position: relative; overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 30px rgba(0,229,160,0.4);
          animation: pulse-ring 1s ease-out infinite;
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .steps-row { display: flex; align-items: flex-start; margin-bottom: 1rem; }
        .step-item { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
        .step-item:not(:last-child)::after {
          content: ''; position: absolute; top: 10px; left: 50%; width: 100%;
          height: 1px; background: rgba(255,255,255,0.08);
        }
        .step-dot {
          width: 20px; height: 20px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 500; z-index: 1;
          color: rgba(255,255,255,0.3); transition: all 0.4s;
        }
        .step-dot.active { background: #00e5a0; color: #080b10; border-color: #00e5a0; box-shadow: 0 0 12px rgba(0,229,160,0.6); }
        .step-dot.done { background: rgba(0,229,160,0.15); color: #00e5a0; border-color: rgba(0,229,160,0.4); }
        .step-lbl { font-size: 9px; letter-spacing: 0.1em; color: rgba(255,255,255,0.25); margin-top: 6px; }
        .status-text { font-size: 11px; color: #00e5a0; letter-spacing: 0.08em; text-align: center; min-height: 16px; opacity: 0.8; }
        .report-wrap { margin-top: 2rem; animation: fadeUp 0.5s ease both; }
        .report-top {
          display: grid; grid-template-columns: auto 1fr; gap: 1.5rem; align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 1.5rem;
          margin-bottom: 12px; position: relative; overflow: hidden;
        }
        .report-top::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at top right, rgba(0,229,160,0.07), transparent 60%);
          pointer-events: none;
        }
        .report-meta { display: flex; flex-direction: column; gap: 8px; }
        .report-title {
          font-family: 'Light 300', rubik;
          font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.5px;
        }
        .risk-pill {
          display: inline-block; font-size: 10px; letter-spacing: 0.1em;
          padding: 4px 12px; border-radius: 20px; font-weight: 500;
          border: 1px solid; width: fit-content;
        }
        .score-label { font-size: 10px; letter-spacing: 0.12em; color: rgba(255,255,255,0.35); }
        .risk-reason { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.5; }
        .blocks { display: flex; flex-direction: column; gap: 10px; }
        .block {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 1.25rem;
          animation: fadeUp 0.4s ease both;
        }
        .block-title { font-size: 9px; letter-spacing: 0.18em; color: rgba(255,255,255,0.3); margin-bottom: 10px; }
        .block-body { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.7; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .tag {
          font-size: 11px; padding: 4px 10px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.55);
          transition: border-color 0.2s, color 0.2s; cursor: default;
        }
        .tag:hover { border-color: rgba(0,229,160,0.4); color: #00e5a0; }
        .reset-btn {
          width: 100%; margin-top: 1.25rem; padding: 12px;
          font-family: 'Light 300', rubik; font-size: 12px;
          background: transparent; color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .reset-btn:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.6); }
        @media (max-width: 480px) {
          .two-col { grid-template-columns: 1fr; }
          .report-top { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="scanline" />
      <div className="grid-bg" />
      <div className="glow-orb" style={{ width: 400, height: 400, top: -100, right: -100, background: 'rgba(0,229,160,0.06)' }} />
      <div className="glow-orb" style={{ width: 300, height: 300, bottom: 100, left: -80, background: 'rgba(56,189,248,0.05)' }} />

      <div className="page">
        <div className="header" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            AI-POWERED ANALYSIS
          </div>
          <h1>Validate your<br /><span className="accent">startup idea</span></h1>
          <p className="sub">Drop your concept. Get a brutal honest report in seconds.</p>
        </div>

        {!report ? (
          <form onSubmit={handleSubmit}>
            <div className="form-wrap">
              <div className="field">
                <label>STARTUP TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Uber for Dog Walking"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>DESCRIPTION</label>
                <textarea
                  placeholder="Describe your idea — the problem, the solution, who it's for..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="submit-btn" type="submit" disabled={loading} style={{ marginTop: 12 }}>
              {loading ? <><Spinner /> Analyzing...</> : '→ Validate Idea'}
            </button>

            {loading && (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="steps-row">
                  {STEPS.map((s, i) => (
                    <div className="step-item" key={s}>
                      <div className={`step-dot${step === i + 1 ? ' active' : step > i + 1 ? ' done' : ''}`}>
                        {step > i + 1 ? '✓' : i + 1}
                      </div>
                      <div className="step-lbl">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="status-text">{STATUS_MSGS[msgIdx]}</div>
              </div>
            )}
          </form>
        ) : (
          <div className="report-wrap">
            <div className="report-top">
              <div>
                <div className="score-label" style={{ marginBottom: 8 }}>PROFITABILITY</div>
                <ScoreRing score={report.profitabilityScore} />
              </div>
              <div className="report-meta">
                <div className="report-title">{title}</div>
                <span
                  className="risk-pill"
                  style={{
                    color: riskColor(report.riskLevel),
                    borderColor: `${riskColor(report.riskLevel)}40`,
                    background: `${riskColor(report.riskLevel)}12`,
                  }}
                >
                  {report.riskLevel?.toUpperCase()} RISK
                </span>
                <div className="risk-reason">{report.riskReason}</div>
              </div>
            </div>

            <div className="blocks">
              {[
                { title: 'PROBLEM SUMMARY', body: report.problemSummary, delay: '0.05s' },
                { title: 'CUSTOMER PERSONA', body: report.customerPersona, delay: '0.1s' },
                { title: 'MARKET OVERVIEW', body: report.marketOverview, delay: '0.15s' },
              ].map(({ title: t, body, delay }) => (
                <div className="block" key={t} style={{ animationDelay: delay }}>
                  <div className="block-title">{t}</div>
                  <div className="block-body">{body}</div>
                </div>
              ))}

              <div className="two-col" style={{ animationDelay: '0.2s' }}>
                <div className="block" style={{ margin: 0 }}>
                  <div className="block-title">COMPETITORS</div>
                  <div className="tags">
                    {report.competitorList?.map((c, i) => <span className="tag" key={i}>{c}</span>)}
                  </div>
                </div>
                <div className="block" style={{ margin: 0 }}>
                  <div className="block-title">TECH STACK</div>
                  <div className="tags">
                    {report.suggestedTechStack?.map((t, i) => <span className="tag" key={i}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <button className="reset-btn" onClick={reset}>← Validate another idea</button>
          </div>
        )}
      </div>
    </>
  );
}