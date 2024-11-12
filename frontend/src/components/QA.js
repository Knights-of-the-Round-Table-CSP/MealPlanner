import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../static/qa.css';
import questionsApiService from '../utils/questionApi';
import answersApiService from '../utils/answerApi';

const QAPage = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [newAnswers, setNewAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch questions and user answers from the API
        const fetchData = async () => {
            try {
                const questionsResponse = await questionsApiService.list();
                const answersResponse = await answersApiService.listUserAnswers();

                setQuestions(questionsResponse.data || []);
                setUserAnswers(answersResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setError('Unable to load questions from the database.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = (e, questionId) => {
        e.preventDefault();
        if (questionId && newAnswers[questionId]) {
            const answerObject = { questionId, answer: newAnswers[questionId], userId: id };
            answersApiService.addUserAnswer(answerObject)
                .then(() => {
                    setUserAnswers(prev => [...prev, answerObject]);
                    setNewAnswers(prev => ({ ...prev, [questionId]: '' }));
                })
                .catch(error => console.error('Error submitting answer:', error.message));
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        console.log(answerId)
        try {
            await answersApiService.deleteUserAnswer(answerId);
            setUserAnswers(prevData => [
                ...prevData.filter(answer => answer.answerId !== answerId)
              ])
        } catch (error) {
            console.error('Error deleting answer:', error.message);
            setError('Failed to delete the answer.');
        }
    };

    if (loading) {
        return <p>Loading questions and answers...</p>;
    }

    if (error || questions.length === 0) {
        return (
            <div className='noData'>
                <p style={{ color: 'red' }}>
                    {error || 'No questions available at the moment.'}
                </p>
                <button onClick={() => navigate('/login')}>Go to Login Page</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Q&A Page for User {id}</h1>
            <div className="qa-container">
                <h1>All Questions with the Answers</h1>
                <ul>
                    {questions.map((question) => {
                        const allAnswers = userAnswers.filter(answer => answer.questionId === question.id);
    
                        // Log the current question, and its associated answers
                        console.log('Question:', question);
                        console.log('All answers for this question:', allAnswers);
    
                        return (
                            <li key={question.id} className="question-card">
                                <h2 className="question-text">{question.question}</h2>
                                <ul>
                                    {allAnswers.length > 0 ? (
                                        allAnswers.map((answer, index) => (
                                            <li key={answer.answerId}>
                                                Answer {index + 1}: {answer.answer} &nbsp; &nbsp;
                                                <button
                                                    onClick={() => {
                                                        console.log('Deleting answer:', answer.answerId);
                                                        handleDeleteAnswer(answer.answerId);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ color: 'red' }}>No answers available for this question.</li>
                                    )}
                                </ul>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log('Submitting answer for question:', question.id, 'Answer:', newAnswers[question.id]);
                                    handleSubmit(e, question.id);
                                }}>
                                    <input
                                        type="text"
                                        value={newAnswers[question.id] || ''}
                                        onChange={(e) => {
                                            console.log('Answer input changed:', e.target.value); // Log input changes
                                            setNewAnswers(prev => ({ ...prev, [question.id]: e.target.value }));
                                        }}
                                        placeholder="Type your answer here"
                                    />
                                    <button type="submit">Submit Answer</button>
                                </form>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
    
};

export default QAPage;
