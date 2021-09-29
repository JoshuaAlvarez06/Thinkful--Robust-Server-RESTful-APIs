const express = require("express");
const app = express();

app.use(express.json());

const notes = require("./data/notes-data");

app.get("/notes/:noteId", (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote) {
    res.json({ data: foundNote });
  } else {
    next(`Note id not found: ${req.params.noteId}`);
  }
  
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

// TODO: Add ability to create a new note
app.post("/notes", (req, res, next) => {
  const {data: { text } = {} } = req.body;
  if (text) {
    const newNote = {
      id: ++lastNoteId,
      text,
    }
    notes.push(newNote);
    res.status(201).json({ data: newNote });
  } else {
    res.sendStatus(400);
  }
})

// TODO: add not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
})

// TODO: Add error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send(err);
})

module.exports = app;
