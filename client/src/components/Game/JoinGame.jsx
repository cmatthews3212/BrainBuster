import React from 'react';
import { useNavigate } from 'react-router-dom';

function JoinGame() {

  const navigate = useNavigate();

  const renderQuiz = () => {
    return navigate('/quiz')
  }



  
  return (
    <div className="join-game">
      <button onClick={renderQuiz}>JOIN!</button>
      <button>INVITE!</button>
    </div>
  );
}

export default JoinGame;
