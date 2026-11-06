/**
 * Somalaraju Harsha Vardhan Raju - AI Engineer Portfolio Main Controller
 * Handles Theme Switching, Navigation, ScrollSpy, Project Filtering, Modals, Contact Form, and UX Interactivity.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Theme Management (Dark Theme as Primary) ---
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to dark mode as requested for modern AI aesthetic
    return 'dark';
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIconSun && themeIconMoon) {
      if (theme === 'dark') {
        themeIconSun.style.display = 'block';
        themeIconMoon.style.display = 'none';
        themeToggle?.setAttribute('aria-label', 'Switch to light mode');
      } else {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'block';
        themeToggle?.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // --- 2. Mobile Navigation Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuBtn.classList.toggle('active', isOpen);
    });

    // Close when clicking nav link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  // --- 3. Active Navigation Highlighting (ScrollSpy) ---
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- 4. Back-to-Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 5. Project Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // --- 6. Project Details Modal ---
  const projectData = {
    'insurance-rag': {
      title: 'Intelligent Insurance Knowledge & Claims Assistant',
      category: 'Enterprise RAG & Generative AI',
      headline: 'Automating multi-modal policy comprehension, claims validation, and coverage decisioning.',
      techStack: ['Python', 'Azure OpenAI (GPT-4)', 'LangChain', 'Azure AI Search', 'FAISS', 'FastAPI'],
      architecture: 'Document chunking pipeline with semantic chunking & metadata tagging; Azure AI Search hybrid vector retrieval with cross-encoder re-ranking; GPT-4 extraction with hallucination guardrails & strict citation indices; FastAPI asynchronous backend serving microservices.',
      highlights: [
        'Built enterprise-grade RAG pipeline indexed across 500+ policy pages with sub-second hybrid retrieval.',
        'Engineered citation validation layer ensuring 100% verifiable source clauses in generated claim decisions.',
        'Reduced manual coverage verification processing overhead by 65% in test benchmarks.',
        'Containerized FastAPI microservice with automated rate limiting and Azure OpenAI token management.'
      ],
      github: 'https://github.com/SomalarajuHarshaVardhanRaju'
    },
    'healthcare-genai': {
      title: 'Healthcare Generative AI Clinical Decision Support',
      category: 'Healthcare & Biomedical LLMs',
      headline: 'Empowering medical practitioners with context-aware clinical literature retrieval and discharge intelligence.',
      techStack: ['Python', 'LangChain', 'Med-PaLM / GPT-4', 'ChromaDB', 'FastAPI', 'Streamlit'],
      architecture: 'HIPAA-conscious decoupled prompt templates; ChromaDB dense vector indexing over PubMed biomedical datasets; zero-shot and few-shot diagnostic summarization pipeline; strict clinical contradiction checks.',
      highlights: [
        'Synthesized complex clinical notes and laboratory reports into structured discharge summaries.',
        'Implemented rigorous prompt engineering guardrails preventing unsafe medical recommendations.',
        'ChromaDB vector persistence enabling real-time semantic queries against clinical case studies.',
        'Interactive physician dashboard with side-by-side evidence references and citation tooltips.'
      ],
      github: 'https://github.com/SomalarajuHarshaVardhanRaju'
    },
    'finsight': {
      title: 'FinSight – AI-Powered Financial Statement Analysis',
      category: 'Financial AI & Agentic Analysis',
      headline: 'Autonomous multi-document intelligence extracting financial ratios and analyzing 10-K SEC filings.',
      techStack: ['Python', 'LangGraph', 'Azure OpenAI', 'LlamaParse', 'Pandas', 'PySpark'],
      architecture: 'Hierarchical table-parsing pipeline with LlamaParse; LangGraph cyclic state machine orchestrating query breakdown, ledger verification, and cross-year variance computation; structured JSON schema enforcement with Pydantic.',
      highlights: [
        'Automated parsing of non-standardized multi-page balance sheets and cash flow disclosures.',
        'LangGraph state graphs managing specialized critic and analyst agents for financial verification.',
        'Generated interactive variance charts and executive risk summaries for corporate finance reviews.',
        'High-throughput data extraction using PySpark & Pandas for large historical tabular datasets.'
      ],
      github: 'https://github.com/SomalarajuHarshaVardhanRaju'
    },
    'agentic-workflows': {
      title: 'Agentic Workflow Automator',
      category: 'Agentic AI & LangGraph',
      headline: 'Autonomous multi-agent task execution combining LangGraph state orchestration with Model Context Protocol (MCP).',
      techStack: ['LangGraph', 'Python', 'CrewAI', 'MCP (Model Context Protocol)', 'FastAPI', 'OpenAI API'],
      architecture: 'State machine architecture utilizing directed acyclic graphs (DAGs) and cyclic feedback loops; dynamic tool discovery via MCP servers; human-in-the-loop validation checkpoints before critical tool execution.',
      highlights: [
        'Engineered multi-agent collaboration between Researcher, Coder, and Verifier agents with structured memory.',
        'Integrated Model Context Protocol (MCP) clients allowing dynamic external API execution and environment control.',
        'Implemented automatic self-correction loops when generated scripts encounter runtime errors.',
        'Reduced multi-step task execution times by 40% with parallel tool calling.'
      ],
      github: 'https://github.com/SomalarajuHarshaVardhanRaju'
    },
    'ml-pipeline': {
      title: 'Interactive Predictive Analytics & ML Pipeline',
      category: 'Machine Learning & MLOps',
      headline: 'End-to-end regression and classification framework with live parameter optimization and visualizer.',
      techStack: ['Python', 'Scikit-learn', 'NumPy', 'Pandas', 'SVG Vector Rendering', 'FastAPI'],
      architecture: 'Modular scikit-learn preprocessing pipeline (imputation, scaling, one-hot encoding); cross-validated model tuning; interactive browser mathematical simulation engine computing live loss metrics (MSE, R²).',
      highlights: [
        'Built resilient automated data preprocessing pipelines handling missing values and feature transformations.',
        'Engineered real-time interactive parameter fitting visualizer showing live confidence intervals.',
        'Model performance evaluation with confusion matrices, ROC-AUC, and residual analysis.',
        'Production REST API endpoints built with FastAPI for sub-20ms inference latency.'
      ],
      github: 'https://github.com/SomalarajuHarshaVardhanRaju'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalHeadline = document.getElementById('modal-headline');
  const modalTech = document.getElementById('modal-tech');
  const modalArchitecture = document.getElementById('modal-architecture');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalGithub = document.getElementById('modal-github');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modal) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalHeadline.textContent = data.headline;
    modalArchitecture.textContent = data.architecture;

    // Tech tags
    modalTech.innerHTML = '';
    data.techStack.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      modalTech.appendChild(span);
    });

    // Highlights list
    modalHighlights.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      modalHighlights.appendChild(li);
    });

    // Links
    if (modalGithub) {
      modalGithub.href = data.github;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-project-trigger]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('data-project-trigger');
      openProjectModal(id);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  modal?.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) {
        closeProjectModal();
      }
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        mobileMenuBtn?.classList.remove('active');
      }
    }
  });

  // --- 7. Interactive Contact Form with Validation & Real-World Email Integration ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim() || 'AI Engineer Inquiry';
      const message = messageInput.value.trim();

      // Clear previous status
      formStatus.innerHTML = '';
      formStatus.className = 'form-status';

      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name) {
        showStatus('Please enter your name.', 'error');
        nameInput.focus();
        return;
      }
      if (!email || !emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }
      if (!message || message.length < 10) {
        showStatus('Please enter a message with at least 10 characters.', 'error');
        messageInput.focus();
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

      // Simulate network dispatch with guaranteed client mailto fallback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        const mailtoUrl = `mailto:harshavardhanraju2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Hi Harsha,\n\nName: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;

        formStatus.innerHTML = `
          <div class="status-success-box">
            <strong>Thank you, ${escapeHtml(name)}!</strong>
            <p>Your message has been validated. You can launch your native email client with your prefilled inquiry:</p>
            <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
              <a href="${mailtoUrl}" class="btn primary btn-sm" style="text-decoration:none;">Open in Mail Client &rarr;</a>
              <button type="button" class="btn ghost btn-sm" id="btn-reset-form">Clear Form</button>
            </div>
          </div>
        `;
        formStatus.classList.add('success');

        document.getElementById('btn-reset-form')?.addEventListener('click', () => {
          contactForm.reset();
          formStatus.innerHTML = '';
          formStatus.className = 'form-status';
        });
      }, 700);
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- 8. Copy Email to Clipboard Helper ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      const email = this.getAttribute('data-email') || 'harshavardhanraju2004@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<span>&#10003; Copied Email!</span>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        prompt('Copy email:', email);
      });
    });
  }
});
