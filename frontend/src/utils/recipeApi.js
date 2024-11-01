import axiosInstance from './axiosInstance';

class RecipeApiService {
  constructor() {
    this.api = axiosInstance;
  }

  listUserRecipes() {
    return this.api.get(`api/recipes`);
  }
}

// Export an instance of the RecipeApiService class
const recipeApi = new RecipeApiService();
export default recipeApi;
