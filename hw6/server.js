// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/footballPlayers", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define Schema and Model
const PlayerSchema = new mongoose.Schema({
  playerId: Number,
  name: String,
  position: String,
  goalsScored: Number,
  ranking: Number,
  country: String,
  assists: Number,
  age: Number,
});

const Player = mongoose.model("Player", PlayerSchema);

// ✅ Preload Data if Empty
async function preloadData() {
  const count = await Player.countDocuments();
  if (count === 0) {
    await Player.insertMany([
      {
        playerId: 1,
        name: "Lionel Messi",
        position: "Forward",
        goalsScored: 800,
        ranking: 1,
        country: "Argentina",
        assists: 350,
        age: 36,
      },
      {
        playerId: 2,
        name: "Cristiano Ronaldo",
        position: "Forward",
        goalsScored: 850,
        ranking: 2,
        country: "Portugal",
        assists: 280,
        age: 38,
      },
      {
        playerId: 3,
        name: "Neymar Jr",
        position: "Forward",
        goalsScored: 400,
        ranking: 5,
        country: "Brazil",
        assists: 300,
        age: 32,
      },
      {
        playerId: 4,
        name: "Kevin De Bruyne",
        position: "Midfielder",
        goalsScored: 150,
        ranking: 3,
        country: "Belgium",
        assists: 450,
        age: 32,
      },
      {
        playerId: 5,
        name: "Virgil van Dijk",
        position: "Defender",
        goalsScored: 50,
        ranking: 8,
        country: "Netherlands",
        assists: 60,
        age: 32,
      },
    ]);
    console.log("Sample data inserted");
  }
}
preloadData();

// ✅ GET: Retrieve all players
app.get("/players", async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

// ✅ GET: Advanced Queries
app.get("/players/query", async (req, res) => {
  try {
    const { filter } = req.query;

    let query = {};
    switch (filter) {
      case "top-scorers":
        query = { goalsScored: { $gt: 300 }, assists: { $gte: 200 } };
        break;
      case "ronaldo-35":
        query = {
          name: { $regex: "Ronaldo", $options: "i" },
          age: { $gt: 35 },
        };
        break;
      case "forward-midfielder":
        query = { position: { $in: ["Forward", "Midfielder"] } };
        break;
      case "ranking-1-5":
        query = { ranking: { $gte: 1, $lte: 5 } };
        break;
      case "age-30":
        const count = await Player.countDocuments({ age: { $gt: 30 } });
        return res.json({ count });
      default:
        return res.status(400).json({ message: "Invalid filter" });
    }

    const players = await Player.find(query).sort(
      filter === "ranking-1-5" ? { goalsScored: -1 } : {}
    );
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST: Add a new player
app.post("/players", async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PATCH: Update a player's details based on `playerId`
app.patch("/players/playerId/:playerId", async (req, res) => {
  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { playerId: Number(req.params.playerId) },
      req.body,
      { new: true }
    );
    if (!updatedPlayer)
      return res.status(404).json({ message: "Player not found" });
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE: Remove a player based on `playerId`
app.delete("/players/playerId/:playerId", async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({
      playerId: Number(req.params.playerId),
    });
    if (!deletedPlayer)
      return res.status(404).json({ message: "Player not found" });
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
