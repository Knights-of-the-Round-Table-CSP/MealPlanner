import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import answersApiService from '../utils/answerApi';
import '../static/qa.css';
import aiApiService from '../utils/aiApi';

const PromptPage = () => {
  const { userId } = useParams();
  const [userAnswers, setUserAnswers] = useState([]);
  const [formInput, setFormInput] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user-specific answers from the backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    answersApiService.listUserAnswers()
      .then(response => {
        if (response.data) {
          console.log('Fetched user answers:', response.data); // Log the user answers

          // Transform userEntries to have only userId and answers
          const transformedEntries = response.data.reduce((acc, item) => {
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
        }
        setLoading(false);
      })
      .catch(error => {
          console.error('Error fetching user answers:', error.response ? error.response.data : error.message);
          setLoading(false);
      })
  }, [userId]);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      message: formInput
    };

    aiApiService.generateResponse(payload)
      .then(resp => {
        if (resp.data.response){
          //let {response} = JSON.parse(resp.data);
          setOutputData(resp.data.response)
        }
        else {
          setError('Failed to fetch response');
        }
      })
      .catch(error => {
        setError(error.response ? error.response.data.message : error.message);
      })
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

      <h2>Output Data:</h2>
      <ul>
        {outputData.length > 0 ? (
          outputData.map((output, index) => (
            <li key={index}>
              {output}
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
