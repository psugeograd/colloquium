// Live search - fetches and searches HTML pages dynamically
(function () {
  const pages = [
    { url: "index.html", title: "Home" },
    { url: "abstracts.html", title: "Abstracts" },
    { url: "submit.html", title: "Submit Abstract/Contest Entry" },
    { url: "rules.html", title: "Rules and Judging Guidelines" },
    { url: "awards.html", title: "Awards" },
    { url: "contact.html", title: "Committee Members and Contacts" },
    { url: "schedule.html", title: "Schedule" },
  ];

  async function fetchPageContent(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      // Get main content, excluding navigation
      const body = doc.querySelector(".document.clearer.body") || doc.body;
      return body.textContent.replace(/\s+/g, " ").trim();
    } catch (e) {
      return "";
    }
  }

  function getSnippet(text, query, snippetLength = 150) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    if (index === -1) return "";

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + snippetLength);
    let snippet = text.slice(start, end);

    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";

    // Highlight the match
    const regex = new RegExp(
      "(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi",
    );
    snippet = snippet.replace(regex, "<strong>$1</strong>");

    return snippet;
  }

  async function doSearch(query) {
    const resultsDiv = document.getElementById("search-results");
    if (!query || query.length < 2) {
      resultsDiv.innerHTML = "<p>Please enter at least 2 characters.</p>";
      return;
    }

    resultsDiv.innerHTML = "<p>Searching...</p>";
    const results = [];

    for (const page of pages) {
      const content = await fetchPageContent(page.url);
      if (content.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          title: page.title,
          url: page.url,
          snippet: getSnippet(content, query),
        });
      }
    }

    if (results.length === 0) {
      resultsDiv.innerHTML =
        '<p>No results found for "<strong>' + query + '</strong>".</p>';
    } else {
      let html = '<h2>Search Results</h2><ul class="search-results-list">';
      for (const result of results) {
        html += "<li>";
        html +=
          '<a href="' +
          result.url +
          '"><strong>' +
          result.title +
          "</strong></a>";
        if (result.snippet) {
          html += '<p class="search-snippet">' + result.snippet + "</p>";
        }
        html += "</li>";
      }
      html += "</ul>";
      resultsDiv.innerHTML = html;
    }
  }

  // Initialize search
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".search-page-form form");
    const input = form ? form.querySelector('input[name="q"]') : null;

    if (form && input) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        doSearch(input.value);
      });

      // Also search on button click
      const btn = form.querySelector("button");
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          doSearch(input.value);
        });
      }

      // Check for query in URL
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("q");
      if (q) {
        input.value = q;
        doSearch(q);
      }
    }
  });
})();
