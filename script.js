// ==============================
// NAVIGATION MENU TOGGLE
// ==============================
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove("open");
  }
});

// ==============================
// SMOOTH SCROLLING
// ==============================
document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      nav.classList.remove("open");
    }
  });
});

// ==============================
// HEADER SCROLL EFFECT
// ==============================
const header = document.querySelector(".site-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// ==============================
// FADE-IN ANIMATION ON SCROLL
// ==============================
const faders = document.querySelectorAll(".fade-in");
const fadeOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    }
  });
}, fadeOptions);

faders.forEach((fader) => fadeObserver.observe(fader));

// ==============================
// ANIMATED COUNTER FOR STATS
// ==============================
const statNumbers = document.querySelectorAll(".stat-number");
let hasAnimated = false;

const animateCounter = (element) => {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  updateCounter();
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach((stat) => animateCounter(stat));
      }
    });
  },
  { threshold: 0.5 }
);

const statsBar = document.querySelector(".stats-bar");
if (statsBar) {
  statsObserver.observe(statsBar);
}

// ==============================
// PROGRESS BAR ANIMATION
// ==============================
const progressBars = document.querySelectorAll(".progress-fill");
let progressAnimated = false;

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !progressAnimated) {
        progressAnimated = true;
        progressBars.forEach((bar) => {
          const progress = bar.getAttribute("data-progress");
          setTimeout(() => {
            bar.style.width = progress + "%";
          }, 200);
        });
      }
    });
  },
  { threshold: 0.5 }
);

const progressSection = document.querySelector(".progress-section");
if (progressSection) {
  progressObserver.observe(progressSection);
}

// ==============================
// TESTIMONIAL CAROUSEL
// ==============================
const testimonials = document.querySelectorAll(".testimonial");
let currentTestimonial = 0;
const nextBtn = document.getElementById("nextTest");
const prevBtn = document.getElementById("prevTest");
const dotsContainer = document.getElementById("carouselDots");

// Create dots
testimonials.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.classList.add("carousel-dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => showTestimonial(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".carousel-dot");

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
  currentTestimonial = index;
}

nextBtn.addEventListener("click", () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

prevBtn.addEventListener("click", () => {
  currentTestimonial =
    (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

// Auto-rotate testimonials
let testimonialInterval = setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 6000);

// Pause auto-rotate on hover
const carousel = document.querySelector(".carousel");
carousel.addEventListener("mouseenter", () => {
  clearInterval(testimonialInterval);
});

carousel.addEventListener("mouseleave", () => {
  testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 6000);
});

// ==============================
// FAQ ACCORDION
// ==============================
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Close all FAQs
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Open clicked FAQ if it wasn't active
    if (!isActive) {
      faqItem.classList.add("active");
    }
  });
});

// ==============================
// CONTACT FORM VALIDATION & SUBMISSION
// ==============================
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const inquiryType = document.getElementById("inquiry-type");
const modal = document.getElementById("successModal");

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(input) {
  const formGroup = input.closest(".form-group");
  formGroup.classList.add("error");
}

function clearError(input) {
  const formGroup = input.closest(".form-group");
  formGroup.classList.remove("error");
}

// Real-time validation
[nameInput, emailInput, messageInput, inquiryType].forEach((input) => {
  input.addEventListener("input", () => clearError(input));
  input.addEventListener("blur", () => {
    if (input.value.trim() === "") {
      showError(input);
    }
  });
});

emailInput.addEventListener("blur", () => {
  if (emailInput.value && !validateEmail(emailInput.value)) {
    showError(emailInput);
  }
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  // Validate name
  if (nameInput.value.trim() === "") {
    showError(nameInput);
    isValid = false;
  }

  // Validate email
  if (emailInput.value.trim() === "" || !validateEmail(emailInput.value)) {
    showError(emailInput);
    isValid = false;
  }

  // Validate inquiry type
  if (inquiryType.value === "") {
    showError(inquiryType);
    isValid = false;
  }

  // Validate message
  if (messageInput.value.trim() === "") {
    showError(messageInput);
    isValid = false;
  }

  if (isValid) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
      submitBtn.disabled = false;

      // Show success modal
      modal.classList.add("show");

      // Reset form
      contactForm.reset();
    }, 1500);
  } else {
    // Scroll to first error
    const firstError = contactForm.querySelector(".form-group.error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

// Close modal function
function closeModal() {
  modal.classList.remove("show");
}

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// ==============================
// DEMO FILE DOWNLOAD
// ==============================
document.getElementById("downloadDemo").addEventListener("click", () => {
  const content = `
═══════════════════════════════════════════════════
  SalmoShield™ Product Information
  Educational Project Demo
═══════════════════════════════════════════════════

PATHOGEN OVERVIEW
──────────────────────────────────────────────────
Scientific Name: Salmonella enterica
Type: Bacteria
Impact: 1.35 million US cases annually
        26,500 hospitalizations per year
        420 deaths annually

INFECTION PATHWAY
──────────────────────────────────────────────────
1. Entry: Contaminated food/water (digestive tract)
2. Incubation: 6 hours to 6 days
3. Invasion: Bacteria destroys intestinal lining
4. Symptoms: Diarrhea, fever, cramps (4-7 days)
5. Risk: Can spread to bloodstream (bacteremia)

IMMUNE SYSTEM RESPONSE
──────────────────────────────────────────────────
First Line Defense:
• Stomach acid kills many bacteria
• Intestinal barrier prevents invasion
• Macrophages engulf bacteria
• Inflammation brings immune cells

Adaptive Response:
• B-cells produce antibodies
• T-cells coordinate defense
• Memory cells provide future protection

SALMOSHIELD™ SOLUTION
──────────────────────────────────────────────────
What It Does:
Trains immune system to recognize multiple 
Salmonella serotypes before infection occurs

How It Works:
1. Safe antigen delivery (injection)
2. B-cells create specific antibodies
3. T-cells learn to identify infected cells
4. Memory cells remain ready for rapid response

Technical Specifications:
• Formulation: Lyophilized or liquid
• Administration: Intramuscular injection
• Dosage: Single dose + 12-month booster
• Storage: 2-8°C (standard refrigeration)
• Efficacy: 92% seroconversion rate
• Shelf Life: 24 months

KEY ADVANTAGES
──────────────────────────────────────────────────
✓ Multi-serotype protection
✓ Prevents illness before symptoms
✓ No antibiotic resistance issues
✓ Long-lasting memory cell protection
✓ Minimal side effects
✓ Easy global distribution (stable at 2-8°C)

TARGET POPULATIONS
──────────────────────────────────────────────────
• Children under 5
• Adults over 65
• Immunocompromised individuals
• People with chronic conditions (IBD, sickle cell)
• International travelers
• Food service workers

LABORATORY VALIDATION
──────────────────────────────────────────────────
Aurora Biotech:
  Neutralization Titer: 1:640
  Seroconversion: 92%

HelixLabs QC:
  Sterility: Pass
  Endotoxin: <5 EU/mL

Global Standards Lab:
  Potency: 98.5%
  24-Month Stability: Confirmed

DEVELOPMENT STATUS
──────────────────────────────────────────────────
Research & Development: 100% Complete
Clinical Trials Phase II: 75% Complete
Regulatory Approval: 45% Complete

CONTACT INFORMATION
──────────────────────────────────────────────────
Email: info@salmoshield.com
Phone: +1 (555) 123-4567
Location: Boston, MA

═══════════════════════════════════════════════════
  © 2025 SalmoShield™ - Educational Project
═══════════════════════════════════════════════════

Note: This is an educational demonstration project.
All data should be verified with actual research
before any real-world application.
  `;

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "SalmoShield_Product_Information.txt";
  link.click();

  // Show download feedback
  const downloadBtn = document.getElementById("downloadDemo");
  const originalHTML = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded';
  downloadBtn.style.background = "var(--accent)";

  setTimeout(() => {
    downloadBtn.innerHTML = originalHTML;
    downloadBtn.style.background = "";
  }, 2000);
});

// ==============================
// BACK TO TOP BUTTON
// ==============================
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 500) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ==============================
// HERO PARTICLES ANIMATION
// ==============================
const particlesContainer = document.getElementById("particles");
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.style.position = "absolute";
  particle.style.width = Math.random() * 4 + 2 + "px";
  particle.style.height = particle.style.width;
  particle.style.background = "rgba(255, 255, 255, 0.5)";
  particle.style.borderRadius = "50%";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.top = Math.random() * 100 + "%";
  particle.style.animation = `float ${
    Math.random() * 10 + 5
  }s ease-in-out infinite`;
  particle.style.animationDelay = Math.random() * 5 + "s";
  particlesContainer.appendChild(particle);
}

// Add CSS animation for particles
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-30px) translateX(20px);
      opacity: 0.7;
    }
  }
`;
document.head.appendChild(style);

// ==============================
// KEYBOARD NAVIGATION
// ==============================

// ESC key to close modal and menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    nav.classList.remove("open");
  }

  // Arrow keys for testimonial navigation
  if (e.key === "ArrowLeft") {
    prevBtn.click();
  }
  if (e.key === "ArrowRight") {
    nextBtn.click();
  }
});

// ==============================
// ACCESSIBILITY ENHANCEMENTS
// ==============================

// Add focus visible styles for keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-nav");
});

// Add CSS for focus styles
const focusStyle = document.createElement("style");
focusStyle.textContent = `
  .keyboard-nav *:focus {
    outline: 3px solid var(--brand);
    outline-offset: 2px;
  }
`;
document.head.appendChild(focusStyle);

// ==============================
// PAGE LOAD ANIMATION
// ==============================
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// ==============================
// PREVENT ZOOM ON MOBILE INPUTS
// ==============================
const inputs = document.querySelectorAll("input, textarea, select");
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }
  });

  input.addEventListener("blur", () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  });
});

// ==============================
// CONSOLE WELCOME MESSAGE
// ==============================
console.log(
  "%cSalmoShield™",
  "color: #1e90ff; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cNext-Generation Salmonella Protection",
  "color: #00c896; font-size: 14px;"
);
console.log("%cEducational Project Demo", "color: #666; font-size: 12px;");

// ==============================
// INITIALIZATION COMPLETE
// ==============================
console.log("✓ Website initialized successfully");

// Export functions for external use if needed
window.SalmoShield = {
  closeModal,
  showTestimonial,
};
