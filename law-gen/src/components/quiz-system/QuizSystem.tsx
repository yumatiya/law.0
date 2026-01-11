import React, { useState } from 'react';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

interface QuizSystemProps {
  questions: Question[];
  onQuizComplete?: (score: number, total: number) => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    if(showResults) return; // prevent changes after quiz done

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if(currentQuestionIndex < questions.length - 1){
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if(currentQuestionIndex > 0){
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = (): number => {
    return userAnswers.reduce((score: number, answer: number | null, idx: number) => {
      if(answer !== null && answer === questions[idx].correctAnswerIndex){
        return score + 1;
      }
      return score;
    }, 0);
  };

  const handleSubmit = () => {
    setShowResults(true);
    if(onQuizComplete){
      const score = calculateScore();
      onQuizComplete(score, questions.length);
    }
  };

  const restartQuiz = () => {
    setUserAnswers(Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Quiz</h2>

      {!showResults ? (
        <>
          <div className="mb-4">
            <p className="text-lg font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="mt-2 mb-4">{questions[currentQuestionIndex].questionText}</p>
            <ul className="space-y-2">
              {questions[currentQuestionIndex].options.map((option, idx) => (
                <li key={idx}>
                  <button
                    className={`w-full text-left p-2 rounded border ${
                      userAnswers[currentQuestionIndex] === idx ? 'border-indigo-500 bg-indigo-100' : 'border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(idx)}
                    aria-pressed={userAnswers[currentQuestionIndex] === idx ? 'true' : 'false'}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-primary disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn-primary"
                disabled={userAnswers[currentQuestionIndex] === null}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={userAnswers[currentQuestionIndex] === null}
              >
                Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <div>
          <p className="text-xl font-semibold mb-4">
            You scored {calculateScore()} out of {questions.length}
          </p>
          <ul className="space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctAnswerIndex;
              return (
                <li key={q.id} className="p-2 border rounded bg-gray-50">
                  <p className="font-semibold">
                    Q{idx + 1}: {q.questionText}
                  </p>
                  <p>
                    Your answer:{' '}
                    <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {userAnswer !== null ? q.options[userAnswer] : 'No answer'}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p>
                      Correct answer: <span className="text-green-600">{q.options[q.correctAnswerIndex]}</span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <button onClick={restartQuiz} className="btn-primary mt-4">
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSystem;
