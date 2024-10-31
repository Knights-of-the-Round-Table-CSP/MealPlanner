import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import answersApiService from '../utils/answerApi';
import aiApiService from '../utils/aiApi';
import '../static/gridView.css';

const PromptPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState([]);
  const [formInput, setFormInput] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);

  // Fetch data from allRecipes.json
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const allRecipes = await fetch('/demoFiles/allRecipe.json').then(res => res.json());

        // Categorize recipes into breakfast, lunch, and dinner
        const breakfast = allRecipes.filter(recipe => recipe.isBreakfast);
        const lunch = allRecipes.filter(recipe => recipe.isLunch);
        const dinner = allRecipes.filter(recipe => recipe.isDinner);

        setBreakfastData(breakfast);
        setLunchData(lunch);
        setDinnerData(dinner);
      } catch (error) {
        console.error('Error fetching meal data:', error);
        setError("Unable to load meal data.");
      }
    };

    fetchMealData();
  }, []);

  // Fetch user-specific answers from the backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    answersApiService.listUserAnswers()
      .then(response => {
        if (response.data) {
          console.log('Fetched user answers:', response.data);

          const transformedEntries = response.data.reduce((acc, item) => {
            const existingUser = acc.find(entry => entry.userId === item.userId);
            if (existingUser) {
              existingUser.answers.push(item.answer);
            } else {
              acc.push({ userId: item.userId, answers: [item.answer] });
            }
            return acc;
          }, []);
          
          setUserAnswers(transformedEntries);
        }
        setLoading(false);
      })
      .catch(error => {
          console.error('Error fetching user answers:', error.response ? error.response.data : error.message);
          setLoading(false);
      });
  }, [userId]);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userAnswersArray = userAnswers.reduce((acc, entry) => {
        if (entry.userId === userId) {
            return [...acc, ...entry.answers];
        }
        return acc;
    }, []);

    const payload = {
        message: formInput,
        userAnswers: userAnswersArray
    };

    console.log(payload)

    try {
        const response = await aiApiService.generateResponse(payload);
        if (response.data.response) {
            setOutputData(response.data.response);
        } else {
            setError('Failed to fetch response');
        }
    } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
    }
  };

  // Function to handle recipe deletion
  const handleDelete = async (recipeId) => {
    console.log(`Deleting recipe with ID: ${recipeId}`);
    
    // Prepare user answers for API call
    // will delete from DB
    const userAnswersArray = userAnswers.reduce((acc, entry) => {
      if (entry.userId === userId) {
          return [...acc, ...entry.answers];
      }
      return acc;
    }, []);

    // Send LLM request with null prompt and user answers
    const payload = {
      message: 'sorry',
      userAnswers: userAnswersArray
    };

    console.log(payload)

    try {
      const response = await aiApiService.generateResponse(payload);
      console.log('LLM Response after deletion:', response.data);
      
      // Optionally handle the response here if needed
      if (response.data.response) {
        // Update the outputData or handle the response as required
        setOutputData(prev => [...prev, response.data.response]); // Append the response to outputData
      }

    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }

    // Update the UI to remove the deleted recipe
    setBreakfastData(breakfastData.filter(recipe => recipe.id !== recipeId));
    setLunchData(lunchData.filter(recipe => recipe.id !== recipeId));
    setDinnerData(dinnerData.filter(recipe => recipe.id !== recipeId));
  };

  // Function to render recipe items
  const renderRecipeItem = (recipe) => (
    <div key={recipe.id} className="grid-item">
      <h3>{recipe.recipeName}</h3>
      <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
      <div className="recipe-buttons">
        <button style={{ gap: '10px' }} onClick={() => handleExpand(recipe.id)}>Expand</button>
        <button style={{ gap: '10px' }} onClick={() => handleDelete(recipe.id)}>Delete</button>
      </div>
    </div>
  );

  // Handle recipe detail navigation
  const handleExpand = (recipeId) => {
    navigate(`/recipe/${recipeId}`); // Assuming your route is set up to handle this
  };

  
return (
  <div className="prompt-page-container">
    <div className="prompt_qa-container">
      <h1>Welcome to the Prompt Page</h1>

      {/* Q&A Section */}
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

      {/* Output Data */}
      <h2>Output Data:</h2>
      <ul>
        {outputData.length > 0 ? (
          outputData.map((output, index) => (
            <li key={index}>{output}</li>
          ))
        ) : (
          <li>No output data available.</li>
        )}
      </ul>

      {/* Grid View Section */}
      <h2>Your Recipes:</h2>
      <div className="grid-container">
        <div>
          <h2 className="grid-row-title">Breakfast</h2>
          <div className="grid-row">
            {breakfastData.length > 0 ? breakfastData.map(renderRecipeItem) : <p>No data available</p>}
          </div>
        </div>

        <div>
          <h2 className="grid-row-title">Lunch</h2>
          <div className="grid-row">
            {lunchData.length > 0 ? lunchData.map(renderRecipeItem) : <p>No data available</p>}
          </div>
        </div>

        <div>
          <h2 className="grid-row-title">Dinner</h2>
          <div className="grid-row">
            {dinnerData.length > 0 ? dinnerData.map(renderRecipeItem) : <p>No data available</p>}
          </div>
        </div>
      </div>

      {/* Link to Next Page */}
      <div className="next-page-link">
        <a href="/next">Next Page</a>
      </div>
    </div>
  </div>
);

};

export default PromptPage;
