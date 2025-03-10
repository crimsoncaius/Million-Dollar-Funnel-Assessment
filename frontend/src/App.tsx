import questions from "./questions.json";
import Questions from "./Questions";
import { z } from "Zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Start from "./Start";
import Info from "./Info";

const personSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
});

type Person = z.infer<typeof personSchema>;

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerList, setAnswerList] = useState(
    Array.from({ length: 20 }, () => false)
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Person>({ resolver: zodResolver(personSchema) });

  // 4 Modes start, info, questions, finished
  const [mode, setMode] = useState<String>("start");

  const questionsLength = questions.Questions.length;

  const goNext = () => {
    if (currentQuestionIndex + 1 == questionsLength) {
      setMode("info");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const yesHandler = () => {
    let nextList = answerList;
    nextList[currentQuestionIndex] = true;
    setAnswerList(nextList);
    goNext();
  };

  const noHandler = () => {
    let nextList = answerList;
    nextList[currentQuestionIndex] = false;
    setAnswerList(nextList);
    goNext();
  };

  return (
    <div>
      {(() => {
        switch (mode) {
          case "start":
            return <Start setMode={setMode} />;
          case "info":
            return (
              <Info
                setMode={setMode}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                control={control}
                answerList={answerList}
              />
            );
          case "questions":
            return (
              <Questions
                currentQuestionIndex={currentQuestionIndex}
                yesHandler={yesHandler}
                noHandler={noHandler}
              />
            );
          case "finished":
            return (
              <div className="h-screen w-screen">
                <div className="flex flex-row justify-center h-full w-full">
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-blue-800 text-5xl">
                      Quiz Finished! Redirecting...
                    </div>
                    <a href="https://mdfa.tres.sg/booking">
                      mdfa.tres.sg/booking
                    </a>
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
