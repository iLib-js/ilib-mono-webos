document.addEventListener("DOMContentLoaded", function () {
  const toggleNoIssues = document.getElementById("toggleNoIssues");
   // Toggle no-issues rows
  if (toggleNoIssues) {
    toggleNoIssues.addEventListener("change", function () {
      const noIssueRows = document.querySelectorAll("tr.no-issues");
      noIssueRows.forEach(row => {
        row.style.display = this.checked ? "none" : "";
      });
    });
  }
});
