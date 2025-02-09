import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [verse, setVerse] = useState("");
  const [specificVerse, setSpecificVerse] = useState("");
  const [customVerse, setCustomVerse] = useState("");

  const BASE_URL = "https://labs.bible.org/api/?passage=";

  const fetchRandomVerse = async () => {
    console.log("Fetching a new random verse...");

    try {
      const uniqueURL = `https://labs.bible.org/api/?passage=random&type=json&nocache=${new Date().getTime()}`;

      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(uniqueURL)}`
      );

      const data = JSON.parse(response.data.contents);

      console.log("API Response:", data);

      if (data.length > 0) {
        const verseText = data[0]?.text || "No verse found.";
        const verseReference =
          data[0]?.bookname + " " + data[0]?.chapter + ":" + data[0]?.verse;

        setVerse(`${verseText} — ${verseReference}`);
      } else {
        setVerse("No verse available.");
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      setVerse("Error fetching verse. Please try again.");
    }
  };

  const fetchSpecificVerse = async () => {
    const verseRegex = /^[0-9]*\s?[A-Za-z]+(?:\s[A-Za-z]+)?\s[0-9]+:[0-9]+$/;
    if (!specificVerse.trim()) {
      setCustomVerse("Please enter a valid verse (e.g., John 3:16).");
      return;
    }

    if (!verseRegex.test(specificVerse)) {
      setCustomVerse(
        "Invalid format. Use 'Book Chapter:Verse' (e.g., John 3:16)."
      );
      return;
    }

    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          BASE_URL + encodeURIComponent(specificVerse) + "&type=json"
        )}`
      );

      const data = JSON.parse(response.data.contents);

      if (data.length > 0) {
        setCustomVerse(data[0]?.text || "No verse found.");
      } else {
        setCustomVerse("Verse not found. Please check your input.");
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      setCustomVerse("Error fetching verse. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="overlay">
        <h1>Bible Verses</h1>

        <button className="btn" onClick={fetchRandomVerse}>
          Get Random Verse
        </button>
        <p className="verse">{verse}</p>

        <div className="input-container">
          <input
            type="text"
            placeholder="Enter verse (e.g., John 3:16)"
            value={specificVerse}
            onChange={(e) => setSpecificVerse(e.target.value)}
            className="input-box"
          />
          <button className="btn" onClick={fetchSpecificVerse}>
            Get Specific Verse
          </button>
        </div>
        <p className="verse">{customVerse}</p>
      </div>
    </div>
  );
};

export default App;
