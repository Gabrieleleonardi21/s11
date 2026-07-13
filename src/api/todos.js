const BASE_URL = "http://localhost:3001/todos";

// Helper unico per tutte le chiamate: evita di ripetere fetch, headers e gestione errori
async function request(path = "", options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Richiesta fallita (${res.status}). Il server json-server è attivo sulla porta 3001?`);
  }

  return res.json();
}

// GET: legge tutti i todo
export function getTodos() {
  return request();
}

// POST: crea un nuovo todo (l'id lo genera json-server)
export function createTodo(text) {
  return request("", {
    method: "POST",
    body: JSON.stringify({
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    }),
  });
}

// PUT: sostituisce l'intero todo, usato per barrare/sbarrare il compito
export function updateTodo(todo) {
  return request(`/${todo.id}`, {
    method: "PUT",
    body: JSON.stringify(todo),
  });
}

// DELETE: elimina il todo dato il suo id
export function deleteTodo(id) {
  return request(`/${id}`, { method: "DELETE" });
}
