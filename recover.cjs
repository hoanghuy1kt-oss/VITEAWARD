const fs = require('fs');

const originalCss = fs.readFileSync('src/index.css', 'utf-8');
const lines = originalCss.split('\n');

// Keep everything up to line 3732 (index 3731)
const goodLines = lines.slice(0, 3732);

const appendCss = `}

.vc-card-img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.vote-category-card:hover .vc-card-img img {
  transform: scale(1.08);
}

.vc-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
  background: linear-gradient(to top, rgba(10, 15, 30, 0.95) 0%, rgba(10, 15, 30, 0.4) 60%, transparent 100%);
  pointer-events: none;
}

.vc-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
}

.vc-card-id {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gold-200);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(4px);
}

.vc-card-title {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vc-btn-vote {
  margin-top: auto;
  width: 100%;
  padding: 10px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;
}

.vote-category-card:hover .vc-btn-vote {
  background: linear-gradient(135deg, #d4af37, #f2d680);
  color: var(--navy-900);
  border-color: transparent;
  font-weight: 600;
}

.vote-tabs {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  flex-wrap: nowrap;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
}

.vote-tabs button {
  padding: 10px 20px;
  border-radius: 100px;
  background: transparent;
  color: rgba(255,255,255,0.7);
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: inherit;
  white-space: nowrap;
}

.vote-tabs button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.vote-tabs button.active {
  background: linear-gradient(135deg, #d4af37, #f2d680);
  color: var(--navy-900);
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

/* =========================================================================
   CHECKLIST VOTE EFFECT
   ========================================================================= */
.vote-checklist {
  --check: #fff;
  --disabled: #c3c8de;
  display: flex;
  align-items: center;
  position: relative;
}

.vote-checklist label {
  position: relative;
  cursor: pointer;
  display: grid;
  align-items: center;
  width: fit-content;
  transition: color 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: 'Be Vietnam Pro', sans-serif;
  margin: 0;
}

.vote-checklist label::after {
  content: "";
  position: absolute;
  height: 4px;
  width: 4px;
  top: 50%;
  left: -20px;
  transform: translateY(-50%);
  border-radius: 50%;
  opacity: 0;
}

.vote-checklist input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  height: 24px;
  width: 24px;
  outline: none;
  border: 1.5px solid transparent;
  border-radius: 4px;
  margin: 0 10px 0 0;
  cursor: pointer;
  background: transparent;
  display: grid;
  align-items: center;
  transition: all 0.3s ease;
}

.vote-checklist input[type="checkbox"]::before,
.vote-checklist input[type="checkbox"]::after {
  content: "";
  position: absolute;
  height: 2px;
  top: auto;
  background: var(--check);
  border-radius: 2px;
}

.vote-checklist input[type="checkbox"]::before {
  width: 0px;
  right: 60%;
  transform-origin: right bottom;
}

.vote-checklist input[type="checkbox"]::after {
  width: 0px;
  left: 40%;
  transform-origin: left bottom;
}

.vote-checklist input[type="checkbox"]:checked {
  background: var(--gold-200);
  border-color: var(--gold-200);
}

.vote-checklist input[type="checkbox"]:checked::before {
  animation: check-01 0.4s ease forwards;
}

.vote-checklist input[type="checkbox"]:checked::after {
  animation: check-02 0.4s ease forwards;
}

.vote-checklist input[type="checkbox"]:checked + label {
  color: var(--gold-200);
}

.vote-checklist input[type="checkbox"]:checked + label::after {
  animation: firework 0.5s ease forwards 0.1s;
}

@keyframes check-01 {
  0% { width: 4px; top: auto; transform: rotate(0); }
  50% { width: 0px; top: auto; transform: rotate(0); }
  51% { width: 0px; top: 12px; transform: rotate(45deg); }
  100% { width: 6px; top: 12px; transform: rotate(45deg); }
}

@keyframes check-02 {
  0% { width: 4px; top: auto; transform: rotate(0); }
  50% { width: 0px; top: auto; transform: rotate(0); }
  51% { width: 0px; top: 12px; transform: rotate(-45deg); }
  100% { width: 12px; top: 12px; transform: rotate(-45deg); }
}

@keyframes firework {
  0% { 
    opacity: 1; 
    box-shadow: 0 0 0 -2px var(--gold-200), 0 0 0 -2px var(--gold-200), 0 0 0 -2px var(--gold-200), 0 0 0 -2px var(--gold-200), 0 0 0 -2px var(--gold-200), 0 0 0 -2px var(--gold-200); 
  }
  30% { opacity: 1; }
  100% { 
    opacity: 0; 
    box-shadow: 0 -15px 0 0px var(--gold-200), 14px -8px 0 0px var(--gold-200), 14px 8px 0 0px var(--gold-200), 0 15px 0 0px var(--gold-200), -14px 8px 0 0px var(--gold-200), -14px -8px 0 0px var(--gold-200); 
  }
}`;

fs.writeFileSync('src/index.css', goodLines.join('\n') + '\n' + appendCss + '\n');
