import React from 'react';
import { Typography } from '../../material-overrides';
import { Switch } from '../../material-overrides';

type QuizzesSwitchProps = {
  addQuiz: boolean;
  setAddQuiz: (addQuiz: boolean) => void;
};

const QuizSwitch: React.FC<QuizzesSwitchProps> = ({ addQuiz, setAddQuiz }) => {
  const handleSwitchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const isChecked = event.target.checked;
    setAddQuiz(isChecked);
  };

  return (
    <Switch
      //   checked={addQuiz}
      onChange={handleSwitchChange}
      label={
        <div>
          <Typography color="blue-gray" className="font-medium">
            Add Quiz?
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            You'll be able to add quizzes for the lesson.
          </Typography>
        </div>
      }
      containerProps={{
        className: '-mt-5',
      }}
    />
  );
};

export default QuizSwitch;
