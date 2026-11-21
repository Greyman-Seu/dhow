const filters = document.querySelector(".filters");
const buttons = [...filters.querySelectorAll("button")];
const entries = [...document.querySelectorAll(".entry")];
const empty = document.querySelector(".empty");

// Show the filters once there is more than one category to choose from.
filters.hidden = new Set(entries.map((entry) => entry.dataset.kind)).size < 2;

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  for (const filter of buttons) {
    filter.setAttribute("aria-pressed", String(filter === button));
  }

  const category = button.dataset.filter;
  for (const entry of entries) {
    entry.hidden = category !== "all" && entry.dataset.kind !== category;
  }

  empty.hidden = entries.some((entry) => !entry.hidden);
});
