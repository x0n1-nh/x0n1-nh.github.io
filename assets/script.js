document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  });

  const linkMap = {
    "HackTheBox": "htb.html",
    "TryHackMe": "tryhackme.html",
    "VulnHub": "vulnhub.html",
    "Certifications": "exams.html",
    "Courses": "courses.html",
    "Labs": "labs.html",
    "Articles": "articles.html"
  };

  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    for (const [label, href] of Object.entries(linkMap)) {
      if (btn.textContent.includes(label)) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = btn.textContent;
        link.style.color = btn.style.color;
        link.style.textDecoration = "none";
        btn.replaceWith(link);
        break;
      }
    }
  });

  document.querySelectorAll(".filter-toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".filter-group");
      group.classList.toggle("active");
    });
  });

  const checkboxes = document.querySelectorAll(".filter-options input[type='checkbox']");
  const searchInput = document.getElementById("searchBar");

  function filterArticles() {
    const searchValue = searchInput.value.toLowerCase();
    const articles = document.querySelectorAll(".article-card");

    const filtersByCategory = {};
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const group = cb.closest('.filter-group');
        const groupName = group.querySelector('.filter-toggle')?.textContent?.trim();
        if (!filtersByCategory[groupName]) filtersByCategory[groupName] = [];
        filtersByCategory[groupName].push(cb.value.toLowerCase());
      }
    });

    let visibleCount = 0;

    articles.forEach(article => {
      const tags = article.dataset.tags.split(',').map(t => t.trim());
      const text = article.textContent.toLowerCase();

      const matchesAllGroups = Object.values(filtersByCategory).every(groupTags =>
        groupTags.some(tag => tags.includes(tag))
      );

      const searchMatch = text.includes(searchValue);

      let shouldShow = true;

      if (searchValue && !searchMatch) {
        shouldShow = false;
      }

      if (Object.keys(filtersByCategory).length > 0 && !matchesAllGroups) {
        shouldShow = false;
      }

      if (shouldShow) {
        article.classList.remove("fade-out");
        article.style.display = "block";
        setTimeout(() => article.classList.add("fade-in"), 10); 
      }
      else {
        article.classList.remove("fade-in");
        article.classList.add("fade-out");
        setTimeout(() => {
          article.style.display = "none";
        }, 300); 
      }

      if (shouldShow) visibleCount++;
    });

    let noResults = document.getElementById("no-results");
    if (!noResults) {
      noResults = document.createElement("div");
      noResults.id = "no-results";
      noResults.style.color = "#aaa";
      noResults.style.fontStyle = "italic";
      noResults.style.textAlign = "center";
      noResults.style.marginTop = "30px";
      document.getElementById("articles").appendChild(noResults);
    }

    if (visibleCount === 0) {
      noResults.textContent = "😶 No matching articles found.";
      noResults.classList.add("visible");
    } else {
      noResults.classList.remove("visible");
      setTimeout(() => { noResults.textContent = ""; }, 300); 
    }

  }

  checkboxes.forEach(cb => cb.addEventListener("change", filterArticles));
  searchInput.addEventListener("input", filterArticles);

 
  const page = window.location.pathname.split("/").pop();
  let jsonFile = "assets/articles.json";


  if (page === "htb.html") jsonFile = "assets/htb.json";
  else if (page === "tryhackme.html") jsonFile = "assets/thm.json";
  else if (page === "vulnhub.html") jsonFile = "assets/vulnhub.json";
  else if (page === "exams.html") jsonFile = "assets/exams.json";
  else if (page === "courses.html") jsonFile = "assets/courses.json";
  else if (page === "labs.html") jsonFile = "assets/labs.json";
  else if (page === "articles.html") jsonFile = "assets/articoli.json";

  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("articles");
      if (container) {
        container.innerHTML = "";

        data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .forEach(article => {
            const card = document.createElement("div");
            card.className = "article-card";
            card.setAttribute("data-tags", article.tags.map(t => t.toLowerCase()).join(","));

            card.innerHTML = `
              <h3><a href="${article.url}">${article.title}</a></h3>
              <p>${article.description}</p>
              <div class="tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}
              </div>
              <div class="article-meta">
                <span class="date">📅 ${article.date}</span>
              </div>
            `;
            container.appendChild(card);
          });

        filterArticles();
        setTimeout(() => {
        if (window.AOS && typeof AOS.refreshHard === "function") {
          AOS.refreshHard();
        }
      
        const section = document.getElementById("articles");
        if (section && section.offsetHeight < 50) {
          section.style.minHeight = "1px";
        }
      }, 300);


      }
    })
    .catch(err => console.error("Errore nel caricamento JSON:", err));
});

document.getElementById("scrollToArticles")?.addEventListener("click", (e) => {
  e.preventDefault();
  const target = document.getElementById("articles");
  const container = document.querySelector(".main-content");
  if (target && container) {
    container.scrollTo({
      top: target.offsetTop,
      behavior: "smooth"
    });
  }
});


document.querySelectorAll(".medium-style-zoom").forEach(img => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "medium-lightbox-overlay";

    const zoomedImg = document.createElement("img");
    zoomedImg.src = img.src;
    zoomedImg.alt = img.alt || "";

    overlay.appendChild(zoomedImg);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => overlay.remove());
  });
});

const terminalTitle = "x0n1 Dropzone";
let cursor = 0;
const speed = 90;
const target = document.querySelector(".typed-terminal");

function typeTitleRAF() {
  if (cursor < terminalTitle.length) {
    target.textContent += terminalTitle.charAt(cursor);
    cursor++;
    setTimeout(() => requestAnimationFrame(typeTitleRAF), speed);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  target.textContent = "";
  requestAnimationFrame(typeTitleRAF);                        
});

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".toc-link");
  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const container = document.querySelector(".main-content");

  function onScroll() {
    let current = sections[0];

    const containerTop = container.getBoundingClientRect().top;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const offset = rect.top - containerTop;

      if (offset <= 100) {
        current = section;
      }
    }

    links.forEach(link => link.classList.remove("active-toc"));

    const activeLink = document.querySelector('.toc-link[href="#' + current.id + '"]');
    if (activeLink) activeLink.classList.add("active-toc");

    if (container.scrollTop < 50) {
      links.forEach(link => link.classList.remove("active-toc"));
      const first = document.querySelector('.toc-link[href="#' + sections[0].id + '"]');
      if (first) first.classList.add("active-toc");
    }

    const maxScroll = container.scrollHeight - container.clientHeight;
    if (container.scrollTop >= maxScroll - 50) {
      links.forEach(link => link.classList.remove("active-toc"));
      const last = document.querySelector('.toc-link[href="#' + sections[sections.length - 1].id + '"]');
      if (last) last.classList.add("active-toc");
    }
  }

  container.addEventListener("scroll", onScroll);
  onScroll();
});


document.querySelectorAll('.toc-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    const container = document.querySelector('.main-content');

    if (target && container) {
      const scrollOffset = target.offsetTop - container.offsetTop;
      container.scrollTo({
        top: scrollOffset - 100,
        behavior: 'smooth'
      });
    }
  });
});

document.querySelectorAll(".filter-options > li").forEach(parent => {
  const childUl = parent.querySelector("ul");
  if (childUl) {
    const toggle = document.createElement("span");
    toggle.textContent = "▶";
    toggle.style.marginRight = "6px";
    toggle.style.cursor = "pointer";
    toggle.style.color = "orange";

    const link = parent.querySelector("a");
    link.prepend(toggle);

    childUl.style.display = "none";

    link.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = childUl.style.display === "block";
      childUl.style.display = isOpen ? "none" : "block";
      toggle.textContent = isOpen ? "▶" : "▼";
    });
  }
});
