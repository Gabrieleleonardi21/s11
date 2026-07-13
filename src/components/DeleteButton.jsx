import { Button } from "react-bootstrap";

// Bottone di eliminazione riutilizzabile: riceve solo l'azione da eseguire.
// "label" serve a costruire un'etichetta accessibile diversa per ogni card.
function DeleteButton({ onDelete, label = "elemento" }) {
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={onDelete}
      aria-label={`Elimina ${label}`}
    >
      Elimina
    </Button>
  );
}

export default DeleteButton;
