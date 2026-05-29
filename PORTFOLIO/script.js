// --- GLOBAL MOUSE POSITION TRACKING ---
document.body.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--global-x', `${e.clientX}px`);
  document.body.style.setProperty('--global-y', `${e.clientY}px`);
});

// --- CARD MOUSE TRACKING (Spotlight Glow Effect) ---
function initCardGlow() {
  const cards = document.querySelectorAll('.glow-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// --- INTERSECTION OBSERVER (Fade-in on Scroll) ---
function initScrollReveal() {
  const revealElements = [
    document.getElementById('experience-header'),
    document.getElementById('experience-content'),
    document.getElementById('projects-header'),
    document.getElementById('projects-content'),
    document.getElementById('hackathons-header'),
    document.getElementById('hackathons-content'),
    document.getElementById('skills-header'),
    document.getElementById('skills-content'),
    document.getElementById('contact-content')
  ];

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    if (el) revealObserver.observe(el);
  });
}

// --- HEADER CHANGE ON SCROLL ---
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// --- MOBILE MENU DRAWER ---
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Simple toggle menu icon
      const isActive = navMenu.classList.contains('active');
      toggleBtn.innerHTML = isActive 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
      });
    });
  }
}

// --- INTERACTIVE DEVELOPER TERMINAL INTERPRETER ---
const terminalHistory = document.getElementById('terminal-history');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

const COMMAND_RESPONSES = {
  about: `[PROFILE]
Sarth Milind Yambal
Full Stack Developer, Data Analytics & Video Editor
Walchand Institute of Technology (WIT) - IT B.Tech, Year 2

"I build responsive web applications, design smart software architectures, and produce high-fidelity digital media."`,

  experience: `[EXPERIENCE]
Role: Web Development Intern
Company: Apex Planet Software Pvt. Ltd. (Solapur, Maharashtra)
Duration: Aug 2024 - Present
Core Responsibilities:
- Developing and optimizing responsive web applications utilizing core frontend and backend web technologies.
- Collaborating closely with team members using version control systems like Git and GitHub to maintain clean and modular codebases.`,
  
  skills: `[SKILLS & TECHNOLOGIES]
- Programming Languages: Python, JavaScript, HTML, CSS
- Databases & Tools: SQL, MySQL, Git, GitHub, GitHub Codespaces
- Multimedia Production: Video Editing, Asset Design, Media Production`,

  projects: `[SELECTED PROJECTS]
1. Votera Voting System (SIH Hackathon)
   - Secure biometric fingerprint authentication for voting.
   - Tags: Full Stack, Mobile Development, Auth APIs.
2. GoldenHour AI
   - AI ambulance router optimization prototype.
   - Tags: Python, AI APIs, Codespaces.
3. Vypar AI
   - Automated billing and product invoice manager.
   - Tags: HTML, CSS, JS, Backend Database.`,

  hackathons: `[COMPETITIONS & EVENTS]
- HackXplore India 2026: Collaborator on software automation tasks.
- OpenEnv Hackathon: Developed environmental tracker using PyTorch.`,

  contact: `[LET'S CONNECT]
- Email   : sarthyambal1952000@gmail.com
- LinkedIn: linkedin.com/in/sarth-yambal
- GitHub  : github.com/sarthyambal`,

  help: `Available commands:
  - <span class="terminal-cyan">about</span>      : Learn about Sarth
  - <span class="terminal-cyan">experience</span> : View professional internship details
  - <span class="terminal-cyan">skills</span>     : View technology stack
  - <span class="terminal-cyan">projects</span>   : Inspect selected developer projects
  - <span class="terminal-cyan">hackathons</span> : Read about hackathon involvement
  - <span class="terminal-cyan">contact</span>    : Get connection details
  - <span class="terminal-cyan">clear</span>      : Reset console log screen`
};

// Process output terminal messages
function appendToTerminal(command, outputText, isError = false) {
  if (!terminalHistory) return;

  // Append User Command line
  const commandLine = document.createElement('div');
  commandLine.className = 'terminal-line';
  commandLine.innerHTML = `<span class="terminal-prompt" style="color: var(--accent); font-weight: 500;">~/sarth-dev <span style="color: var(--accent-cyan);">&gt;</span></span> <span style="color: var(--text-primary); font-family: var(--font-mono);">${escapeHTML(command)}</span>`;
  terminalHistory.appendChild(commandLine);

  // Append output block
  if (outputText) {
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line terminal-output';
    if (isError) {
      outputLine.style.color = '#ef4444';
    }
    outputLine.innerHTML = outputText.replace(/\n/g, '<br>');
    terminalHistory.appendChild(outputLine);
  }

  // Scroll to bottom of terminal body
  if (terminalBody) {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

// Utility to escape HTML elements
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Global invocation helper for clicking badges
function runTerminalCommand(cmd) {
  if (!cmd) return;
  const cleanCmd = cmd.trim().toLowerCase();
  
  if (cleanCmd === 'clear') {
    if (terminalHistory) terminalHistory.innerHTML = '';
    if (terminalInput) terminalInput.value = '';
    return;
  }

  const response = COMMAND_RESPONSES[cleanCmd];
  if (response !== undefined) {
    appendToTerminal(cleanCmd, response);
  } else {
    appendToTerminal(cleanCmd, `bash: command not found: ${escapeHTML(cleanCmd)}. Type <span class="terminal-highlight">help</span> for a list of available queries.`, true);
  }
  
  if (terminalInput) {
    terminalInput.value = '';
    terminalInput.focus();
  }
}

// Bind terminal keystrokes
function initTerminal() {
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = terminalInput.value;
        if (command.trim()) {
          runTerminalCommand(command);
        }
      }
    });

    // Focus input on terminal container click
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
      terminalWindow.addEventListener('click', () => {
        terminalInput.focus();
      });
    }
  }
}

// Expose runTerminalCommand to window scope for onclick inline actions
window.runTerminalCommand = runTerminalCommand;

// --- INITIALIZE ALL COMPONENTS ---
document.addEventListener('DOMContentLoaded', () => {
  initCardGlow();
  initScrollReveal();
  initHeaderScroll();
  initMobileMenu();
  initTerminal();
});
