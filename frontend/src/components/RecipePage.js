import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import aiApiService from '../utils/aiApi'; // Assuming you have an API service for LLM
import '../static/recipePage.css'; // Add your CSS for styling
import recipeApi from '../utils/recipeApi';

const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [llmResponse, setLlmResponse] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecipeData = async () => {
    recipeApi.getRecipe(recipeId)
      .then((response) => {
        setRecipe(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipe:', error.message);
        setError('Error fetching recipe.');
      })
      .finally(() => setLoading(false));
  };

  // Initial load of recipe data
  useEffect(() => {
    fetchRecipeData();
  }, [recipeId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleToggleRecipe = async () => {
    if (!recipe) return;

    setLlmLoading(true);
    setLlmResponse('');

    const prompt = recipe.isLong
      ? `Minimize the recipe: ${recipe.name}. Ingredients: ${recipe.ingredients.join(', ')}. Steps: ${recipe.steps.join(', ')}`
      : `Expand the recipe: ${recipe.name}. Ingredients: ${recipe.ingredients.join(', ')}. Steps: ${recipe.steps.join(', ')}`;

    console.log("Prompt sent to LLM:", prompt);

    try {
      const response = await aiApiService.generateResponse({ message: prompt });
      if (response.data && response.data.response) {
        setLlmResponse(response.data.response);
      } else {
        setLlmResponse('Failed to fetch LLM response.');
      }
      console.log("after receiving LLM response");
      await fetchRecipeData(); // Reload the recipe data on toggle
    } catch (error) {
      console.error('Error fetching LLM response:', error);
      setLlmResponse(error.response ? error.response.data.message : error.message);
    } finally {
      setLlmLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="full-screen">
      <div className="content-container">
        <h1>{recipe.name}</h1>
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h2>Preparation Time</h2>
        <p>{recipe.preparationTime}</p>
        <h2>Steps</h2>
        <ol>
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleToggleRecipe}>
            {recipe.isLong ? 'Minimize' : 'Maximize'}
          </button>
          <button onClick={handleGoBack}>Go Back</button>
        </div>

        {/* Output box for LLM response */}
        {llmLoading && <p>Loading LLM response...</p>}
        {llmResponse && (
          <div className="llm-response">
            <h2>LLM Response:</h2>
            <p>{llmResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
