import { useState } from 'react';
import { BookOpen, ClipboardList, PenTool } from 'lucide-react';
import { PracticeMode } from './components/PracticeMode';
import { MockTestMode } from './components/MockTestMode';
import { ReferencePanel } from './components/ReferencePanel';
import { GitHubPagesGuide } from './components/GitHubPagesGuide';

type AppMode = 'practice' | 'mock';

export default function App() {
  const [mode, setMode] = useState<AppMode>('practice');
  const [referenceOpen, setReferenceOpen] = useState<boolean>(false);
  const [deployGuideOpen, setDeployGuideOpen] = useState<boolean>(false);

  const openAndScrollTo = (id: string, setter: (val: boolean) => void) => {
    setter(true);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b121c] text-[#eef2f6]">
      {/* Top Bar: 3-zone contract */}
      <header className="bg-[#121c2a] border-b-2 border-[#2e435e]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setMode('practice');
            }}
            className="font-retro text-lg sm:text-xl font-bold tracking-tight text-[#4ade80] whitespace-nowrap shrink-0"
          >
            QuadraMath &apos;96
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-retro text-[#a5b4c7]">
            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`hover:text-[#eef2f6] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 ${
                mode === 'practice'
                  ? 'text-[#eef2f6] border-[#4ade80]'
                  : 'border-transparent'
              }`}
            >
              Practice Mode
            </button>
            <button
              type="button"
              onClick={() => setMode('mock')}
              className={`hover:text-[#eef2f6] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 ${
                mode === 'mock'
                  ? 'text-[#eef2f6] border-[#4ade80]'
                  : 'border-transparent'
              }`}
            >
              Mock Test
            </button>
            <button
              type="button"
              onClick={() => openAndScrollTo('formula-reference', setReferenceOpen)}
              className="hover:text-[#eef2f6] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 border-transparent"
            >
              Formula Reference
            </button>
            <button
              type="button"
              onClick={() => openAndScrollTo('deploy-guide', setDeployGuideOpen)}
              className="hover:text-[#eef2f6] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 border-transparent"
            >
              GitHub Pages
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setReferenceOpen((prev) => !prev)}
              className="retro-btn px-3.5 py-2 bg-[#173528] border-[#4ade80] text-[#4ade80] text-xs font-retro font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer hover:bg-[#1f4736]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{referenceOpen ? 'Hide Formulas' : 'Show Formulas'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Page Reviewer Workspace */}
      <main id="top" className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 py-6">
        {/* Program Heading & Mode Switcher Toolbar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#223348]">
          <div className="space-y-1">
            <h1 className="font-retro text-xl sm:text-2xl font-bold text-[#eef2f6] text-balance">
              Grade 10 Quadratic Equations &amp; Functions Reviewer
            </h1>
            <p className="text-sm text-[#a5b4c7]">
              Nature of Roots (<span className="font-retro text-[#4ade80]">D = b&sup2; &minus; 4ac</span>) &middot; Determining Quadratic Functions
            </p>
          </div>

          {/* Primary Mode Segmented Control */}
          <div
            className="flex items-center gap-2 shrink-0"
            role="tablist"
            aria-label="Reviewer Modes"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'practice'}
              onClick={() => setMode('practice')}
              className={`retro-btn px-4 py-2.5 font-retro text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'practice'
                  ? 'bg-[#173528] border-[#4ade80] text-[#4ade80]'
                  : 'bg-[#121c2a] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Practice Mode</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'mock'}
              onClick={() => setMode('mock')}
              className={`retro-btn px-4 py-2.5 font-retro text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'mock'
                  ? 'bg-[#142a3d] border-[#38bdf8] text-[#38bdf8]'
                  : 'bg-[#121c2a] border-[#2e435e] text-[#a5b4c7] hover:text-[#eef2f6]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Mock Test Mode</span>
            </button>
          </div>
        </div>

        {/* Collapsible Formula & Concept Reference Panel */}
        <ReferencePanel
          isOpen={referenceOpen}
          onToggle={() => setReferenceOpen((prev) => !prev)}
        />

        {/* Active Mode Content */}
        {mode === 'practice' ? <PracticeMode /> : <MockTestMode />}

        {/* Collapsible GitHub Pages Deployment Instructions */}
        <GitHubPagesGuide
          isOpen={deployGuideOpen}
          onToggle={() => setDeployGuideOpen((prev) => !prev)}
        />
      </main>

      <footer className="border-t border-[#1e2d40] bg-[#0d1520] mt-8">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-retro text-[#7b8ea6]">
          <span>QuadraMath &apos;96 &middot; Grade 10 Mathematics Reviewer</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openAndScrollTo('formula-reference', setReferenceOpen)}
              className="hover:text-[#eef2f6] cursor-pointer"
            >
              Formula Sheet
            </button>
            <button
              type="button"
              onClick={() => openAndScrollTo('deploy-guide', setDeployGuideOpen)}
              className="hover:text-[#eef2f6] cursor-pointer"
            >
              GitHub Pages Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
