const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique ID generation

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Load users from JSON file
const loadUsers = () => {
  if (fs.existsSync('users.json')) {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
  }
  return [];
};

// Save users to JSON file
const saveUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Sign up route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  console.log('Incoming email:', email); // Log the incoming email

  // Check if user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Email already registered!' });
  }

  // Add new user with a unique ID
  const newUser = { id: uuidv4(), email, password }; // Assign unique ID
  console.log('New user created:', newUser); // Log the new user
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: 'Signup Successful!' });
});


// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  // Check for existing user
  const user = users.find((user) => user.email === email && user.password === password);
  if (user) {
    // Return the unique ID upon successful login
    return res.status(200).json({ message: 'Login Successful!', uniqueId: user.id });
  }
  res.status(401).json({ message: 'Invalid Credentials' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
