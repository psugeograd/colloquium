(function () {
  var CSV_PATH = "assets/data/abstracts-2026.csv";

  function normalizeName(value) {
    return String(value || "")
      .replace(/\s*\(virtual\)\s*$/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function parseCsv(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;

    for (var i = 0; i < text.length; i += 1) {
      var ch = text[i];
      var next = text[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i += 1;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = "";
      } else if (ch === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (ch !== "\r") {
        field += ch;
      }
    }

    row.push(field);
    if (row.length > 1 || row[0]) {
      rows.push(row);
    }

    if (rows.length === 0) {
      return [];
    }

    var headers = rows[0].map(function (h) {
      return h.trim().toLowerCase();
    });

    return rows.slice(1).map(function (values) {
      var record = {};
      headers.forEach(function (header, index) {
        record[header] = values[index] || "";
      });
      return record;
    });
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildNamePattern(name) {
    return escapeRegex(name.trim()).replace(/\s+/g, "\\s+");
  }

  function createPresenterButton(label, presentation) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "presenter-link";
    button.textContent = label;
    button.setAttribute("aria-label", "Show presentation details for " + label);
    button.addEventListener("click", function () {
      openModal(presentation);
    });
    return button;
  }

  function linkifyTextNode(textNode, byName, namesRegex) {
    var text = textNode.nodeValue;
    namesRegex.lastIndex = 0;
    if (!text || !namesRegex.test(text)) {
      return;
    }

    namesRegex.lastIndex = 0;
    var fragment = document.createDocumentFragment();
    var lastIndex = 0;
    var match = namesRegex.exec(text);

    while (match) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      var matchedName = match[0];
      var presentation = byName[normalizeName(matchedName)];
      if (presentation) {
        fragment.appendChild(createPresenterButton(matchedName, presentation));
      } else {
        fragment.appendChild(document.createTextNode(matchedName));
      }

      lastIndex = match.index + matchedName.length;
      match = namesRegex.exec(text);
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  }

  function linkifyNode(node, byName, namesRegex) {
    var children = Array.prototype.slice.call(node.childNodes);
    children.forEach(function (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        linkifyTextNode(child, byName, namesRegex);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        var tag = child.tagName;
        if (tag !== "BUTTON" && tag !== "A" && tag !== "SCRIPT" && tag !== "STYLE") {
          linkifyNode(child, byName, namesRegex);
        }
      }
    });
  }

  function openModal(presentation) {
    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function decodeEscapedNewlines(value) {
      return String(value || "")
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n");
    }

    function applyScriptMarkers(text) {
      return text
        .replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>")
        .replace(/_\{([^{}]+)\}/g, "<sub>$1</sub>")
        .replace(/\*\{([^{}]+)\}/g, "<i>$1</i>");
    }

    function formatDisplayHtml(value) {
      var text = decodeEscapedNewlines(value);
      var safe = escapeHtml(text);
      var scripted = applyScriptMarkers(safe);
      return scripted.replace(/\n/g, '<span class="nl-break" aria-hidden="true"></span>');
    }

    var modalLabel = document.getElementById("presentationModalLabel");
    var authors = document.getElementById("presentationAuthors");
    var institutions = document.getElementById("presentationInstitutions");
    var abstractEl = document.getElementById("presentationAbstract");

    if (!modalLabel || !authors || !institutions || !abstractEl) {
      return;
    }

    modalLabel.innerHTML = formatDisplayHtml(presentation.title) || "Untitled Presentation";
    authors.innerHTML = formatDisplayHtml(presentation.authors) || "Not provided";
    institutions.innerHTML = formatDisplayHtml(presentation.institutions) || "Not provided";
    abstractEl.innerHTML = formatDisplayHtml(presentation.abstract) || "Not provided";

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
      window.jQuery("#presentationModal").modal("show");
    }
  }

  function setupPresenterLinks(presentations) {
    var scheduleRoot = document.getElementById("schedule");
    if (!scheduleRoot) {
      return;
    }

    var byName = {};
    presentations.forEach(function (item) {
      var key = normalizeName(item.name);
      if (key) {
        byName[key] = item;
      }
    });

    var names = presentations
      .map(function (item) {
        return (item.name || "").trim();
      })
      .filter(function (name) {
        return name.length > 0;
      })
      .sort(function (a, b) {
        return b.length - a.length;
      });

    if (!names.length) {
      return;
    }

    var namesRegex = new RegExp(names.map(buildNamePattern).join("|"), "gi");
    var cells = scheduleRoot.querySelectorAll("td");

    cells.forEach(function (cell) {
      if (
        cell.classList.contains("header") ||
        cell.classList.contains("break") ||
        cell.classList.contains("comp-type")
      ) {
        return;
      }

      linkifyNode(cell, byName, namesRegex);
    });
  }

  async function init() {
    try {
      var response = await fetch(CSV_PATH, { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      var csvText = await response.text();
      var presentations = parseCsv(csvText);
      setupPresenterLinks(presentations);
    } catch (err) {
      // Keep schedule usable even when CSV loading fails.
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
