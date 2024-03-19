import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import backgroundImage from './src/components/background.jpg';
import "./App.css";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import MainCont from "./components/MainCont";

function App() {
  const style = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: "flex",
    justifyContent: "center",
    width: "100vw",
  };

  return (
    <div style={style}>
      <Container maxWidth="xl">
        <MainCont />
      </Container>
    </div>
  );
}

export default App;