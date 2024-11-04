import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import answersApiService from '../utils/answerApi';
import aiApiService from '../utils/aiApi';
import '../static/gridView.css';
import recipeApi from '../utils/recipeApi';

const PromptPage = () => {
  const { userId } = useParams();
  console.log(userId,"from prompt")
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState([]);
  const [formInput, setFormInput] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);

  useEffect(() => {
    console.log(lunchData);
  }, [lunchData])

  // Fetch data from allRecipes.json
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        // const allRecipes = await fetch('/demoFiles/allRecipe.json').then(res => res.json());
        const allRecipes = (await recipeApi.listUserRecipes()).data;
        
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
  const handleDelete = async (recipeId, type) => {
    console.log(`Deleting recipe with ID: ${recipeId}`);

    try {
      switch (type) {
        case "breakfast":
          let breakfast = (await recipeApi.generateNewRecipe(type)).data;
          await recipeApi.deleteRecipe(recipeId);
          setBreakfastData(prevData => [
            ...prevData.filter(recipe => recipe.id !== recipeId),
            breakfast
          ])
          break;
        case "dinner":
          let dinner = (await recipeApi.generateNewRecipe(type)).data;
          await recipeApi.deleteRecipe(recipeId);
          setDinnerData(prevData => [
            ...prevData.filter(recipe => recipe.id !== recipeId),
            dinner
          ])
          break;
        case "lunch":
          let lunch = (await recipeApi.generateNewRecipe(type)).data;
          await recipeApi.deleteRecipe(recipeId);
          setLunchData(prevData => [
            ...prevData.filter(recipe => recipe.id !== recipeId),
            lunch
          ])
          break;
        default:
          setError("Unknown recipe type " + type);
          break;
      }

    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  // Function to render recipe items
  const renderRecipeItem = (recipe, type) => (
    <div key={recipe.id} className="grid-item">
      <h3>{recipe.name}</h3>
      <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
      <div className="recipe-buttons">
        <button style={{ gap: '10px' }} onClick={() => handleExpand(recipe.id)}>Expand</button>
        <button style={{ gap: '10px' }} onClick={() => handleDelete(recipe.id, type)}>Delete</button>
      </div>
    </div>
  );

  // Handle recipe detail navigation
  const handleExpand = (recipeId) => {
    navigate(`/recipe/${recipeId}`); // Assuming your route is set up to handle this
  };

  const myfunction = async (recipeName) => {
    try {
        let newRecipe;

        switch (recipeName) {
            case "breakfast":
                newRecipe = (await recipeApi.generateNewRecipe("breakfast")).data;
                setBreakfastData(prevData => [...prevData, newRecipe]); // Append the new recipe
                break;

            case "lunch":
                newRecipe = (await recipeApi.generateNewRecipe("lunch")).data;
                setLunchData(prevData => [...prevData, newRecipe]); // Append the new recipe
                break;

            case "dinner":
                newRecipe = (await recipeApi.generateNewRecipe("dinner")).data;
                setDinnerData(prevData => [...prevData, newRecipe]); // Append the new recipe
                break;

            default:
                setError("Unknown recipe type: " + recipeName);
                break;
        }
    } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
    }
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
    <div className="grid-row-header">  {/* Added this wrapper for Flexbox */}
      <h2 className="grid-row-title">Breakfast</h2> <br></br><br></br>
    </div>
    <div className="grid-row">
      {breakfastData.length > 0 ? breakfastData.map(b => renderRecipeItem(b, "breakfast")) : <p>No data available</p>}
    </div>
      <br></br>
      <div className = "recipe-request">
      <h3>Want a breakfast recipe?</h3>
      <button className="grid-row-button" onClick={() => myfunction("breakfast")}>Click here!</button>
      </div>
  </div>

        <div>
          <h2 className="grid-row-title">Lunch</h2>
          <div className="grid-row">
            {lunchData.length > 0 ? lunchData.map(b => renderRecipeItem(b, "lunch")) : <p>No data available</p>}
          </div>
          <br></br>
      <div className = "recipe-request">
      <h3>Want a lunch recipe?</h3>
      <button className="grid-row-button" onClick={() => myfunction("lunch")}>Click here!</button>
      </div>
        </div>

        <div>
          <h2 className="grid-row-title">Dinner</h2>
          <div className="grid-row">
            {dinnerData.length > 0 ? dinnerData.map(b => renderRecipeItem(b, "dinner"))  : <p>No data available</p>}
          </div>
          <br></br>
      <div className = "recipe-request">
      <h3>Want a dinner recipe?</h3>
      <button className="grid-row-button" onClick={() => myfunction("dinner")}>Click here!</button>
      </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default PromptPage;
