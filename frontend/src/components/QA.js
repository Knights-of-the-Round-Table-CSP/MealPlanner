import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../static/qa.css';

const QAPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { id } = useParams(); // User ID from the URL
    const [questions, setQuestions] = useState([]); // State to hold questions
    const [userAnswers, setUserAnswers] = useState([]); // State to hold user's answers
    const [newAnswers, setNewAnswers] = useState({}); // State to hold new answers for each question
    const [selectedQuestionId, setSelectedQuestionId] = useState(null); // Track which question is being answered

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/common-qa');
                console.log('Fetched response data:', response.data); // Log the entire response data
                const questionsArray = response.data;
                if (Array.isArray(questionsArray)) {
                    setQuestions(questionsArray); // Set questions if it's an array
                } else {
                    console.error('Expected an array but got:', response.data.commonQuestions);
                    setQuestions([]); // Reset to empty array if it's not an array
                }
            } catch (error) {
                console.error('Error fetching common questions:', error.response ? error.response.data : error.message);
            }

            try {
                const userAnswersResponse = await axios.get(`http://localhost:5001/api/user-qa/${id}`);
                console.log('Fetched user answers:', userAnswersResponse.data); // Log the user answers
                setUserAnswers(userAnswersResponse.data.userEntries || []); // Ensure userAnswers is an array
            } catch (error) {
                console.error('Error fetching user answers:', error.response ? error.response.data : error.message);
            }
        };

        fetchQuestions();
    }, [id]);

    const handleGoToPrompt = () => {
        navigate(`/prompt/${id}`); // Navigate to the prompt page with the unique ID
    };

    const handleSubmit = async (e, questionId) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (questionId && newAnswers[questionId]) {
            try {
                // Post the new answer to the server
                const response = await axios.post(`http://localhost:5001/api/user-qa`, { 
                    userId: id,
                    questionId: questionId,
                    answer: newAnswers[questionId] // Use the answer for the specific question
                });
                console.log('Response from POST:', response.data); // Log the response from POST
                // Update local state with the new answer
                setUserAnswers(prev => [...prev, { userId: id, questionId, answer: newAnswers[questionId] }]);
                setNewAnswers(prev => ({ ...prev, [questionId]: '' })); // Clear the specific answer field
                setSelectedQuestionId(null); // Reset selected question
            } catch (error) {
                console.error('Error submitting answer:', error.response ? error.response.data : error.message);
            }
        }
    };

    // Filter unanswered questions by checking user answers
    const unansweredQuestions = questions.filter(question => 
        !userAnswers.some(answer => answer.questionId === question.id && answer.userId === id)
    );

    return (
        <div>
            <h1>Q&A Page for User {id}</h1>
            {unansweredQuestions.length > 0 ? (
                <div>
                    <h2>Unanswered Questions:</h2>
                    <ul>
                        {unansweredQuestions.map((question) => (
                            <li key={question.id}>
                                {question.question}
                                <form onSubmit={(e) => handleSubmit(e, question.id)}>
                                    <input
                                        type="text"
                                        value={newAnswers[question.id] || ''} // Control the input value based on the question ID
                                        onChange={(e) => {
                                            setNewAnswers(prev => ({ ...prev, [question.id]: e.target.value })); // Update the specific answer
                                            setSelectedQuestionId(question.id); // Set selected question ID
                                        }}
                                        placeholder="Type your answer here"
                                    />
                                    <button type="submit">Submit Answer</button>
                                </form>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h2>All Questions (Answered):</h2>
                    <ul>
                        {questions.map((question) => {
                            const userAnswer = userAnswers.find(answer => answer.questionId === question.id && answer.userId === id);
                            return (
                                <li key={question.id}>
                                    {question.question}
                                    {userAnswer && <p>Answer: {userAnswer.answer}</p>} {/* Display user's answer if it exists */}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
              <div>
            {/* Other component content */}
            <button onClick={handleGoToPrompt}>Go to Prompt Page</button>
        </div>
        </div>
    );
};

export default QAPage;
