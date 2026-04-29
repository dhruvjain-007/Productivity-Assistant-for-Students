import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { noteService } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Wand2, Heart } from 'lucide-react';

const Notes = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    category: 'personal-notes',
  });

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await noteService.getNotes();
      setNotes(data || []);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await noteService.createNote(newNote);
      setNewNote({
        title: '',
        content: '',
        subject: '',
        category: 'personal-notes',
      });
      setShowForm(false);
      fetchNotes();
      toast.success('Note created successfully');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await noteService.deleteNote(noteId);
      fetchNotes();
      setSelectedNote(null);
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleSummarize = async (noteId) => {
    try {
      await noteService.summarizeNote(noteId, 'balanced');
      toast.success('Note summarized!');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to summarize note');
    }
  };

  const handleToggleFavorite = async (noteId) => {
    try {
      await noteService.toggleFavorite(noteId);
      fetchNotes();
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Study Notes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Create Note Form */}
      {showForm && (
        <form
          onSubmit={handleCreateNote}
          className="bg-white rounded-lg shadow p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Note title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={newNote.subject}
                onChange={(e) =>
                  setNewNote({ ...newNote, subject: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newNote.category}
                onChange={(e) =>
                  setNewNote({ ...newNote, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="lecture">Lecture</option>
                <option value="textbook">Textbook</option>
                <option value="personal-notes">Personal Notes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              required
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your note content..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Note
          </button>
        </form>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No notes yet. Create your first note!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex-1">{note.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(note._id);
                  }}
                  className={`${
                    note.isFavorited ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={note.isFavorited ? 'currentColor' : 'none'} />
                </button>
              </div>

              <p className="text-sm text-gray-500">{note.subject}</p>
              <p className="text-sm text-gray-600 line-clamp-3 mt-2">{note.content}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSummarize(note._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 bg-indigo-100 text-indigo-600 py-2 rounded hover:bg-indigo-200 text-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  Summarize
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note._id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedNote.title}</h2>
                  <p className="text-sm text-gray-500">{selectedNote.subject}</p>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedNote.content}</p>
              </div>

              {selectedNote.summary && (
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-indigo-900 mb-2">AI Summary</h3>
                  <div className="text-sm text-indigo-800 space-y-2">
                    <p><strong>Summary:</strong> {selectedNote.summary.summary}</p>
                    <p><strong>Key Points:</strong> {selectedNote.summary.keyPoints?.join(', ')}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedNote(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
