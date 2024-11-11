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
                setError('An error occurred while fetching questions or answers.');
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

    if (loading) {
        return <p>Loading questions and answers...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (questions.length === 0) {
        return <p style={{ color: 'red' }}>No questions available at the moment.</p>;
    }

    return (
        <div>
            <h1>Q&A Page for User {id}</h1>
            <div className="qa-container">
                <h2>All Questions:</h2>
                <ul>
                    {questions.map((question) => {
                  
                        const allAnswers = userAnswers.filter(answer => answer.questionId === question.id);
                        return (
                            <li key={question.id}>
                                {question.question}
                                <ul>
                                    {allAnswers.length > 0 ? (
                                        allAnswers.map((answer, index) => (
                                            <li key={answer.id}>Answer {index + 1}: {answer.answer}</li>
                                        ))
                                    ) : (
                                        <li style={{ color: 'red' }}>No answers available for this question.</li>
                                    )}
                                </ul>
                                <form onSubmit={(e) => handleSubmit(e, question.id)}>
                                    <input
                                        type="text"
                                        value={newAnswers[question.id] || ''}
                                        onChange={(e) => setNewAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
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
