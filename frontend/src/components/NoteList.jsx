function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <div className="note-content" onClick={() => onEdit(note)}>
            <h3>{note.title}</h3>
            <p>{note.content.length > 150 ? note.content.slice(0, 150) + "..." : note.content}</p>
            <span className="note-date">
              {new Date(note.updated_at).toLocaleDateString()}
            </span>
          </div>
          <button
            className="btn-delete"
            onClick={() => onDelete(note.id)}
            title="Delete note"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
