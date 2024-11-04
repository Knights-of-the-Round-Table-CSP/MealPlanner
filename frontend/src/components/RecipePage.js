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
    
    recipeApi.changeRecipeDetalization(recipe.id)
      .then(response => setRecipe(response.data))
      .catch(error => console.log("Error on changing recipe detalization: ", error))
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
