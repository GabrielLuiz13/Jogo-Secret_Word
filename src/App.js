//Css
import './App.css';

//React
import {useCallback, useEffect, useState} from 'react'

//Data
import { wordsList } from './data/Words';

//Components
import StartScreen from './Components/StartScreen';
import Game from './Components/Game';
import GameOver from './Components/GameOver';

const stages = [
  { id: 1, name: "start"},
  { id: 2, name: "game"},
  { id: 3, name: "end"}
]

const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //Pegando categoria aleatória
    const categories = Object.keys(words)
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)
    //Pegando palavra aleatoria
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return {word, category}
  }, [words])

  //Startando o jogo
  const startGame = useCallback(() => {
    
    clearLetterStates()
    
    setGameStage(stages[1].name)

    const {word, category} = pickWordAndCategory()

    console.log(word, category)

    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(wordLetters)

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGuesses(guessesQty)
    
  }, [pickWordAndCategory])

  //Verificando a letra

  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();
    
    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
    
    

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    
    if(guesses <= 0){ 
      
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  //checando condição de vitória
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)]

      if(guessedLetters.length === uniqueLetters.length){
        
        setScore((actualScore) => actualScore += 100)

        startGame()

      }

  }, [guessedLetters, letters, startGame])


  //restartando o jogo
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    
    setGameStage(stages[0].name)
  }


  return (
    <div class="App"> 
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && 
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
         />
       }
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;