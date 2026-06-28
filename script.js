// ===== CLOCK =====
function updateClock() {
    const now = new Date();
    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();
// ===== DATE =====
document.getElementById("currentDate").innerText =
    new Date().toDateString();
// ===== BOOK ADD SYSTEM (FIXED) =====
let bookCount = 0;
const maxBooks = 5;
document.getElementById("addBookBtn").addEventListener("click", function () {
    const container = document.getElementById("extraBooks");
    if (bookCount >= maxBooks) {
        alert("Maximum 5 books only allowed!");
        return;
    }
    bookCount++;
    const div = document.createElement("div");
    div.classList.add("input-group");
    div.innerHTML = `
        <label>Book ${bookCount} Accession Number</label>
        <input type="text" class="bookNumber" placeholder="Enter Book ${bookCount} Number">
        <label>Book ${bookCount} Name</label>
        <input type="text" class="bookName" placeholder="Enter Book ${bookCount} Name">
    `;
    container.appendChild(div);
});
// ===== AUTO DUE DATE =====
document.getElementById("issueDate").addEventListener("change", function () {
    const issue = new Date(this.value);
    if (!isNaN(issue)) {
        const due = new Date(issue);
        due.setDate(due.getDate() + 7);
        document.getElementById("dueDate").value =
            due.toISOString().split("T")[0];
    }
});
// ===== CALCULATE FINE =====
document.getElementById("calculateBtn").addEventListener("click", function () {
    const issue = new Date(document.getElementById("issueDate").value);
    const due = new Date(document.getElementById("dueDate").value);
    const ret = new Date(document.getElementById("returnDate").value);
    if (isNaN(issue) || isNaN(due) || isNaN(ret)) {
        alert("Please fill all dates!");
        return;
    }
    const totalDays = Math.ceil((ret - issue) / (1000 * 60 * 60 * 24));
    const extraDays = Math.max(0, Math.ceil((ret - due) / (1000 * 60 * 60 * 24)));
    const fine = extraDays * 1;
    document.getElementById("days").innerText = totalDays;
    document.getElementById("extraDays").innerText = extraDays;
    document.getElementById("fine").innerText = fine;
    document.getElementById("status").innerText =
        fine > 0 ? "Fine Pending" : "No Fine";
});
// ===== SAVE TO HISTORY =====
document.getElementById("saveBtn").addEventListener("click", function () {
    const name = document.getElementById("studentName").value;
    const reg = document.getElementById("registerNumber").value;
    // FIXED: multiple books collect
    const bookNumbers = Array.from(document.querySelectorAll(".bookNumber"))
        .map(b => b.value)
        .join(", ");
    const bookNames = Array.from(document.querySelectorAll(".bookName"))
        .map(b => b.value)
        .join(", ");
    const days = document.getElementById("days").innerText;
    const fine = document.getElementById("fine").innerText;
    const status = document.getElementById("status").innerText;
    const row = `
        <tr>
            <td>${name}</td>
            <td>${reg}</td>
            <td>${bookNumbers}</td>
            <td>${bookNames}</td>
            <td>${days}</td>
            <td>${fine}</td>
            <td>${status}</td>
        </tr>
    `;
    document.getElementById("historyTable").innerHTML += row;
});
// ===== RESET =====
document.getElementById("resetBtn").addEventListener("click", function () {
    document.querySelectorAll("input").forEach(input => input.value = "");
    document.getElementById("days").innerText = "0";
    document.getElementById("extraDays").innerText = "0";
    document.getElementById("fine").innerText = "0";
    document.getElementById("status").innerText = "No Fine";
    document.getElementById("extraBooks").innerHTML = "";
    bookCount = 0;
});
// ===== SEARCH FILTER =====
document.getElementById("searchInput").addEventListener("keyup", function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("#historyTable tr");
    rows.forEach(row => {
        row.style.display =
            row.innerText.toLowerCase().includes(filter)
                ? ""
                : "none";
    });
});