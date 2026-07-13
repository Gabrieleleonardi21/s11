import { Card, Form } from "react-bootstrap";
import DeleteButton from "./DeleteButton";

// Data in formato leggibile italiano (es. "13 lug 2026")
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TodoCard({ todo, onToggle, onDelete }) {
  // Classe extra solo se completato: attenua la card e barra il testo (vedi App.css)
  const classes = ["todo-card", "h-100"];
  if (todo.completed) classes.push("todo-card--done");

  return (
    <Card className={classes.join(" ")}>
      <Card.Body className="d-flex align-items-center gap-3">
        {/* Checkbox: fa da "barra se fatto" e scatena la PUT verso l'API */}
        <Form.Check
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          aria-label={`Segna "${todo.text}" come completato`}
        />

        <div className="flex-grow-1">
          <Card.Title as="h2" className="todo-card__text h6 mb-1">
            {todo.text}
          </Card.Title>
          <Card.Subtitle className="text-muted small fw-normal">
            Creato il {formatDate(todo.createdAt)}
          </Card.Subtitle>
        </div>

        <DeleteButton onDelete={() => onDelete(todo.id)} label={todo.text} />
      </Card.Body>
    </Card>
  );
}

export default TodoCard;
