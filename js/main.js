/**
 * Home Glow Interiors & Builders - main.js
 * Vanilla JavaScript for premium animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initScrollReveal();
  
  const grid = document.getElementById('portfolio-items-grid');
  
  if (grid) {
    loadDynamicProjects().then(() => {
      initPortfolioFilter();
    });
  } else {
    initPortfolioFilter();
  }

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
      const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('.html');
      let visibleCount = 0;

      portfolioItems.forEach(item => {
        // We add a fade transition effect
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9) translateY(15px)';
        
        let matchesFilter = false;
        if (filterValue === 'all') {
          matchesFilter = item.classList.contains('type-video');
        } else {
          matchesFilter = item.classList.contains(filterValue);
        }
        let shouldShow = false;
        
        if (matchesFilter) {
          if (!isHomePage || visibleCount < 9) {
            shouldShow = true;
            visibleCount++;
          }
        }
        
        setTimeout(() => {
          if (shouldShow) {
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

      // Update visibility of corresponding Load More buttons
      const loadMoreButtons = document.querySelectorAll('.load-more-btn');
      loadMoreButtons.forEach(btn => {
        if (btn.getAttribute('data-load-more') === filterValue) {
          btn.classList.remove('d-none');
        } else {
          btn.classList.add('d-none');
        }
      });
    });
  });

  // Trigger the active filter to hide non-videos on load if 'all' is active
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    activeBtn.click();
  }
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

/**
 * 8. Load Projects Dynamically from Sanity
 */
async function loadDynamicProjects() {
  const grid = document.getElementById('portfolio-items-grid');
  if (!grid) return;

  try {
    // Sanity API Configuration
    const projectId = 'ndfok895';
    const dataset = 'production';
    const projectsQuery = encodeURIComponent('*[_type == "project"]{title, category, categoryLabel, mediaType, "mediaSrc": media.asset->url}');
    const projectsUrl = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${projectsQuery}`;

    const transformsQuery = encodeURIComponent('*[_type == "transformation"]{title, "afterSrc": afterImage.asset->url}');
    const transformsUrl = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${transformsQuery}`;

    const [projectsRes, transformsRes] = await Promise.all([
      fetch(projectsUrl),
      fetch(transformsUrl)
    ]);
    
    if (!projectsRes.ok || !transformsRes.ok) throw new Error('Failed to load data from Sanity');
    
    const projectsData = await projectsRes.json();
    const transformsData = await transformsRes.json();
    
    const fetchedProjects = (projectsData.result || [])
      .filter(p => p.category !== 'renovations')
      .map(p => {
      if (p.category === 'wardrobes') {
        p.category = 'furniture';
      }
      if (['living-rooms', 'bedrooms', 'bathrooms', 'bathroom'].includes(p.category)) {
        p.category = 'interiors';
        p.categoryLabel = 'Interiors';
      }
      return p;
    });
    const transformations = transformsData.result || [];
    
    // Map transformations to the projects format
    const transformedProjects = transformations.map(t => ({
      title: t.title ? `${t.title} (Transformation)` : 'Transformation',
      category: 'renovations',
      categoryLabel: 'Renovations',
      mediaType: 'image',
      mediaSrc: t.afterSrc
    }));
    
    const exteriorAdditions = [
      {
        title: "Modern Exterior Facade",
        category: "exterior",
        categoryLabel: "Exterior",
        mediaType: "image",
        mediaSrc: "images/project_exterior_1.jpeg"
      },
      {
        title: "Premium Elevation Design",
        category: "exterior",
        categoryLabel: "Exterior",
        mediaType: "image",
        mediaSrc: "images/project_exterior_2.jpeg"
      },
      {
        title: "Luxury Home Exterior",
        category: "exterior",
        categoryLabel: "Exterior",
        mediaType: "image",
        mediaSrc: "images/project_exterior_3.jpeg"
      },
      {
        title: "Contemporary Facade",
        category: "exterior",
        categoryLabel: "Exterior",
        mediaType: "image",
        mediaSrc: "images/project_exterior_4.jpeg"
      },
      {
        title: "Elegant Villa Design",
        category: "exterior",
        categoryLabel: "Exterior",
        mediaType: "image",
        mediaSrc: "images/project_exterior_5.jpeg"
      },
      {
        title: "Premium Exterior Design",
        category: "exterior",
        categoryLabel: "Exterior",
        mediaType: "image",
        mediaSrc: "images/10.jpeg"
      }
    ];

    const landscapeAdditions = [
      {
        title: "Lush Green Pathway",
        category: "landscape",
        categoryLabel: "Landscape",
        mediaType: "image",
        mediaSrc: "images/project_landscape_7.jpeg"
      },
      {
        title: "Modern Outdoor Garden",
        category: "landscape",
        categoryLabel: "Landscape",
        mediaType: "image",
        mediaSrc: "images/project_landscape_8.jpeg"
      }
    ];

    const interiorAdditions = [
      {
        title: "Elegant Interior Styling",
        category: "interiors",
        categoryLabel: "Interiors",
        mediaType: "image",
        mediaSrc: "images/11.jpeg"
      },
      {
        title: "Premium Living Space",
        category: "interiors",
        categoryLabel: "Interiors",
        mediaType: "image",
        mediaSrc: "images/12.jpeg"
      },
      {
        title: "Modern Bathroom Interior",
        category: "interiors",
        categoryLabel: "Interiors",
        mediaType: "image",
        mediaSrc: "images/35.jpeg"
      },
      {
        title: "Luxury Bathroom Setting",
        category: "interiors",
        categoryLabel: "Interiors",
        mediaType: "image",
        mediaSrc: "images/36.jpeg"
      }
    ];

    const ceilingAdditions = [
      {
        title: "Modern Ceiling Light",
        category: "ceiling",
        categoryLabel: "Ceiling & Lights",
        mediaType: "image",
        mediaSrc: "images/13.jpeg"
      },
      {
        title: "Elegant Cove Lighting",
        category: "ceiling",
        categoryLabel: "Ceiling & Lights",
        mediaType: "image",
        mediaSrc: "images/14.jpeg"
      },
      {
        title: "Premium False Ceiling",
        category: "ceiling",
        categoryLabel: "Ceiling & Lights",
        mediaType: "image",
        mediaSrc: "images/15.jpeg"
      },
      {
        title: "Luxury Gypsum Design",
        category: "ceiling",
        categoryLabel: "Ceiling & Lights",
        mediaType: "image",
        mediaSrc: "images/16.jpeg"
      },
      {
        title: "Contemporary Ceiling Setup",
        category: "ceiling",
        categoryLabel: "Ceiling & Lights",
        mediaType: "image",
        mediaSrc: "images/17.jpeg"
      }
    ];

    const businessAdditions = [
      { title: "Premium Commercial Setup", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/19.jpeg" },
      { title: "Modern Business Space", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/20.jpeg" },
      { title: "Corporate Interior Design", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/21.jpeg" },
      { title: "Elegant Office Environment", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/23.jpeg" },
      { title: "Luxury Retail Space", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/24.jpeg" },
      { title: "Creative Workspace", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/25.jpeg" },
      { title: "Executive Business Lounge", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/26.jpeg" },
      { title: "Modern Showroom", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/27.jpeg" },
      { title: "Professional Corporate Layout", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/28.jpeg" },
      { title: "Contemporary Business Hub", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/29.jpeg" },
      { title: "Premium Office Interior", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/30.jpeg" },
      { title: "Commercial Space Design", category: "businesses", categoryLabel: "Businesses", mediaType: "image", mediaSrc: "images/31.jpeg" }
    ];
    
    const projects = [...fetchedProjects, ...transformedProjects, ...exteriorAdditions, ...landscapeAdditions, ...interiorAdditions, ...ceilingAdditions, ...businessAdditions];
    
    grid.innerHTML = ''; // Clear loading state
    
    if (projects.length === 0) {
      grid.innerHTML = '<p class="text-center text-white w-100">No projects found. Add some in your Sanity Studio!</p>';
      return;
    }
    
    projects.forEach((proj, index) => {
      const colDiv = document.createElement('div');
      colDiv.className = `col-sm-6 col-lg-4 portfolio-item ${proj.category || 'all'} type-${proj.mediaType || 'image'}`;
      
      const cardDiv = document.createElement('div');
      cardDiv.className = 'project-card';
      cardDiv.id = `project-${index + 1}`;
      
      let mediaHtml = '';
      if (proj.mediaType === 'video') {
        mediaHtml = `
          <video autoplay muted loop playsinline class="project-img">
            <source src="${proj.mediaSrc}" type="video/mp4">
          </video>
        `;
      } else {
        mediaHtml = `<img src="${proj.mediaSrc}" alt="${proj.title}" class="project-img img-fluid">`;
      }
      
      cardDiv.innerHTML = `
        ${mediaHtml}
        <div class="project-overlay">
          <span class="project-category">${proj.categoryLabel || proj.category || ''}</span>
          <h4 class="project-title">${proj.title || 'Untitled'}</h4>
        </div>
      `;
      
      colDiv.appendChild(cardDiv);
      grid.appendChild(colDiv);
    });
    
  } catch (error) {
    console.error('Error loading projects:', error);
    grid.innerHTML = '<p class="text-center text-white w-100">Failed to load projects. Please try again later.</p>';
  }
}

/**
 * 9. Load Transformations Dynamically from Sanity
 */
async function loadDynamicTransformations() {
  const grid = document.getElementById('transformations-grid');
  if (!grid) return;

  try {
    const projectId = 'ndfok895';
    const dataset = 'production';
    const query = encodeURIComponent('*[_type == "transformation"]{title, description, "beforeSrc": beforeImage.asset->url, "afterSrc": afterImage.asset->url}');
    const sanityUrl = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;

    let fetchedTransformations = [];
    try {
      const response = await fetch(sanityUrl);
      if (response.ok) {
        const data = await response.json();
        fetchedTransformations = data.result || [];
      }
    } catch (e) {
      console.warn('Could not fetch from Sanity', e);
    }
    
    const hardcodedTransformations = [
      {
        title: "Elegent wardobe setting",
        description: "Transforming a traditional space into a vibrant, modern living area with elegant lighting and premium finishes.",
        beforeSrc: "images/3.jpeg",
        afterSrc: "images/4.jpeg"
      },
      {
        title: "Modern Sanitary setting",
        description: "A complete overhaul of the bedroom into a cozy, contemporary haven featuring custom wardrobes and soothing color palettes.",
        beforeSrc: "images/5.jpeg",
        afterSrc: "images/6.jpeg"
      },
      {
        title: "living room make over",
        description: "Reimagining the dining area with optimized layouts, sophisticated furniture, and a warm, inviting atmosphere.",
        beforeSrc: "images/7.jpeg",
        afterSrc: "images/8.jpeg"
      },
      {
        title: "TV unit partitioning",
        description: "Enhancing the exterior appeal with contemporary styling, premium materials, and architectural finesse.",
        beforeSrc: "images/9.jpeg",
        afterSrc: "images/10.jpeg"
      },
      {
        title: "modular kitchen upgrade",
        description: "Elevating the interior spaces with sophisticated design principles, premium fixtures, and a cohesive modern aesthetic.",
        beforeSrc: "images/11.jpeg",
        afterSrc: "images/12.jpeg"
      }
    ];

    const transformations = [...fetchedTransformations, ...hardcodedTransformations];
    
    grid.innerHTML = '';
    
    if (transformations.length === 0) {
      grid.innerHTML = '<p class="text-center w-100" style="color: var(--dark);">No transformations found. Add some in your Sanity Studio!</p>';
      return;
    }
    
    transformations.forEach((item, index) => {
      const colDiv = document.createElement('div');
      colDiv.className = 'col-lg-4 col-md-6 transformation-item';
      if (index >= 3) {
        colDiv.style.display = 'none';
      }
      
      const cardHtml = `
        <div class="transformation-card">
          <div class="transformation-images">
            <div class="before-img-wrapper">
              <img src="${item.beforeSrc}" alt="${item.title} Before" class="img-fluid">
              <span class="badge-before">Before</span>
            </div>
            <div class="after-img-wrapper">
              <img src="${item.afterSrc}" alt="${item.title} After" class="img-fluid">
              <span class="badge-after">After</span>
            </div>
          </div>
          <div class="transformation-details">
            <h4>${item.title || 'Untitled'}</h4>
            <p>${item.description || ''}</p>
          </div>
        </div>
      `;
      
      colDiv.innerHTML = cardHtml;
      grid.appendChild(colDiv);
    });
    
    // Handle Load More & Load Less buttons
    const loadMoreBtn = document.getElementById('load-more-transformations');
    const loadLessBtn = document.getElementById('load-less-transformations');
    
    if (loadMoreBtn && loadLessBtn && transformations.length > 3) {
      loadMoreBtn.style.display = 'inline-block';
      loadLessBtn.style.display = 'none';
      
      loadMoreBtn.addEventListener('click', () => {
        const items = grid.querySelectorAll('.transformation-item');
        items.forEach(item => item.style.display = 'block');
        loadMoreBtn.style.display = 'none';
        loadLessBtn.style.display = 'inline-block';
      });
      
      loadLessBtn.addEventListener('click', () => {
        const items = grid.querySelectorAll('.transformation-item');
        items.forEach((item, index) => {
          if (index >= 3) item.style.display = 'none';
        });
        loadLessBtn.style.display = 'none';
        loadMoreBtn.style.display = 'inline-block';
        
        // Scroll back up to the top of the section
        document.getElementById('transformations').scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      if (loadLessBtn) loadLessBtn.style.display = 'none';
    }
    
  } catch (error) {
    console.error('Error loading transformations:', error);
    grid.innerHTML = '<p class="text-center w-100" style="color: var(--dark);">Failed to load transformations. Please try again later.</p>';
  }
}

/**
 * 10. Load Testimonials Dynamically from Sanity
 */
async function loadDynamicTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  const dotsContainer = document.getElementById('testimonial-carousel-dots');
  if (!grid) return;

  try {
    const projectId = 'ndfok895';
    const dataset = 'production';
    const query = encodeURIComponent('*[_type == "testimonial"]{clientName, projectDetails, quote, rating}');
    const sanityUrl = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;

    const response = await fetch(sanityUrl);
    let fetchedTestimonials = [];
    if (response.ok) {
      const data = await response.json();
      fetchedTestimonials = data.result || [];
    } else {
      console.warn('Failed to load testimonials from Sanity, falling back to static only.');
    }
    
    const hardcodedTestimonials = [
      { clientName: "Akhil S Kumar", projectDetails: "Electrical Drawing & Modular Kitchen, Adoor", quote: "Home Glow designed our modular kitchen and executed the electrical drawing with absolute precision. The switch placements and lighting layouts are highly practical, and the kitchen finish is outstanding.", rating: 5 },
      { clientName: "RUGMA N S", projectDetails: "Modular Kitchen, Trivandrum", quote: "Extremely satisfied with the bedroom interiors and wardrobe setup. The design is space-saving, and the materials are of premium quality. Highly recommended!", rating: 5 },
      { clientName: "Amrutha S", projectDetails: "Kitchen & Living Renovation, Pathanamthitta", quote: "Our old kitchen and living area was renovated into a stunning modern space. Home Glow managed the entire remodeling hassle-free, delivering top-quality finishes on time.", rating: 5 },
      { clientName: "Harikandan S", projectDetails: "Landscaping, Kochi", quote: "They transformed our front courtyard and outdoor sit-out with spectacular landscaping. The stone pathways and garden lighting setup look completely serene.", rating: 5 },
      { clientName: "Sujatha Kumari", projectDetails: "2D & 3D Drawing, Kollam", quote: "The 2D plans and realistic 3D visualizations helped us preview every corner of our home before the build started. Excellent design foresight and detail.", rating: 5 },
      { clientName: "Anandha Krishnan", projectDetails: "Full Work House, Kottayam", quote: "Home Glow handled the complete house design and build from concept to handover. Their professionalism, premium materials, and craftsmanship are top-class.", rating: 5 },
      { clientName: "Jayaraj", projectDetails: "Aluminium & Steel Fabrication, Adoor", quote: "The custom gate, boundary railings, and steel balcony pergola they fabricated are incredibly sturdy, sleek, and match the modern elevation beautifully.", rating: 5 },
      { clientName: "Ajeesh Thomas", projectDetails: "Bathroom, Bedroom & Renovation, Pathanamthitta", quote: "Renovated our bedrooms, custom bathrooms, balcony sit-out, and added a modern TV unit next to the staircase. The quality of execution is outstanding.", rating: 5 }
    ];
    
    const testimonials = [...hardcodedTestimonials, ...fetchedTestimonials];
    
    grid.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';
    
    if (testimonials.length === 0) {
      grid.innerHTML = '<p class="text-center w-100" style="color: var(--dark);">No testimonials found. Add some in your Sanity Studio!</p>';
      return;
    }
    
    testimonials.forEach((item, index) => {
      const colDiv = document.createElement('div');
      colDiv.className = `carousel-item ${index === 0 ? 'active' : ''} testimonial-item`;
      
      const nameParts = (item.clientName || 'Client').split(' ');
      const initials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
        : nameParts[0][0].toUpperCase();

      let starsHtml = '';
      const rating = item.rating || 5;
      for (let i = 0; i < rating; i++) {
        starsHtml += '<i class="bi bi-star-fill"></i> ';
      }
      
      const cardHtml = `
        <div class="testimonial-card mx-auto" style="max-width: 800px;">
          <div class="testimonial-quote-icon">
            <i class="bi bi-quote"></i>
          </div>
          <p class="testimonial-text">"${item.quote || ''}"</p>
          <div class="testimonial-rating">
            ${starsHtml}
          </div>
          <div class="d-flex flex-column align-items-center mt-auto pt-3">
            <div class="testimonial-author-img d-flex align-items-center justify-content-center bg-secondary-color text-dark fw-bold">
              ${initials}
            </div>
            <span class="testimonial-author-name">${item.clientName || ''}</span>
            <span class="testimonial-author-role">${item.projectDetails || ''}</span>
          </div>
        </div>
      `;
      
      colDiv.innerHTML = cardHtml;
      grid.appendChild(colDiv);

      if (dotsContainer) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('data-bs-target', '#testimonialCarousel');
        dot.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) dot.className = 'active';
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dotsContainer.appendChild(dot);
      }
    });
    
    // Handle View More button (it's now a link to testimonials.html)
    const loadMoreBtn = document.getElementById('btn-loadmore-testimonials');
    if (loadMoreBtn && testimonials.length > 3) {
      loadMoreBtn.style.display = 'inline-block';
    } else if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
    
  } catch (error) {
    console.error('Error loading testimonials:', error);
    grid.innerHTML = '<p class="text-center w-100" style="color: var(--dark);">Failed to load testimonials. Please try again later.</p>';
  }
}

async function loadAllTestimonialsPage() {
  const grid = document.getElementById('testimonials-grid-all');
  if (!grid) return;

  try {
    const projectId = 'ndfok895';
    const dataset = 'production';
    const query = encodeURIComponent('*[_type == "testimonial"]{clientName, projectDetails, quote, rating}');
    const sanityUrl = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;

    const response = await fetch(sanityUrl);
    let fetchedTestimonials = [];
    if (response.ok) {
      const data = await response.json();
      fetchedTestimonials = data.result || [];
    }
    
    const hardcodedTestimonials = [
      { clientName: "Akhil S Kumar", projectDetails: "Electrical Drawing & Modular Kitchen, Adoor", quote: "Home Glow designed our modular kitchen and executed the electrical drawing with absolute precision. The switch placements and lighting layouts are highly practical, and the kitchen finish is outstanding.", rating: 5 },
      { clientName: "RUGMA N S", projectDetails: "Modular Kitchen, Trivandrum", quote: "Extremely satisfied with the bedroom interiors and wardrobe setup. The design is space-saving, and the materials are of premium quality. Highly recommended!", rating: 5 },
      { clientName: "Amrutha S", projectDetails: "Kitchen & Living Renovation, Pathanamthitta", quote: "Our old kitchen and living area was renovated into a stunning modern space. Home Glow managed the entire remodeling hassle-free, delivering top-quality finishes on time.", rating: 5 },
      { clientName: "Harikandan S", projectDetails: "Landscaping, Kochi", quote: "They transformed our front courtyard and outdoor sit-out with spectacular landscaping. The stone pathways and garden lighting setup look completely serene.", rating: 5 },
      { clientName: "Sujatha Kumari", projectDetails: "2D & 3D Drawing, Kollam", quote: "The 2D plans and realistic 3D visualizations helped us preview every corner of our home before the build started. Excellent design foresight and detail.", rating: 5 },
      { clientName: "Anandha Krishnan", projectDetails: "Full Work House, Kottayam", quote: "Home Glow handled the complete house design and build from concept to handover. Their professionalism, premium materials, and craftsmanship are top-class.", rating: 5 },
      { clientName: "Jayaraj", projectDetails: "Aluminium & Steel Fabrication, Adoor", quote: "The custom gate, boundary railings, and steel balcony pergola they fabricated are incredibly sturdy, sleek, and match the modern elevation beautifully.", rating: 5 },
      { clientName: "Ajeesh Thomas", projectDetails: "Bathroom, Bedroom & Renovation, Pathanamthitta", quote: "Renovated our bedrooms, custom bathrooms, balcony sit-out, and added a modern TV unit next to the staircase. The quality of execution is outstanding.", rating: 5 }
    ];
    
    const testimonials = [...hardcodedTestimonials, ...fetchedTestimonials];
    grid.innerHTML = '';
    
    if (testimonials.length === 0) {
      grid.innerHTML = '<p class="text-center w-100" style="color: var(--dark);">No testimonials found.</p>';
      return;
    }
    
    testimonials.forEach((item) => {
      const colDiv = document.createElement('div');
      colDiv.className = 'col-lg-4 col-md-6 testimonial-item';
      
      const nameParts = (item.clientName || 'Client').split(' ');
      const initials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
        : nameParts[0][0].toUpperCase();

      let starsHtml = '';
      const rating = item.rating || 5;
      for (let i = 0; i < rating; i++) {
        starsHtml += '<i class="bi bi-star-fill"></i> ';
      }
      
      const cardHtml = `
        <div class="testimonial-card" style="height: 100%; display: flex; flex-direction: column;">
          <div class="testimonial-quote-icon">
            <i class="bi bi-quote"></i>
          </div>
          <p class="testimonial-text">"${item.quote || ''}"</p>
          <div class="testimonial-rating">
            ${starsHtml}
          </div>
          <div class="d-flex flex-column align-items-center mt-auto pt-3">
            <div class="testimonial-author-img d-flex align-items-center justify-content-center bg-secondary-color text-dark fw-bold">
              ${initials}
            </div>
            <span class="testimonial-author-name">${item.clientName || ''}</span>
            <span class="testimonial-author-role">${item.projectDetails || ''}</span>
          </div>
        </div>
      `;
      
      colDiv.innerHTML = cardHtml;
      grid.appendChild(colDiv);
    });
  } catch (error) {
    console.error('Error loading testimonials page:', error);
    grid.innerHTML = '<p class="text-center w-100" style="color: var(--dark);">Failed to load testimonials.</p>';
  }
}

// Ensure the new function is called on load
document.addEventListener('DOMContentLoaded', () => {
  loadDynamicTransformations();
  loadDynamicTestimonials();
  loadAllTestimonialsPage();
});
