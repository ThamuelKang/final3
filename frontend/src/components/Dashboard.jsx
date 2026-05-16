import { useState, useEffect } from "react";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import { API_URL } from "../config";

function Dashboard({ token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`, { headers });
      // token expired or invalid, kick them back to login
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      setNotes(data);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (noteData) => {
    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers,
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error("Failed to create note");
    await fetchNotes();
    setShowForm(false);
  };

  const handleUpdate = async (noteData) => {
    const res = await fetch(`${API_URL}/notes/${editingNote.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error("Failed to update note");
    await fetchNotes();
    setEditingNote(null);
    setShowForm(false);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    const res = await fetch(`${API_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete note");
    await fetchNotes();
  };

  const startEdit = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingNote(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DuckNotes</h1>
        <div className="header-actions">
          <button className="btn-new" onClick={startCreate}>
            + New Note
          </button>
          <button className="btn-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <NoteForm
          note={editingNote}
          onSubmit={editingNote ? handleUpdate : handleCreate}
          onCancel={cancelForm}
        />
      )}

      {loading ? (
        <p className="loading">Loading notes...</p>
      ) : (
        <NoteList notes={notes} onEdit={startEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default Dashboard;
