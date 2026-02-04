// --- Scroll and Entrance Animations ---
document.addEventListener("DOMContentLoaded", () => {
  // Reveal hero content
  document.body.classList.add("animate-ready");

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Reveal elements on scroll
  const revealElements = document.querySelectorAll(".reveal, .reveal-stagger");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));
});

// --- Gallery Logic ---
const items = document.querySelectorAll('#multiGallery .carousel-item');
items.forEach((el) => {
  const minPerSlide = 3;
  let next = el.nextElementSibling;
  for (let i = 1; i < minPerSlide; i++) {
    if (!next) {
      next = items[0];
    }
    let clone = next.querySelector('.col-md-4').cloneNode(true);
    el.querySelector('.row').appendChild(clone);
    next = next.nextElementSibling;
  }
});

const galleryImages = document.querySelectorAll('#desktopGallery img, #mobileGallery img');
galleryImages.forEach((img, index) => {
  img.style.cursor = "pointer";
  img.addEventListener('click', () => {
    const lightbox = new bootstrap.Modal(document.getElementById('galleryModal'));
    lightbox.show();
    const carousel = document.getElementById('lightboxCarousel');
    const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel);
    carouselInstance.to(index);
  });
});

// --- Menu Loading Logic ---
const menuContainer = document.getElementById("menuContainer");
if (menuContainer) {
  fetch("menu.json")
    .then(res => res.json())
    .then(data => {
      const categoryTabs = document.getElementById("categoryTabs");
      const defaultImage = "images/food/noFood.png";

      Object.keys(data).forEach(category => {
        // Create category tab button
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = category;
        btn.onclick = () => {
          const target = document.getElementById(category);
          const offset = 110; // optimized for new sticky header
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = target.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          document.querySelectorAll("#categoryTabs .btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          // Ensure the active tab is visible in the scrollable bar
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        };
        categoryTabs.appendChild(btn);

        // Category section
        const section = document.createElement("div");
        section.id = category;
        section.className = "mb-5 reveal";
        section.innerHTML = `<h3 class="mb-3 text-dark border-bottom pb-2" style="font-size: 1.3rem;">${category}</h3>`;

        data[category].forEach(item => {
          let priceHTML = "";
          if (typeof item.price === "string" || typeof item.price === "number") {
            priceHTML = `<span class="text-primary fw-bold">₹${item.price}</span>`;
          } else if (typeof item.price === "object") {
            const prices = Object.entries(item.price)
              .map(([size, cost]) => `<span><strong>${size}:</strong> <span class="text-primary">${cost}</span></span>`)
              .join(" | ");
            priceHTML = `<div class="small text-muted mt-1" style="font-size: 0.75rem;">${prices}</div>`;
          }

          const imageSrc = item.image ? item.image : defaultImage;
          section.innerHTML += `
                <div class="menu-item">
                    <div class="flex-grow-1">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="mb-1 text-muted">${item.description}</p>
                        ${priceHTML}
                    </div>
                    <img src="${imageSrc}" class="img-fluid shadow-sm" style="flex-shrink: 0; width: 65px; height: 65px; object-fit: cover; border-radius: 10px;" alt="${item.name}">
                </div>
                `;
        });

        menuContainer.appendChild(section);
        // Re-observe new elements
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("active");
          });
        }, { threshold: 0.1 });
        observer.observe(section);
      });
    });
}

// --- Search Logic ---
const menuSearch = document.getElementById("menuSearch");
if (menuSearch) {
  menuSearch.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll("#menuContainer > div");

    menuItems.forEach(item => {
      const name = item.querySelector("h5").innerText.toLowerCase();
      const desc = item.querySelector("p").innerText.toLowerCase();

      if (name.includes(searchTerm) || desc.includes(searchTerm)) {
        item.style.setProperty("display", "flex", "important");
      } else {
        item.style.setProperty("display", "none", "important");
      }
    });

    // Hide section headers if no items match in that section
    sections.forEach(section => {
      const visibleItems = section.querySelectorAll('.menu-item[style*="display: flex"]');
      if (visibleItems.length === 0 && searchTerm !== "") {
        section.style.display = "none";
      } else {
        section.style.display = "block";
      }
    });
  });
}

