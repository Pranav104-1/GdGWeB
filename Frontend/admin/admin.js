const modal = document.getElementById("modal");
const table = document.getElementById("studentTable");

let students = JSON.parse(localStorage.getItem("gdg_students")) || [];

document.getElementById("addStudentBtn").onclick = () =>
  (modal.style.display = "flex");

function closeModal() {
  modal.style.display = "none";
}

/* Add student */
function addStudent() {
  const student = {
    name: name.value,
    email: email.value,
    course: course.value,
    year: year.value,
  };

  students.push(student);
  saveStudents();
  renderStudents();
  closeModal();
}

/* Save */
function saveStudents() {
  localStorage.setItem("gdg_students", JSON.stringify(students));
}

/* Render */
function renderStudents() {
  table.innerHTML = "";

  students.forEach((s, i) => {
    const row = document.createElement("tr");

    row.innerHTML = `
<td>${s.name}</td>
<td>${s.email}</td>
<td>${s.course}</td>
<td>${s.year}</td>
<td><button onclick="deleteStudent(${i})">❌</button></td>
`;

    table.appendChild(row);
  });

  document.getElementById("totalMembers").textContent = students.length;
  document.getElementById("activeMembers").textContent = students.length;
}

/* Delete */
function deleteStudent(index) {
  students.splice(index, 1);
  saveStudents();
  renderStudents();
}

/* Search */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  document.querySelectorAll("tbody tr").forEach((row) => {
    row.style.display = row.innerText.toLowerCase().includes(value)
      ? ""
      : "none";
  });
});

renderStudents();
