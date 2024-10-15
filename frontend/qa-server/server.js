const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// File paths for common questions and user answers
const commonQuestionsFilePath = path.join(__dirname, 'common_questions.json');
const userAnswersFilePath = path.join(__dirname, 'user_answers.json');

// Load common questions from JSON file
let commonData = { commonQuestions: [] };
if (fs.existsSync(commonQuestionsFilePath)) {
    const jsonData = fs.readFileSync(commonQuestionsFilePath, 'utf8');
    try {
        commonData = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error parsing common questions JSON:', error);
    }
} else {
    console.warn('common_questions.json file not found.');
}

// Load user-specific answers from JSON file
let userData = { userEntries: [] };
if (fs.existsSync(userAnswersFilePath)) {
    const jsonData = fs.readFileSync(userAnswersFilePath, 'utf8');
    try {
        userData = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error parsing user answers JSON:', error);
    }
} else {
    console.warn('user_answers.json file not found.');
}

// Get all common questions
app.get('/api/common-qa', (req, res) => {
    res.json(commonData.commonQuestions);
});

// Get user-specific answers based on userId
app.get('/api/user-qa/:userId', (req, res) => {
    const userId = req.params.userId;

    try {
        // Retrieve user-specific entries
        const userAnswers = userData.userEntries.filter(entry => entry.userId === userId);
        res.json({ userEntries: userAnswers });
    } catch (error) {
        console.error('Error retrieving user answers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST a new answer
app.post('/api/user-qa', (req, res) => {
    const { userId, questionId, answer } = req.body;

    // Validate input
    if (!userId || !questionId || answer === undefined) {
        return res.status(400).json({ message: 'All fields are required (userId, questionId, answer).' });
    }

    try {
        // Check if the user already answered this question
        const existingEntry = userData.userEntries.find(entry => entry.userId === userId && entry.questionId === questionId);
        if (existingEntry) {
            return res.status(400).json({ message: 'This question has already been answered by the user.' });
        }

        // Create a new user entry
        const newUserEntry = {
            userId,
            questionId,
            answer,
        };

        // Add the new entry to the user entries
        userData.userEntries.push(newUserEntry);

        // Save the updated user entries to the JSON file
        fs.writeFileSync(userAnswersFilePath, JSON.stringify(userData, null, 2));

        return res.json({ message: 'Answer added successfully!', entry: newUserEntry });
    } catch (error) {
        console.error('Error adding user answer:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//////////////////////////////////////////////////////////

const prompt_inputPath = path.join(__dirname, 'prompt_input.json');
const prompt_outputPath = path.join(__dirname, 'prompt_output.json');

// POST method to handle input data
app.post('/api/prompt_input', (req, res) => {
    const { userId, answers } = req.body;
  
    // Validate input
    if (!userId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'userId is required and answers must be an array' });
    }
  
    // Read existing data
    fs.readFile(prompt_inputPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Parse existing data or initialize an empty array
      let jsonData;
      try {
        jsonData = data ? JSON.parse(data) : [];
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Check if the user already exists in the JSON
      const existingUserEntry = jsonData.find(entry => entry.userId === userId);
  
      if (existingUserEntry) {
        // If the user exists, append the new answers to their existing answers
        existingUserEntry.answers = [...existingUserEntry.answers, ...answers];
      } else {
        // Create a new entry for the user
        const newEntry = {
          userId,
          answers,
        };
        jsonData.push(newEntry);
      }
  
      // Write updated data back to the file
      fs.writeFile(prompt_inputPath, JSON.stringify(jsonData, null, 2), (writeError) => {
        if (writeError) {
          console.error('Error writing file:', writeError);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        // Respond with the updated data
        res.status(201).json(jsonData);
      });
    });
  });
  
  app.get('/api/prompt_output', (req, res) => {
    // Read the output data from prompt_output.json
    fs.readFile(prompt_outputPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading output file:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Parse the JSON data
      let recipes;
      try {
        recipes = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing output JSON data:', parseError);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Respond with the recipes data
      res.status(200).json(recipes);
    });
  });
  

///////////////////////////////////////

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
