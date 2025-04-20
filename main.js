// main.js

import { supabaseUrl, supabaseAnonKey } from './api/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  // Variables
  const logoutBtn = document.getElementById('logout-btn');
  const userEmail = document.getElementById('user-email');
  const userAvatar = document.getElementById('user-avatar');
  const notesContainer = document.getElementById('notes-container');
  const noNotesMsg = document.getElementById('no-notes-msg');
  const addNoteBtn = document.getElementById('add-note-btn');
  const notePopup = document.getElementById('note-popup');
  const closePopup = document.getElementById('close-popup');
  const noteTitleInput = document.getElementById('note-title-input');
  const noteContentInput = document.getElementById('note-content-input');
  const saveNoteBtn = document.getElementById('save-note-btn');
  const fullNoteModal = document.getElementById('full-note-modal');
  const closeFullModal = document.getElementById('close-full-modal');
  const fullNoteTitle = document.getElementById('full-note-title');
  const fullNoteContent = document.getElementById('full-note-content');
  const fullNoteTime = document.getElementById('full-note-time');
  const editNoteBtn = document.getElementById('edit-note-btn');
  const deleteNoteBtn = document.getElementById('delete-note-btn');
  let notes = [];

  // Initialize Supabase client
  const { createClient } = supabase;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch user info
  async function loadUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      alert("Not logged in. Redirecting to login...");
      window.location.href = "login.html";
      return;
    }

    const email = data.user.email;
    userEmail.textContent = email;

    // Gravatar URL from email
    const emailHash = md5(email.trim().toLowerCase());
    const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
    userAvatar.src = avatarUrl;

    // Fetch notes after user info
    fetchNotes(data.user.id);
  }

  // Logout functionality
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      window.location.href = "login.html";
    }
  });

  // Fetch notes from Supabase
  async function fetchNotes(userId) {
    const { data, error } = await supabase
      .from('notes')  // Assuming your notes table is named 'notes'
      .select('*')
      .eq('user_id', userId);

    if (error) {
      alert(`Error fetching notes: ${error.message}`);
      return;
    }

    notes = data || [];
    displayNotes();
  }

  // Display notes
  function displayNotes() {
    notesContainer.innerHTML = '';
    if (notes.length === 0) {
      noNotesMsg.style.display = 'block';
    } else {
      noNotesMsg.style.display = 'none';
      notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerText = note.title;
        div.onclick = () => openNoteModal(note);
        notesContainer.appendChild(div);
      });
    }
  }

  // Open full note modal
  function openNoteModal(note) {
    fullNoteTitle.innerText = note.title;
    fullNoteContent.innerText = note.content;
    const date = new Date(note.created_at || Date.now());
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    fullNoteTime.innerText = `Created: ${formattedDate}`;

    fullNoteModal.style.display = 'flex';
    editNoteBtn.onclick = () => editNote(note.id);
    deleteNoteBtn.onclick = () => deleteNote(note.id);
  }

  // Edit note
  function editNote(id) {
    const note = notes.find(n => n.id === id);
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    notePopup.style.display = 'flex';
    notePopup.dataset.editing = id;
    fullNoteModal.style.display = 'none';
  }

  // Delete note
  async function deleteNote(id) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    notes = notes.filter(n => n.id !== id);
    displayNotes();
    fullNoteModal.style.display = 'none';
  }

  // Save note (insert or update)
  saveNoteBtn.addEventListener('click', async () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const editingId = notePopup.dataset.editing;

    if (!title || !content) return alert('Please provide both title and content.');

    if (editingId) {
      // Update existing note
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', editingId);

      if (error) {
        alert(`Error saving note: ${error.message}`);
        return;
      }
    } else {
      // Insert new note
      const { error } = await supabase
        .from('notes')
        .insert([{ title, content, user_id: data.user.id }]);

      if (error) {
        alert(`Error saving note: ${error.message}`);
        return;
      }
    }

    notePopup.style.display = 'none';
    fetchNotes(data.user.id);
  });

  // Close modals
  closePopup.addEventListener('click', () => {
    notePopup.style.display = 'none';
  });

  closeFullModal.addEventListener('click', () => {
    fullNoteModal.style.display = 'none';
  });

  // Load user and notes on page load
  loadUser();

  // MD5 hash function using CryptoJS
  function md5(string) {
    return CryptoJS.MD5(string).toString();
  }
});
