import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignUpForm';
import QApage from './components/QA';
import { UserProvider } from './context/UserContext'; // Import your UserProvider
import PromptPage from './components/PromptPage';

function App() {
  return (
    <UserProvider> {/* Wrap Routes with UserProvider */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm onLoginSuccess={() => console.log('Logged in successfully')} />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/qa/:id" element={<QApage />} /> {/* Ensure this matches navigate('/qa') */}
        <Route path="/prompt/:userId" element={<PromptPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
