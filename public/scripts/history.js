const container = document.getElementById("history-list");
const exitBtn = document.querySelector(".exit");

const historyData = JSON.parse(localStorage.getItem("quizHistory")) || [];

if (historyData.length === 0) {
  container.innerHTML = `<p style="color:white; text-align:center;">No attempts yet!</p>`;
} else {
  historyData.forEach(({ name, score }) => {
    const row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = `
      <div class="name">${name}</div>
      <div class="score">${score}</div>
    `;
    container.appendChild(row);
  });
}

exitBtn.addEventListener("click", () => {
  location.href = "index.html";
});
