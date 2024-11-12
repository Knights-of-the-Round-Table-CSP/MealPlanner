import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignUpForm';
import QApage from './components/QA';
import { UserProvider } from './context/UserContext'; // Import your UserProvider
import PromptPage from './components/PromptPage';
import RecipePage from './components/RecipePage';
import NavBar from './components/NavBar';
import UserProfile from './components/UserProfilePage';
import Footer from './components/Footer';
import RecipeGenerator from './components/RecipeGenerator';
import AboutPage from './components/about';

import './App.css'

function App() {
  return (
    <UserProvider> {/* Wrap Routes with UserProvider */}
      <NavBar /> {/* Place NavBar at the top, outside of Routes */}
      <Footer /> {/* Add Footer here */}
      <div className='main'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={() => console.log('Logged in successfully')} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/qa/:id" element={<QApage />} />
          <Route path="/prompt/:userId" element={<PromptPage />} />
          <Route path="/recipe/:recipeId" element={<RecipePage />} />
          <Route path="/userProfile/:userId" element={<UserProfile />} /> {/* User profile with dynamic ID */}
          <Route path="/newRecipe/:type" element={<RecipeGenerator />} />
          <Route path="/about" element={<AboutPage />} />
          
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
