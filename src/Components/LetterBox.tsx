import React, { ChangeEvent, KeyboardEvent } from 'react';
import './LetterBox.css';

export function LetterBox({
  letters,
  setLetters
}: {
  letters: string[];
  setLetters: React.Dispatch<React.SetStateAction<string[]>>
}): JSX.Element {

  const updateLetter = (position: number, letter: string) => {
    const newLetters = [...letters];
    newLetters[position - 1] = letter;
    setLetters(newLetters);
  };

  const clearLetter = (position: number) => {
    const newLetters = [...letters];
    newLetters[position - 1] = '';
    setLetters(newLetters);
  };

  return (
    <div className="lb-container">
      <div className="lb-box-content">
        <div className="lb-input-container">
          <div className="lb-group-left">
            <LetterInputBox position={10} letter={letters[9]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={11} letter={letters[10]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={12} letter={letters[11]} onUpdate={updateLetter} onClear={clearLetter} />
          </div>
          <div className="lb-group-top">
            <LetterInputBox position={1} letter={letters[0]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={2} letter={letters[1]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={3} letter={letters[2]} onUpdate={updateLetter} onClear={clearLetter} />
          </div>
          <div className="lb-group-right">
            <LetterInputBox position={4} letter={letters[3]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={5} letter={letters[4]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={6} letter={letters[5]} onUpdate={updateLetter} onClear={clearLetter} />
          </div>
          <div className="lb-group-bottom">
            <LetterInputBox position={7} letter={letters[6]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={8} letter={letters[7]} onUpdate={updateLetter} onClear={clearLetter} />
            <LetterInputBox position={9} letter={letters[8]} onUpdate={updateLetter} onClear={clearLetter} />
          </div>
        </div>
      </div>
    </div>
  );
}

const LetterInputBox: React.FC<{ 
    position: number, 
    letter: string, 
    onUpdate: (position: number, letter: string) => void, 
    onClear: (position: number) => void 
  }> = ({ 
    position, 
    letter, 
    onUpdate, 
    onClear 
  }) => {
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.toUpperCase().charAt(0);
    onUpdate(position, input);
    if (input.length === 1) {
      const nextInput = event.target.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && letter === '') {
      onClear(position);
      const prevInput = event.currentTarget.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  return (
    <input
      className="lb-input-box"
      type="text"
      value={letter}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={1}
      data-position={position}
    />
  );
};
