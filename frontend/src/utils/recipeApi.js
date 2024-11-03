import axiosInstance from './axiosInstance';

class RecipeApiService {
  constructor() {
    this.api = axiosInstance;
  }

  listUserRecipes() {
    return this.api.get(`api/recipes/`);
  }

  getRecipe(id) {
    return this.api.get(`api/recipes/${id}`)
  }

  generateNewRecipe(type) {
    // Generates a recipe, stores it connected to user to database, and returns it here
    return this.api.get(`api/new-recipe/${type}`)
  }

  // Just if you want to create recipes manualy
  createRecipe(type, name, preparation_time, description, ingredients, steps) {
    let request = {
      name: name,
      preparation_time: preparation_time,
      description: description,
      ingredients: ingredients,
      steps: steps
    }

    return this.api.post(`api/new-recipe/${type}`, request)
  }

  deleteRecipe(id) {
    return this.api.delete(`api/recipes/${id}`)
  }
}

// Export an instance of the RecipeApiService class
const recipeApi = new RecipeApiService();
export default recipeApi;
