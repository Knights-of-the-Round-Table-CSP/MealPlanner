import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../static/qa.css';
import questionsApiService from '../utils/questionApi';
import answersApiService from '../utils/answerApi';

const QAPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { id } = useParams(); // User ID from the URL
    const [questions, setQuestions] = useState([]); // State to hold questions
    const [userAnswers, setUserAnswers] = useState([]); // State to hold user's answers
    const [newAnswers, setNewAnswers] = useState({}); // State to hold new answers for each question

    useEffect(() => {
        questionsApiService.list()
            .then(response => {
                if (response.data){
                    console.log('Fetched response data:', response.data); // Log the entire response data
                    const questionsArray = response.data;
                    if (Array.isArray(questionsArray)) {
                        setQuestions(questionsArray); // Set questions if it's an array
                    } else {
                        console.error('Expected an array but got:', response.data.commonQuestions);
                        setQuestions([]); // Reset to empty array if it's not an array
                    }
                }
                else {
                    // handle error
                    console.error('Error fetching common questions.', response);
                }
            })
            .catch(error => {
                // handle error
                console.error('Error fetching common questions:', error.response ? error.response.data : error.message);
            })

        answersApiService.listUserAnswers()
            .then(response => {
                if (response.data) {
                    console.log('Fetched user answers:', response.data); // Log the user answers
                    setUserAnswers(response.data || []); // Ensure userAnswers is an array
                }
            })
            .catch(error => {
                console.error('Error fetching user answers:', error.response ? error.response.data : error.message);
            })
    }, [id]);

    const handleGoToPrompt = () => {
        navigate(`/prompt/${id}`); // Navigate to the prompt page with the unique ID
    };

    const handleSubmit = async (e, questionId) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (questionId && newAnswers[questionId]) {
            //for (let answer of newAnswers[questionId]){
                let answerObject = {
                   questionId: questionId,
                   answer: newAnswers[questionId]
                }

                answersApiService.addUserAnswer(answerObject)
                    .catch(error => {
                        console.error('Error submitting answer:', error.response ? error.response.data : error.message);
                    });
            //}

            setUserAnswers(prev => [...prev, { userId: id, questionId, answer: newAnswers[questionId] }]);
            setNewAnswers(prev => ({ ...prev, [questionId]: '' })); // Clear the specific answer field
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
