// Menu (show/hidden)

   const navMenu = document.getElementById("nav-menu"),
   navToggle = document.getElementById("nav-toggle"),
   navClose = document.getElementById("nav-close");
 
 /* Menu (show) */
 if (navToggle) {
   navToggle.addEventListener("click", () => {
     navMenu.classList.add("show-menu");
   });
 }
 
 /* Menu (hidden) */
 if (navClose) {
   navClose.addEventListener("click", () => {
     navMenu.classList.remove("show-menu");
   });
 }
 
 /* Mobile menu */

 const navLink = document.querySelectorAll(".nav-link");
 function linkAction() {
   const navMenu = document.getElementById("nav-menu");
   navMenu.classList.remove("show-menu");
 }
 navLink.forEach((n) => n.addEventListener("click", linkAction));
 
 // Skills (accordion)

 const skillsContent = document.getElementsByClassName("skills-container-content"),
   skillsHeader = document.querySelectorAll(".skills-container-header");
 
 function toggleSkills() {
   const itemClass = this.parentNode.className;
   for (let i = 0; i < skillsContent.length; i++) {
     skillsContent[i].className = "skills-container-content skills-close";
   }
   if (itemClass === "skills-container-content skills-close") {
     this.parentNode.className = "skills-container-content skills-open";
   }
 }
 skillsHeader.forEach((el) => el.addEventListener("click", toggleSkills));
 
 // Experience tabs

 const tabs = document.querySelectorAll("[data-target]"),
   tabContents = document.querySelectorAll("[data-content]");
 
 tabs.forEach((tab) => {
   tab.addEventListener("click", () => {
     const target = document.querySelector(tab.dataset.target);
 
     tabContents.forEach((tabContent) => {
       tabContent.classList.remove("experience-active");
     });
     if (target) target.classList.add("experience-active");
 
     tabs.forEach((t) => t.classList.remove("experience-active"));
     tab.classList.add("experience-active");
   });
 });
 
 // Scroll sections (active link)

 const sections = document.querySelectorAll("section[id]");
 function scrollActive() {
   const scrollY = window.pageYOffset;
 
   sections.forEach((current) => {
     const sectionHeight = current.offsetHeight;
     const sectionTop = current.offsetTop - 50;
     const sectionId = current.getAttribute("id");
     const link = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
     if (!link) return;
 
     if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
       link.classList.add("active-link");
     } else {
       link.classList.remove("active-link");
     }
   });
 }
 window.addEventListener("scroll", scrollActive);
 
 // Background header

 function scrollHeader() {
   const nav = document.getElementById("header");
   if (!nav) return;
   if (this.scrollY >= 80) nav.classList.add("scroll-header");
   else nav.classList.remove("scroll-header");
 }
 window.addEventListener("scroll", scrollHeader);
 
 // Show scroll to top
   
 function scrollUp() {
   const scrollUp = document.getElementById("scroll-up");
   if (!scrollUp) return;
   if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
   else scrollUp.classList.remove("show-scroll");
 }
 window.addEventListener("scroll", scrollUp);
 
 // Dark/Light mode

 const themeButton = document.getElementById("theme-button");
 const darkTheme = "dark-theme";
 const iconTheme = "fa-sun";
 
 const selectedTheme = localStorage.getItem("selected-theme");
 const selectedIcon = localStorage.getItem("selected-icon");
 
 const getCurrentTheme = () =>
   document.body.classList.contains(darkTheme) ? "dark" : "light";
 const getCurrentIcon = () =>
   themeButton && themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun";
 
 if (selectedTheme) {
   document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);
   if (themeButton) {
     themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](iconTheme);
   }
 }
 
 if (themeButton) {
   themeButton.addEventListener("click", () => {
     document.body.classList.toggle(darkTheme);
     themeButton.classList.toggle(iconTheme);
     localStorage.setItem("selected-theme", getCurrentTheme());
     localStorage.setItem("selected-icon", getCurrentIcon());
   });
 }
 
 // One-time DOMContentLoaded setup

 document.addEventListener("DOMContentLoaded", async () => {
   /* Mail integration (guard for pages without the form) */
   if (window.emailjs) {
     emailjs.init("XH-wjDOVwG4PyvqRw");
   }
   const form = document.getElementById("contact-form");
   if (form && window.emailjs) {
     form.addEventListener("submit", function (event) {
       event.preventDefault();
       emailjs
         .sendForm("service_l8o0l77", "template_bab1nob", this)
         .then(function (response) {
           console.log("Success!", response.status, response.text);
           alert("Email sent successfully!");
           form.reset();
         })
         .catch(function (error) {
           console.log("Failed...", error);
           alert("Email sending failed.");
         });
     });
   }
 
   // Projects swiper (scoped)
   if (window.Swiper) {
     new Swiper(".articles-container", {
       loop: true,
       grabCursor: true,
       navigation: {
         nextEl: ".articles-container .swiper-button-next",
         prevEl: ".articles-container .swiper-button-prev",
       },
       pagination: {
         el: ".articles-container .swiper-pagination",
         clickable: true,
       },
     });
   }
 
   // Moments Gallery - auto build from GitHub /img

   const GH_OWNER = "mai-103";
   const GH_REPO  = "maialshaaban";
   const GH_PATH  = "img"; //gallery
 
   const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`;
   const wrapper = document.querySelector("#moments-gallery #gallery-wrapper");
 
   if (wrapper) {
     let files = [];
     try {
       const res = await fetch(api, {
         headers: { Accept: "application/vnd.github+json" },
       });
       if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
       const data = await res.json();
 
       const allow = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
       files = data
         .filter(
           (it) =>
             it.type === "file" &&
             allow.has(it.name.slice(it.name.lastIndexOf(".")).toLowerCase())
         )
         .sort((a, b) =>
           a.name.localeCompare(b.name, undefined, { numeric: true })
         )
         .map((it) => it.download_url);
     } catch (err) {
       console.error("Failed to list images from GitHub:", err);
       // Graceful exit; just don't render the gallery
     }
 
     // Build slides
     if (files.length) {
       const frag = document.createDocumentFragment();
       files.forEach((src) => {
         const slide = document.createElement("div");
         slide.className = "swiper-slide";
 
         const img = document.createElement("img");
         img.src = src;
         img.alt = ""; // decorative as requested
         img.loading = "lazy";
         img.decoding = "async";
         img.draggable = false;
 
         slide.appendChild(img);
         frag.appendChild(slide);
       });
       wrapper.appendChild(frag);
     }
 
     // Init Swiper AFTER slides exist
     if (window.Swiper) {
      new Swiper("#moments-gallery .gallery-swiper", {
        loop: true,
        grabCursor: true,
      
        // mobile-first
        slidesPerView: 1,
        spaceBetween: 16,
      
        // touch feels snappy
        simulateTouch: true,
        allowTouchMove: true,
        touchRatio: 1.6,
        threshold: 3,
        longSwipes: true,
        longSwipesMs: 120,
        longSwipesRatio: 0.2,
        shortSwipes: true,
        followFinger: true,
        resistanceRatio: 0.65,
      
        // ⚡️ Trackpad / mouse wheel support (no click needed)
        mousewheel: {                 // <— enable smooth two-finger swipe
          enabled: true,
          forceToAxis: true,          // only react to horizontal wheel
          releaseOnEdges: true,       // let page scroll when at ends
          sensitivity: 0.7
        },
      
        // Keyboard arrows also work without focusing first
        keyboard: { enabled: true, onlyInViewport: true },
      
        // Clicking a slide to jump is optional—turn off if it ever feels grabby
        slideToClickedSlide: false,
      
        navigation: {
          nextEl: "#moments-gallery .swiper-button-next",
          prevEl: "#moments-gallery .swiper-button-prev",
        },
        pagination: {
          el: "#moments-gallery .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          768:  { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        },
      });      
     }
   }
 });

 


