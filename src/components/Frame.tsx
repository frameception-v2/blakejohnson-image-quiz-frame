"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE, QUIZ_QUESTIONS, RESULT_MESSAGES } from "~/lib/constants";

function QuizCard({ question, onAnswer }: {
  question: typeof QUIZ_QUESTIONS[number],
  onAnswer: (isCorrect: boolean) => void
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const handleChoice = (answer: boolean) => {
    setSelectedAnswer(answer);
    onAnswer(answer === question.answer);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz: Maschine Capabilities</CardTitle>
        <CardDescription>{question.question}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <button
            className={`flex-1 p-2 rounded ${selectedAnswer === true ? 'bg-green-200' : 'bg-gray-100'} hover:bg-green-100`}
            onClick={() => handleChoice(true)}
          >
            ✅ Yes
          </button>
          <button
            className={`flex-1 p-2 rounded ${selectedAnswer === false ? 'bg-red-200' : 'bg-gray-100'} hover:bg-red-100`}
            onClick={() => handleChoice(false)}
          >
            ❌ No
          </button>
        </div>
        {selectedAnswer !== null && (
          <div className="mt-2 text-sm p-2 bg-gray-50 rounded">
            {question.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultsCard({ score }: { score: number }) {
  const result = RESULT_MESSAGES[score] || RESULT_MESSAGES[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Complete! 🎉</CardTitle>
        <CardDescription>Your score: {score}/{QUIZ_QUESTIONS.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-lg font-semibold">
          {result.text}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Maschine can handle:
          <ul className="list-disc pl-4 mt-2">
            <li>Image rendering</li>
            <li>Button interactions</li>
            <li>Simple state management</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [added, setAdded] = useState(false);
  const [addFrameResult, setAddFrameResult] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 1500);
    } else {
      setShowResults(true);
    }
  }, [currentQuestion]);

  // ... keep existing useEffect and other logic the same ...

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      paddingTop: context?.client.safeAreaInsets?.top ?? 0,
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0,
    }}>
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-300">
          {PROJECT_TITLE}
        </h1>
        
        <div className="mb-4">
          <div className="h-1 bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${((currentQuestion) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </div>
        </div>

        {showResults ? (
          <ResultsCard score={correctAnswers} />
        ) : (
          <QuizCard 
            question={QUIZ_QUESTIONS[currentQuestion]}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}
