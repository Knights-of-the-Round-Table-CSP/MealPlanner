import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../static/qa.css';

const PromptPage = () => {
  const { userId } = useParams();
  const [userAnswers, setUserAnswers] = useState([]);
  const [formInput, setFormInput] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user-specific answers from the backend
  useEffect(() => {
    const fetchUserAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/user-qa/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user answers');

        const data = await response.json();

        // Transform userEntries to have only userId and answers
        const transformedEntries = data.userEntries.reduce((acc, item) => {
          const existingUser = acc.find(entry => entry.userId === item.userId);
          if (existingUser) {
            existingUser.answers.push(item.answer);
          } else {
            acc.push({ userId: item.userId, answers: [item.answer] });
          }
          return acc;
        }, []);
        
        // Set the transformed entries as user answers
        setUserAnswers(transformedEntries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnswers();
  }, [userId]);

  // Fetch output data from prompt_output
  const fetchOutputData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/prompt_output');
      if (!response.ok) throw new Error('Failed to fetch output data');

      const data = await response.json();
      setOutputData(data.recipes || []); // Set output data to the recipes array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get existing answers for the current user
    const currentUserEntry = userAnswers.find(entry => entry.userId === userId);

    // Prepare the payload
    const updatedAnswers = currentUserEntry
      ? [...currentUserEntry.answers, formInput] // Append new answer to existing answers
      : [formInput]; // If no existing answers, create a new array with the form input

    const payload = {
      userId,
      answers: updatedAnswers,
    };

    try {
      const response = await axios.post('http://localhost:5001/api/prompt_input', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 201) {
        throw new Error('Failed to submit data');
      }

      // Update the state with the new answers and clear the input
      setUserAnswers(prevAnswers => {
        const userIndex = prevAnswers.findIndex(entry => entry.userId === userId);
        if (userIndex > -1) {
          // If user already exists, update their answers
          const updatedEntries = [...prevAnswers];
          updatedEntries[userIndex].answers = updatedAnswers;
          return updatedEntries;
        } else {
          // If user doesn't exist, add a new entry
          return [...prevAnswers, { userId, answers: updatedAnswers }];
        }
      });

      // Clear the form input
      setFormInput('');

      // Optionally, fetch output data here after submission if needed
      await fetchOutputData();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  // Handle fetching output data on button click
  const handleShowResults = async () => {
    await fetchOutputData();
  };

  return (
    <div>
      <h1>Welcome to the Prompt Page</h1>
      <h2>Your Answers:</h2>
      <ul>
        {userAnswers.length > 0 ? (
          userAnswers.map((entry, index) => (
            <li key={index}>
              <strong>User ID:</strong> {entry.userId}
              <br />
              <strong>Answers:</strong> {Array.isArray(entry.answers) ? entry.answers.join(', ') : 'No answers available.'}
            </li>
          ))
        ) : (
          <li>No answers available.</li>
        )}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={formInput}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <p></p><p></p><p></p>
      <button onClick={handleShowResults}>Generate Output</button>

      <h2>Output Data:</h2>
      <ul>
        {outputData.length > 0 ? (
          outputData.map((output, index) => (
            <li key={index}>
              <strong>{output.name}</strong>
              <p>Ingredients: {output.ingredients.join(', ')}</p>
              <p>Instructions: {output.instructions.join(' ')}</p>
            </li>
          ))
        ) : (
          <li>No output data available.</li>
        )}
      </ul>
    </div>
  );
};

export default PromptPage;
