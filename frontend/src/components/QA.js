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
    const navigate = useNavigate();

    useEffect(() => {
        questionsApiService.list()
            .then(response => setQuestions(response.data || []))
            .catch(error => console.error('Error fetching common questions:', error.message));

        answersApiService.listUserAnswers()
            .then(response => setUserAnswers(response.data || []))
            .catch(error => console.error('Error fetching user answers:', error.message));
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

    return (
        <div>
            <h1>Q&A Page for User {id}</h1>
            <div className="qa-container">
                <h2>All Questions:</h2>
                <ul>
                    {questions.map((question) => {
                        // Get all answers for this question
                        const allAnswers = userAnswers.filter(answer => answer.questionId === question.id);
                        return (
                            <li key={question.id}>
                                {question.question}
                                <ul>
                                    {allAnswers.map((answer, index) => (
                                        <li key={answer.id}>Answer {index + 1}: {answer.answer}</li>
                                    ))}
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
