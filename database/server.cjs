const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cors = require('cors')
const admin = require('firebase-admin');
const serviceAccount = require('../src/firebase-adminsdk.json'); 
const bcrypt = require('bcrypt');



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'recipe-blog-ae8f6.appspot.com' // Replace with your Firebase storage bucket
});

const bucket = admin.storage().bucket();

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '1234', 
  database: 'vueproj1',
  port: 3300
})

db.connect((err) => {
  if (err) throw err
  console.log('Connected to MySQL Database')
})

app.get('/users', (req, res) => {
  const { username } = req.query
  if (username) {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) throw err
      res.json(results)
    })
  } else {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) throw err
      console.log(results)
      res.json(results)
    })
  }
})

app.post('/users', async (req, res) => {
  const { username, password, email, dob } = req.body;

  try {
    // Check if the username is already taken
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error checking username:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already taken. Please choose a different username.' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Store the user with the hashed password
      db.query(
        'INSERT INTO users (username, password, email, dob) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, dob],
        (err, result) => {
          if (err) {
            console.error('Error signing up user:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          // Return the newly created user
          db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err, newUser) => {
            if (err) {
              console.error('Error fetching new user:', err);
              return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(201).json(newUser[0]);
          });
        }
      );
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, email, dob } = req.body;

  try {
    // Hash the new password if it's provided
    let hashedPassword = password;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    db.query(
      'UPDATE users SET username = ?, password = ?, email = ?, dob = ? WHERE id = ?',
      [username, hashedPassword, email, dob, id],
      (err, results) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ id, username, password: hashedPassword, email, dob });
      }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/users/:id', (req, res) => {
  const { id } = req.params
  db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
    if (err) throw err
    res.json({ message: 'User deleted successfully' })
  })
})

// Fetch recipes for a specific user
app.get('/recipes/:recipeId', (req, res) => {
  const { recipeId }= req.params
  db.query('SELECT * FROM recipes where id = ?', [recipeId], (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err)
      return res.status(500).json({ error: 'Failed to fetch recipes.' })
    }
    console.log('Fetched recipes:', results)
    res.json(results)
  })
})

app.get('/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err)
      return res.status(500).json({ error: 'Failed to fetch recipes.' })
    }
    console.log('Fetched recipes:', results)
    res.json(results)
  })
})

// Post a new recipe
app.post('/recipes', async (req, res) => {
  const { title, pictureUrl, cookingTime, ingredients, description, userId } = req.body;
  let imageUrl = '';

  if (pictureUrl) {
    try {
      const file = bucket.file(`recipes/${Date.now()}_${pictureUrl.name}`);
      await file.save(pictureUrl.buffer, {
        contentType: pictureUrl.mimetype,
        public: true,
        metadata: {
          firebaseStorageDownloadTokens: Date.now()
        }
      });
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
    } catch (err) {
      console.error('Error uploading to Firebase:', err);
      return res.status(500).json({ error: 'Failed to upload image.' });
    }
  }

  const query = 'INSERT INTO recipes (title, pictureUrl, cookingTime, ingredients, description, userId) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, imageUrl, cookingTime, ingredients, description, userId], (err, results) => {
    if (err) {
      console.error('Error posting recipe:', err);
      return res.status(500).json({ error: 'Failed to post recipe.' });
    }
    res.json({ id: results.insertId, title, pictureUrl: imageUrl, cookingTime, ingredients, description, userId });
  });
});


// Update a recipe
app.put('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, pictureUrl, cookingTime, ingredients, description, userId } = req.body;

  const query = `
    UPDATE recipes 
    SET title = ?, pictureUrl = ?, cookingTime = ?, ingredients = ?, description = ?, userId = ?
    WHERE id = ?
  `;

  db.query(query, [title, pictureUrl, cookingTime, ingredients, description, userId, id], (err, results) => {
    if (err) {
      console.error('Error updating recipe:', err);
      return res.status(500).json({ error: 'Error updating recipe' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ id, title, pictureUrl, cookingTime, ingredients, description, userId });
  });
});


// Delete a recipe
app.delete('/recipes/:id', (req, res) => {
  const recipeId = req.params.id;

  const query = 'DELETE FROM recipes WHERE id = ?';

  db.query(query, [recipeId], (err, result) => {
    if (err) {
      console.error('Error deleting recipe:', err);
      return res.status(500).json({ error: 'Error deleting recipe' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})