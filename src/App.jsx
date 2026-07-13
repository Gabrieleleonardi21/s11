import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import MatrixBackground from "./components/MatrixBackground";
import NavBar from "./components/NavBar";
import TodoCard from "./components/TodoCard";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todos";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET: carica la lista al primo render
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // POST: crea il todo e lo accoda alla lista con l'id restituito dal server
  async function handleAdd(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    try {
      const created = await createTodo(value);
      setTodos((prev) => [...prev, created]);
      setText("");
    } catch (err) {
      setError(err.message);
    }
  }

  // PUT: inverte "completed" e rimpiazza il todo aggiornato nella lista
  async function handleToggle(todo) {
    try {
      const updated = await updateTodo({ ...todo, completed: !todo.completed });
      setTodos((prev) =>
        prev.map((t) => {
          if (t.id === updated.id) return updated;
          return t;
        })
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // DELETE: elimina sul server e solo dopo aggiorna lo stato locale
  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const daFare = todos.filter((t) => !t.completed).length;

  return (
    <>
      {/* Sfondo animato: sta dietro a tutto, il contenuto resta scorrevole */}
      <MatrixBackground />

      <NavBar />

      <Container className="py-4">
        <h1 className="h3 mb-3">I miei compiti</h1>

        {/* Form di inserimento: scatena la POST */}
        <Form onSubmit={handleAdd} className="d-flex gap-2 mb-4">
          <Form.Control
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Aggiungi un compito..."
            aria-label="Testo del nuovo compito"
          />
          <Button type="submit" variant="primary">
            Aggiungi
          </Button>
        </Form>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading && <Spinner animation="border" variant="light" />}

        {!loading && todos.length === 0 && (
          <p className="text-secondary">Nessun compito. Aggiungine uno qui sopra.</p>
        )}

        {/* Una card per riga su mobile, fino a 3 colonne su schermi grandi */}
        <Row xs={1} md={2} lg={3} className="g-3">
          {todos.map((todo) => (
            <Col key={todo.id}>
              <TodoCard todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>

        {!loading && todos.length > 0 && (
          <p className="text-secondary small mt-3">
            {daFare} da completare su {todos.length}
          </p>
        )}
      </Container>
    </>
  );
}

export default App;
