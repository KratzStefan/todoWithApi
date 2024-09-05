const neuerTodoBtn = document.getElementById("neuerTodoBtn");
const neuesTodoInput = document.getElementById("neuesTodoInput");
const liste = document.getElementById("liste");
const filterRadios = document.querySelectorAll('input[name="filter"]');
const aufgabenLoeschenBtn = document.getElementById("aufgabenLoeschen");

let todos = [];
let filter = "all";

function todosLaden() {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todosVonApi) => {
      todos = todosVonApi;
      todosAnzeigen();
    });
}

function todosAnzeigen() {
  liste.innerHTML = "";

  const gefilterteTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "open") return !todo.done;
    if (filter === "done") return todo.done;
  });

  gefilterteTodos.forEach((todo) => {
    const neuerListeneintrag = document.createElement("li");

    // Checkbox für den Status
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;

    // Textknoten für das Todo
    const text = document.createTextNode(todo.description);

    // Event Listener für Checkbox-Änderungen
    checkbox.addEventListener("change", () => {
      todoAktualisieren(todo.id, { done: checkbox.checked });
    });

    neuerListeneintrag.appendChild(checkbox);
    neuerListeneintrag.appendChild(text);
    liste.appendChild(neuerListeneintrag);
  });
}

neuerTodoBtn.addEventListener("click", () => {
  const neuesTodoText = neuesTodoInput.value;
  if (!neuesTodoText) return;

  const neuerEintrag = {
    description: neuesTodoText,
    done: false,
  };

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(neuerEintrag),
  })
    .then((res) => res.json())
    .then((neuesTodo) => {
      todos.push(neuesTodo);
      todosAnzeigen();
      neuesTodoInput.value = ""; // Eingabefeld leeren
    });
});

function todoAktualisieren(id, daten) {
  // Finde das spezifische Todo in der Liste und aktualisiere es
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    // Behalte die vorhandene Beschreibung bei und aktualisiere nur den "done"-Status
    const aktualisiertesTodo = { ...todos[index], ...daten };

    // Update in der lokalen Array
    todos[index] = aktualisiertesTodo;

    // Aktualisierung auf dem Server
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aktualisiertesTodo),
    })
      .then((res) => res.json())
      .then(() => {
        todosAnzeigen();
      });
  }
}

function todoLoeschen(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  }).then(() => {
    todos = todos.filter((todo) => todo.id !== id);
    todosAnzeigen();
  });
}

filterRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    filter = e.target.value;
    todosAnzeigen();
  });
});

// Funktion zum Löschen erledigter Todos
aufgabenLoeschenBtn.addEventListener("click", () => {
  const erledigteTodos = todos.filter((todo) => todo.done);

  erledigteTodos.forEach((todo) => {
    todoLoeschen(todo.id);
  });
});

todosLaden();

/*const neuerTodoBtn = document.getElementById("neuerTodoBtn");
const neuesTodoInput = document.getElementById("neuesTodoInput");
const liste = document.getElementById("liste");

let todos = [];

function todosLaden() {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todosVonApi) => {
      todos = todosVonApi;
      todosAnzeigen();
    });
}

function todosAnzeigen() {
  liste.innerHTML = "";
  todos.forEach((todo) => {
    const neuerListeneintrag = document.createElement("li");
    const text = document.createTextNode(todo.description);
    neuerListeneintrag.appendChild(text);
    liste.appendChild(neuerListeneintrag);
  });
}

neuerTodoBtn.addEventListener("click", () => {
  const neuesTodoText = neuesTodoInput.value;
  const neuerEintrag = {
    description: neuesTodoText,
    done: false,
  };
  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(neuerEintrag),
  })
    .then((res) => res.json())
    .then((neuesTodo) => {
      todos.push(neuesTodo);
      todosAnzeigen();
    });
});

todosLaden();*/
