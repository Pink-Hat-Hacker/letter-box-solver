import React, { useState } from 'react';
import axios from 'axios'; 

import {LetterBox} from "./Components/LetterBox";
import {solvePuzzle} from "./Components/solve";
import yoyoImg from "./assets/yoyo.png";
import './App.css';
import { Modal } from './Components/Modal';

function App() {
  const [letters, setLetters] = useState(['', '', '', '', '', '', '', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [nytBool, setNYTBool] = useState(false);
  const [info, setInfo] = useState<[][]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSolve = () => {
    // Check if all 12 letter input boxes are filled with distinct characters
    const uniqueLetters = new Set(letters.filter(letter => letter !== ''));

    if (uniqueLetters.size !== 12) {
      setErrorMessage('please input 3 unique letters per side');
      setNYTBool(false);
    } else {
      setErrorMessage('');
      solvePuzzle(letters, nytBool)
      .then(result => {
        setInfo([result.Letters, result['NYT Solution'], result['Solution List']]); // Set the resolved value to info
        openModal(); // Open the modal
      })
      .catch(error => {
        // Handle any errors here
        console.error('Error in solving puzzle:', error);
      });
    }
  };

  const handleClear = () => {
    // Clear all the letters
    const newLetters = Array(12).fill('');
    setLetters(newLetters);
    setNYTBool(false);
  };

  const handleAutofill = () => {
    /**
     * Make an HTTP request to fetch today's letters
     * 
     * Currently using a proxy server for cors
     */
    axios.get('/puzzles/letter-boxed').then((response: any) => {
        const htmlContent = response.data;
        // Define a regular expression to match the JSON containing "sides"
        const regex = /window\.gameData\s*=\s*({[^}]*})/;
        // Find and extract the JSON object containing "sides"
        const match = htmlContent.match(regex);
        if (match && match[1]) {
          const jsonData = JSON.parse(match[1]);
          const sides = jsonData.sides;
          setLetters(sides.join('').split(''));
          setNYTBool(true);
        } else {
          console.log('No match found for gameData in the HTML content.');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching letters:', error);
      });
  };

  return (
    <>
    <main className='App'>
      <section className='App-header'>
        <div className="pz-moment__icon large letter-boxed"></div>
        <h1 className="pz-moment__title medium slide-up">PHH's Letter Boxed Solver</h1>
      </section>
      <section className='App-lb'>
        <LetterBox 
          letters={letters}
          setLetters={setLetters}
        ></LetterBox>
      </section>
      <section className='App-buttons'>
        <div className="lb-bt-container">
          <button type="button" className="lb-button" data-testid="lb-autofill" onClick={handleAutofill}>Autofill w/ Today's Puzzle</button>
          <button type="button" className="lb-button" data-testid="lb-clear" onClick={handleClear}>Clear</button>
          <button type="button" className="lb-button" data-testid="lb-submit" onClick={handleSolve}>Submit</button>
        </div>
      </section>
      <Modal isOpen={isModalOpen} onClose={closeModal} info={info} />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </main>
    <footer>
      <div className='pph-socials'>
        <img className="yoyo" width={25} height={25} src={yoyoImg} alt='pph yoyo logo'/>
        <span>
          <a href='https://zoevalladares.com'> Zoë Y. Valladares </a>
          |
          <a href='https://github.com/Pink-Hat-Hacker'> GitHub </a></span>
      </div>
    </footer>
    </>
  );
}

export default App;