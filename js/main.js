/**
 * Tushar Kewat - Personal Portfolio Website
 * Interactive Scripts: Particle Canvas, Typing Text, Navbar, Skills Filter, Contact Form & Certificate Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initNavbar();
  initSkillsFilter();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
  initCertificateModal();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle Canvas (Constellation / Space Network)
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;

      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 132, 252, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Dynamic Typing Text Effect
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'Computer Science Student',
    'Software Developer',
    'Data Analyst',
    'LeetCode Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingDelay = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 400; // Pause before typing new word
    }

    setTimeout(type, typingDelay);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Navbar Scroll State & Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky & shadow navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // Active section highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Skills Filter Navigation
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const categoryGroups = document.querySelectorAll('.skill-category-group');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      categoryGroups.forEach((group) => {
        const groupCategory = group.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === groupCategory) {
          group.style.display = 'block';
          // Trigger smooth fade
          group.style.opacity = '0';
          setTimeout(() => {
            group.style.opacity = '1';
          }, 40);
        } else {
          group.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Progress Bar Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const progressBars = document.querySelectorAll('.skill-progress-bar');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.style.getPropertyValue('--progress-width') || '85%';
            bar.style.width = targetWidth;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    progressBars.forEach((bar) => observer.observe(bar));
  } else {
    // Fallback if observer not supported
    progressBars.forEach((bar) => {
      const targetWidth = bar.style.getPropertyValue('--progress-width') || '85%';
      bar.style.width = targetWidth;
    });
  }
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation & Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('userMessage');

    // Name Validation
    if (!nameInput.value.trim()) {
      nameInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      nameInput.parentElement.classList.remove('has-error');
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      emailInput.parentElement.classList.remove('has-error');
    }

    // Message Validation
    if (messageInput.value.trim().length < 10) {
      messageInput.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      messageInput.parentElement.classList.remove('has-error');
    }

    if (!isValid) return;

    // Simulate sending state
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.style.display = 'inline-flex';
      btnSpinner.style.display = 'none';
      submitBtn.disabled = false;

      // Show Toast Notification
      showToast(
        'Message Sent Successfully!',
        `Thank you ${nameInput.value.trim()}! Tushar has received your message and will respond shortly.`
      );

      // Reset form
      contactForm.reset();
    }, 1200);
  });

  // Remove error state on input typing
  ['userName', 'userEmail', 'userMessage'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.parentElement.classList.remove('has-error');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(title, message) {
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const toastClose = document.getElementById('toastClose');

  if (!toast) return;

  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.add('show');

  const hideToast = () => {
    toast.classList.remove('show');
  };

  if (toastClose) {
    toastClose.onclick = hideToast;
  }

  setTimeout(hideToast, 6000);
}

/* --------------------------------------------------------------------------
   7. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. Certificate Modal Lightbox
   -------------------------------------------------------------------------- */
function initCertificateModal() {
  const modal = document.getElementById('certificateModal');
  const openThumb = document.getElementById('openCertModalThumb');
  const openBtn = document.getElementById('openCertModalBtn');
  const closeBtn = document.getElementById('closeCertModalBtn');
  const backdrop = document.getElementById('certModalBackdrop');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (openThumb) openThumb.addEventListener('click', openModal);
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}
