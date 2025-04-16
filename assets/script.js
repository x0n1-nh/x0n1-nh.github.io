function filterArticles() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const articles = document.querySelectorAll(".article-card");
  const checkboxes = document.querySelectorAll(".filter-options input[type='checkbox']");

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
    } else {
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
          card.setAttribute("data-aos", "fade-up"); // ✅ necessario per AOS

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
          AOS.refreshHard(); // ✅ Forza re-scan
        }
      }, 500);
    }
  })
  .catch(err => console.error("Errore nel caricamento JSON:", err));


window.addEventListener("load", () => {
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ once: true, duration: 600 });
  }
});
