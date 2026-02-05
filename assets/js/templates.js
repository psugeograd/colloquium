/*
 * Common Template Loader
 * Loads shared sidebar into all pages
 */
$(document).ready(function () {
  var el = document.getElementById("sidebar-content");
  if (el) {
    fetch("includes/sidebar.html")
      .then(function (res) {
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      });
  }

  // Mobile sidebar toggle
  $("#mobile-toggle a").click(function () {
    $("#left-column").toggle();
  });
});
