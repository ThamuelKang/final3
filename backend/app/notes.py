from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from . import db
from .models import Note

notes_bp = Blueprint("notes", __name__)


@notes_bp.route("", methods=["GET"])
@jwt_required()
def get_notes():
    user_id = int(get_jwt_identity())
    # newest edits show up first
    notes = Note.query.filter_by(user_id=user_id).order_by(Note.updated_at.desc()).all()
    return jsonify([note.to_dict() for note in notes]), 200


@notes_bp.route("", methods=["POST"])
@jwt_required()
def create_note():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    title = data.get("title", "").strip()
    content = data.get("content", "")

    if not title:
        return jsonify({"error": "Title is required"}), 400

    note = Note(title=title, content=content, user_id=user_id)
    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict()), 201


@notes_bp.route("/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.get_or_404(note_id)

    # make sure you can only touch your own notes
    if note.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()
    if "title" in data:
        title = data["title"].strip()
        if not title:
            return jsonify({"error": "Title is required"}), 400
        note.title = title
    if "content" in data:
        note.content = data["content"]

    db.session.commit()
    return jsonify(note.to_dict()), 200


@notes_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.get_or_404(note_id)

    if note.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 200
