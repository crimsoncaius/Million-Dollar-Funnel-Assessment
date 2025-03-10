import questions from "./questions.json";

type QuestionsProps = {
  currentQuestionIndex: number;
  yesHandler: () => void;
  noHandler: () => void;
};

const Questions = (props: QuestionsProps) => {
  const { currentQuestionIndex, yesHandler, noHandler } = props;

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-4 md:flex-row md:p-0">
      <div className="flex flex-col w-full max-w-xl justify-center gap-4">
        <div className="text-center text-blue-800 text-xl md:text-3xl">
          {questions.Questions[currentQuestionIndex].Question}
        </div>
        <div className="flex flex-col w-full gap-4 md:flex-row md:gap-1">
          <button
            className="flex-1 text-xl md:text-3xl p-2 rounded border-2 border-black hover:bg-black hover:text-white"
            onClick={yesHandler}
          >
            Yes
          </button>
          <button
            className="flex-1 text-xl md:text-3xl p-2 rounded border-2 border-black hover:bg-black hover:text-white"
            onClick={noHandler}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questions;
