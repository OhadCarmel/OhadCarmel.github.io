import React, { useState, component } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Container,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExperimentScreen from "../ExperimentScreen/ExperimentScreen";

function WelcomePage({
  handleStart,
  handleWordByWord,
  wordByWord,
  markHallucinations,
  handleMarkHallucinations,
  markLowConfidence,
  handleMarkLowConfidence,
  isEnableToStart,
}) {

  
  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to the Experiment
      </Typography>
      <Typography variant="body1" paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
        Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies
        sed, dolor. Cras elementum ultrices diam.
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={wordByWord}
            onChange={(event) => handleWordByWord(event.target.checked)}
            name="wordByWordSwitch"
            color="primary"
          />
        }
        label="Display Description Word by Word"
      />
      <FormControlLabel
        control={
          <Switch
            checked={markHallucinations}
            onChange={(event) => handleMarkHallucinations(event.target.checked)}
            name="hallucinationsMarkedSwitch"
            color="primary"
          />
        }
        label="Display hallucinations marked"
      />
      <FormControlLabel
        control={
          <Switch
            checked={markLowConfidence}
            onChange={(event) => handleMarkLowConfidence(event.target.checked)}
            name="lowConfidenceMarkedSwitch"
            color="primary"
          />
        }
        label="Display low confidence marked"
      />
      <Button variant="contained" color="primary" onClick={handleStart} disabled={!isEnableToStart}>
        Start
      </Button>
    </Container>
  );
}

export default WelcomePage;
