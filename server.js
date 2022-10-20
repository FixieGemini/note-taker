// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const uuid  = require('uuid');

// Port
const PORT = process.env.PORT || 3001;

// Express set up and data parsing required for API calls
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Access to public directory middleware
app.use(express.static('public'));

// Notes html path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Get request for api notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request for apinotes recieved`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Function to write data to JSON file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// Function to read data from a file and append content
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
};

// POST request to add a note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request to add note recieved ${req.body}`);
  
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuid.v4(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(newNote);
      console.log(`Note added successfully 🚀`)
    } else {
      res.error('Error in adding note');
    }
  });

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request to delete note recieved ${req.body}`);

  //const { title, text } = req.body;
  
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'note not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });

// Wildcard route to direct users to index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

//app listens at specified port above
app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);