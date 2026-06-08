/**
 * Home Glow Interiors & Builders - main.js
 * Vanilla JavaScript for premium animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initScrollReveal();
  initPortfolioFilter();
  initSmoothScrollWithOffset();
  initContactForm();
  initActiveNavLinkOnScroll();
  initTermsSidebar();
  initTestimonialCarouselSync();
});

/**
 * Helper to handle side-tabs active state in terms.html
 */
function initTermsSidebar() {
  const listItems = document.querySelectorAll('.list-group-item-action');
  if (listItems.length === 0) return;

  listItems.forEach(item => {
    item.addEventListener('click', () => {
      listItems.forEach(i => {
        i.classList.remove('active');
        i.removeAttribute('style');
      });
      item.classList.add('active');
      item.style.backgroundColor = 'var(--primary)';
      item.style.color = 'var(--white)';
    });
  });
}

/**
 * 1. Sticky Navbar Transition
 */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run on load and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * 2. Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly offset bottom trigger
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

/**
 * 3. Portfolio Filter
 */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (filterButtons.length === 0 || portfolioItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Update active button class
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // 2. Filter items
      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        // We add a fade transition effect
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9) translateY(15px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.classList.remove('hidden');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            item.classList.add('hidden');
          }
        }, 300);
      });
    });
  });
}

/**
 * 4. Smooth Scrolling with Offset for Sticky Navbar
 */
function initSmoothScrollWithOffset() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const navbar = document.querySelector('.navbar-custom');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile navbar menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler-custom');
        if (toggler) toggler.click();
      }
    });
  });
}

/**
 * 5. Contact Form Handler & Submission Modal
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Custom Validation
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      // Basic check
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }

      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
          isValid = false;
          input.classList.add('is-invalid');
        }
      }

      // Phone validation (simple pattern check for digits and symbols)
      if (input.type === 'tel' && input.value.trim()) {
        const phonePattern = /^[0-9+\s-]{10,15}$/;
        if (!phonePattern.test(input.value.trim().replace(/\s/g, ''))) {
          isValid = false;
          input.classList.add('is-invalid');
        }
      }
    });

    if (isValid) {
      // Get values for pre-filled feedback/email if needed
      const name = document.getElementById('formName').value;
      
      // Simulate form submission (e.g., API call)
      // Display success modal
      const successModalElement = document.getElementById('successModal');
      if (successModalElement) {
        // Set dynamic name in the modal
        const modalNameSpan = document.getElementById('modalClientName');
        if (modalNameSpan) {
          modalNameSpan.textContent = name;
        }

        const successModal = new bootstrap.Modal(successModalElement);
        successModal.show();
      }

      // Reset Form
      form.reset();
      inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));
    }
  });

  // Real-time class toggle on input
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('is-invalid');
      }
    });
  });
}

/**
 * 6. Dynamic Active Navigation Link State on Scroll
 */
function initActiveNavLinkOnScroll() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const path = window.location.pathname;
  const page = path.split("/").pop();
  
  // Clean page name (defaults to index.html if empty, and convert to lowercase for case insensitivity)
  const currentPage = (page || 'index.html').toLowerCase();
  
  if (currentPage !== 'index.html') {
    // We are on a subpage: highlight the active page and exit
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.toLowerCase().includes(currentPage)) {
        link.classList.add('active');
      }
    });
    return;
  }

  // We are on index.html: run scroll spy
  const sections = document.querySelectorAll('section');
  const navbar = document.querySelector('.navbar-custom');
  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbarHeight - 20;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (!href) return;
      // On homepage, active nav links should map to sections if they have a hash, or match 'index.html'
      if (href.toLowerCase() === 'index.html' && (currentSectionId === 'home' || currentSectionId === '')) {
        link.classList.add('active');
      } else if (currentSectionId && href.toLowerCase().includes(`#${currentSectionId.toLowerCase()}`)) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 7. Sync custom carousel indicators with slide transitions
 */
function initTestimonialCarouselSync() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  carousel.addEventListener('slide.bs.carousel', event => {
    const activeIndex = event.to;
    const dots = document.querySelectorAll('#testimonial-carousel-dots button');
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });
}

