document.addEventListener("DOMContentLoaded", function () {
  const ruleChecks = document.querySelectorAll(".rule-check");
  const detailTables = document.querySelectorAll("#detail-section table");
  const selectAllBtn = document.getElementById("select-all");
  const unselectAllBtn = document.getElementById("unselect-all");

  // DEFAULT: 모든 체크박스 체크 → 모든 detail 보임
  ruleChecks.forEach(c => c.checked = true);

  // 체크박스 변경 시 필터링
  ruleChecks.forEach(chk => chk.addEventListener("change", filterDetails));

  // 전체 선택
  selectAllBtn.addEventListener("click", () => {
    ruleChecks.forEach(c => c.checked = true);
    filterDetails();
  });

  // 전체 해제
  unselectAllBtn.addEventListener("click", () => {
    ruleChecks.forEach(c => c.checked = false);
    filterDetails();
  });

  function filterDetails() {
    const selected = [...document.querySelectorAll(".rule-check:checked")]
      .map(c => c.value);

    // 선택된 rule이 없으면 숨기기
    if (selected.length === 0) {
      detailTables.forEach(t => (t.style.display = "none"));
      return;
    }

    detailTables.forEach(table => {
      const ruleCell = [...table.querySelectorAll("tr")].find(
        tr => tr.firstElementChild && tr.firstElementChild.textContent.trim() === "rule"
      );

      if (!ruleCell) {
        table.style.display = "none";
        return;
      }

      const ruleValue = ruleCell.children[1].textContent.trim();

      if (selected.includes(ruleValue)) {
        table.style.display = "";
        [...table.querySelectorAll("tr")].forEach(tr => tr.style.display = "");
      } else {
        table.style.display = "none";
      }
    });
  }

  // DEFAULT: 전체 표시
  filterDetails();
});
