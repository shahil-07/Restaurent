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
  
// Select all gallery images
const galleryImages = document.querySelectorAll('#desktopGallery img, #mobileGallery img');

galleryImages.forEach((img, index) => {
  img.style.cursor = "pointer"; 
  img.addEventListener('click', () => {
    // Open modal
    const lightbox = new bootstrap.Modal(document.getElementById('galleryModal'));
    lightbox.show();

    // Move carousel to clicked image
    const carousel = document.getElementById('lightboxCarousel');
    const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel);
    carouselInstance.to(index);
  });
});

// Load menu.json
fetch("menu.json")
  .then(res => res.json())
  .then(data => {
    const categoryTabs = document.getElementById("categoryTabs");
    const menuContainer = document.getElementById("menuContainer");
    const defaultImage = "images/food/noFood.png";

    Object.keys(data).forEach(category => {
      // Create category tab button
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary btn-sm";
      btn.innerText = category;
      btn.onclick = () => {
        document.getElementById(category).scrollIntoView({ behavior: "smooth" });
        // remove active class from all
        document.querySelectorAll("#categoryTabs .btn").forEach(b => b.classList.remove("active"));
        
        // add active to clicked
        btn.classList.add("active");
      };
      categoryTabs.appendChild(btn);

      // Category section
      const section = document.createElement("div");
      section.id = category;
      section.className = "mb-5";
      section.innerHTML = `<h3 class="mb-3 text-primary">${category}</h3>`;
      
      data[category].forEach(item => {
        let priceHTML = "";

        if (typeof item.price === "string" || typeof item.price === "number") {
          priceHTML = `<p class="fw-bold text-success">₹${item.price}</p>`;
        
        } else if (typeof item.price === "object") {
          // Multiple prices inline
          const prices = Object.entries(item.price)
            .map(([size, cost]) => `<span><strong>${size}:</strong> <span class="text-success">${cost}</span></span>`)
            .join(" | ");
          
          priceHTML = `<p class="fw-bold mb-0">${prices}</p>`;
        }
        const imageSrc = item.image ? item.image : defaultImage; 
        section.innerHTML += `
          <div class="menu-item py-3 border-bottom d-flex align-items-center justify-content-between">
            <div class="me-3">
              <h5 class="mb-1">${item.name}</h5>
              <p class="mb-1 text-muted">${item.description}</p>
               ${priceHTML}
            </div>
            <img src="${imageSrc}" class="img-fluid rounded" style="max-height:80px; width:80px; object-fit:cover;" alt="${item.name}">
          </div>
        `;
      });

      menuContainer.appendChild(section);
    });
  });

