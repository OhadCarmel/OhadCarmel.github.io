// App.js
import React, { useEffect, useRef, useState } from "react";
// import BookListing from "./BookListing";
// import BookDetails from "./BookDetails";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import { AppBar } from "@mui/material";
// import FilterOptions from "./FilterOptions";
import WelcomePage from "./Screens/WelcomePage/WelcomePage";
import ExperimentScreen from "./Screens/ExperimentScreen/ExperimentScreen";
import {deployServerPath, localServerPath} from './constans';

const App = () => {
  axios.defaults.withCredentials = true;
  const useLocalServer = false;
  const baseURL = useLocalServer ? localServerPath : deployServerPath;

  const [userId, setUserId] = useState([]);
  const [books, setBooks] = useState([]);
  const [startExperiment, setStartExperiment] = useState(false);
  const [wordByWord, setWordByWord] = useState(false);
  const [markHallucinations, setmarkHallucinations] = useState(false);
  const [markLowConfidence, setmarkLowConfidence] = useState(false);
  const [dbIndex, setDbIndex] = useState(0);
  const [dab, setDab] = useState([]);
  const imageIterations = useRef([]);

  function handleStart() {
    setStartExperiment(true);
  }

  function renderNewExperiment() {
    setDbIndex((prevIndex) => prevIndex + 1);
    console.log("Start Experiment");
  }
  useEffect(() => {
    getUser();
    getBooks();
    getProbes();
  }, []);

  useEffect(()=> {
    if(dbIndex===2){
      console.log('sending');
      console.log('imageIterations');
      console.log(imageIterations.current); 
      sendImageIterations();
      setDbIndex(0)
    } else {
      console.log(`didn't send ${dbIndex}`);
    }
  },[dbIndex])
  const getBooks = () => {
    // axios
    //   .get(`${baseURL}/books`)
    //   .then((response) => setBooks(response.data.Books))
    //   .catch((error) => console.error(error));
  };

  const getProbes = () => {
    console.log('here');
    axios
      .get(`${baseURL}/random-docs`)
      .then((response) => {
        console.log('response')
        console.log(response.data)
        setDab(response.data)})
      .catch((error) => console.error(error));
  };

  const handleSubmitMongo = async () => {
    axios
      .post(`${baseURL}/submit`)
      .then(() => {
        console.log("Data submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handleFinishIteration = (imageIteration) => {
    imageIterations.current.push({...imageIteration, userId});
  };

  const sendImageIterations = async () => {
    axios
      .post(`${baseURL}/submit-imageIteration`, {
        imageIterations: {...imageIterations.current, userId: userId},   
      })
      .then(() => {
        console.log("Data submitted successfully");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });};

  const postBook = (title, author, publicationYear, description) => {
    axios
      .post(
        `${baseURL}/books`,
        {
          book: { title, author, publicationYear, description },
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        setBooks([...books, response.data.book]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getUser = () => {
    axios
      .get(`${baseURL}/user`)
      .then((response) => {

        setUserId(response.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilterChange = (publicationYear) => {
    const params = [];
    if (publicationYear) {
      params.push(`after=${publicationYear[0]}&before=${publicationYear[1]}`);
    }

    let url = `${baseURL}/books${params ? `?${params.join("&")}` : ``}`;
    axios
      .get(url)
      .then((response) => {
        setBooks(response.data.Books);
      })
      .catch((error) => console.error(error));
  };

  const renderToolBar = () => {
    return (
      <AppBar position="sticky" color="inherit">
        {/* <FilterOptions handleFilterChange={handleFilterChange} /> */}
      </AppBar>
    );
  };

  const renderNormal = () => (
    <div className="App">
      {renderToolBar()}
      <Router>
        <Routes>
          {/* <Route
            path="/"
            element={
              // <BookListing
              //   books={books}
              //   postBook={postBook}
              //   showTopReviewerBadge={
              //     true // need to be changed the condition based on the instructions
              //   }
              // />
            }
          /> */}
          {/* <Route path="/book/:bookId" element={<BookDetails />} /> */}
        </Routes>
      </Router>
    </div>
  );

  const renderExp = () =>
    !startExperiment ? (
      <WelcomePage
        handleStart={handleStart}
        handleWordByWord={setWordByWord}
        wordByWord={wordByWord}
        markHallucinations={markHallucinations}
        handleMarkHallucinations={setmarkHallucinations}
        markLowConfidence={markLowConfidence}
        handleMarkLowConfidence={setmarkLowConfidence}
      />
    ) : (
      <ExperimentScreen
        firstProbe={dab[dbIndex].probes[0]}
        secondProbe={dab[dbIndex].probes[1]}
        description={
          markHallucinations
            ? dab[dbIndex].hallucinations
            : dab[dbIndex].description
        }
        imgLink={dab[dbIndex].image_link}
        renderNewExperiment={renderNewExperiment}
        logits={dab[dbIndex].logits}
        wordByWord={wordByWord}
        markHallucinations={markHallucinations}
        markLowConfidence={markLowConfidence}
        sendImageIteration={handleFinishIteration}
        wordsProb={dab[dbIndex].wordsProb}
        sendImageIterations={sendImageIterations}
      />
    );

  return renderExp();
};

export default App;
