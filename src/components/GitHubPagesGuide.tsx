import React from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface GitHubPagesGuideProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const GitHubPagesGuide: React.FC<GitHubPagesGuideProps> = ({ isOpen, onToggle }) => {
  return (
    <section
      id="deploy-guide"
      className="retro-window mt-6"
      aria-label="GitHub Pages Deployment Instructions"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-[#19283c] border-b-2 border-[#2e435e]">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2.5 text-left font-retro text-sm font-semibold text-[#eef2f6] hover:text-[#4ade80] transition-colors cursor-pointer"
          aria-expanded={isOpen}
        >
          <Terminal className="w-4 h-4 text-[#38bdf8] shrink-0" />
          <span>GitHub Pages Deployment Instructions</span>
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="retro-btn px-3 py-1 bg-[#121c2a] text-xs font-retro text-[#a5b4c7] hover:text-[#eef2f6] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{isOpen ? 'Hide Guide' : 'Show Guide'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 text-sm text-[#cbd5e1] leading-relaxed">
          <p>
            This project is configured with a relative asset base path (
            <code className="font-retro text-[#fbbf24]">base: './'</code> in{' '}
            <code className="font-retro text-[#fbbf24]">vite.config.ts</code>) and runs 100%
            client-side with no backend or API keys, making it ready for static hosting on GitHub
            Pages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="retro-inset p-4 space-y-2">
              <h3 className="font-retro text-sm font-semibold text-[#4ade80]">
                Option 1: Deploy via GitHub Actions (Recommended)
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-[#cbd5e1]">
                <li>Push the repository to GitHub on branch <code className="font-retro text-[#eef2f6]">main</code>.</li>
                <li>
                  Create <code className="font-retro text-[#fbbf24]">.github/workflows/deploy.yml</code> that runs{' '}
                  <code className="font-retro text-[#eef2f6]">npm ci &amp;&amp; npm run build</code> and uploads{' '}
                  <code className="font-retro text-[#eef2f6]">./dist</code> using{' '}
                  <code className="font-retro text-[#eef2f6]">actions/deploy-pages@v4</code>.
                </li>
                <li>
                  In your GitHub repository, open <strong>Settings &rarr; Pages</strong> and set{' '}
                  <strong>Source</strong> to <strong>GitHub Actions</strong>.
                </li>
              </ol>
            </div>

            <div className="retro-inset p-4 space-y-2">
              <h3 className="font-retro text-sm font-semibold text-[#38bdf8]">
                Option 2: Manual Static Build Upload
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-[#cbd5e1]">
                <li>
                  Run <code className="font-retro text-[#eef2f6]">npm install</code> and{' '}
                  <code className="font-retro text-[#eef2f6]">npm run build</code> locally.
                </li>
                <li>
                  Publish the contents of the generated{' '}
                  <code className="font-retro text-[#fbbf24]">dist/</code> folder to a{' '}
                  <code className="font-retro text-[#eef2f6]">gh-pages</code> branch (for example using{' '}
                  <code className="font-retro text-[#eef2f6]">npx gh-pages -d dist</code>).
                </li>
                <li>
                  In <strong>Settings &rarr; Pages</strong>, select branch{' '}
                  <code className="font-retro text-[#eef2f6]">gh-pages</code> and folder{' '}
                  <code className="font-retro text-[#eef2f6]">/ (root)</code>.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
