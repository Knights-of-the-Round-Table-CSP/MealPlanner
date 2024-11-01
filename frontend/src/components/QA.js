// QAPage.js
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
            const answerObject = { questionId, answer: newAnswers[questionId] };
            answersApiService.addUserAnswer(answerObject)
                .then(() => {
                    setUserAnswers(prev => [...prev, { userId: id, questionId, answer: newAnswers[questionId] }]);
                    setNewAnswers(prev => ({ ...prev, [questionId]: '' }));
                })
                .catch(error => console.error('Error submitting answer:', error.message));
        }
    };

    const unansweredQuestions = questions.filter(question => 
        !userAnswers.some(answer => answer.questionId === question.id && answer.userId === id)
    );

    return (
        <div>
            <h1>Q&A Page for User {id}</h1>
            {unansweredQuestions.length > 0 ? (
                <div class = "qa-container">
                    <h2>Unanswered Questions:</h2>
                    <ul>
                        {unansweredQuestions.map((question) => (
                            <li key={question.id}>
                                {question.question}
                                <form onSubmit={(e) => handleSubmit(e, question.id)}>
                                    <input
                                        type="text"
                                        value={newAnswers[question.id] || ''}
                                        onChange={(e) => setNewAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                        placeholder="Type your answer here"
                                    />
                                    <br></br>
                                    <button type="submit">Submit Answer</button>
                                </form>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div class = "qa-container">
                    <h2>All Questions (Answered):</h2>
                    <ul>
                        {questions.map((question) => {
                            const userAnswer = userAnswers.find(answer => answer.questionId === question.id && answer.userId === id);
                            return (
                                <li key={question.id}>
                                    {question.question}
                                    {userAnswer && <p>Answer: {userAnswer.answer}</p>}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QAPage;
