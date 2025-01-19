// Connect to the footballPlayers database
use footballPlayers;

// Insert sample data for football players
db.footballPlayers.insertMany([
  { playerId: 1, name: "Lionel Messi", position: "Forward", goalsScored: 800, ranking: 1, country: "Argentina", assists: 350, age: 36 },
  { playerId: 2, name: "Cristiano Ronaldo", position: "Forward", goalsScored: 850, ranking: 2, country: "Portugal", assists: 280, age: 38 },
  { playerId: 3, name: "Neymar Jr", position: "Forward", goalsScored: 400, ranking: 5, country: "Brazil", assists: 300, age: 32 },
  { playerId: 4, name: "Kevin De Bruyne", position: "Midfielder", goalsScored: 150, ranking: 3, country: "Belgium", assists: 450, age: 32 },
  { playerId: 5, name: "Virgil van Dijk", position: "Defender", goalsScored: 50, ranking: 8, country: "Netherlands", assists: 60, age: 32 }
]);

// 1. Find players who have scored more than 300 goals and have at least 200 assists.
print("Players with more than 300 goals and at least 200 assists:");
printjson(db.footballPlayers.find({ goalsScored: { $gt: 300 }, assists: { $gte: 200 } }).toArray());

// 2. Find players whose name contains 'Ronaldo' and are aged above 35.
print("Players whose name contains 'Ronaldo' and are aged above 35:");
printjson(db.footballPlayers.find({ name: { $regex: "Ronaldo" }, age: { $gt: 35 } }).toArray());

// 3. Retrieve players who play in either 'Forward' or 'Midfielder' positions.
print("Players who play as Forward or Midfielder:");
printjson(db.footballPlayers.find({ position: { $in: ["Forward", "Midfielder"] } }).toArray());

// 4. Find players with ranking between 1 and 5 and sort them by goals scored in descending order.
print("Players with ranking between 1 and 5 sorted by goals scored:");
printjson(db.footballPlayers.find({ ranking: { $gte: 1, $lte: 5 } }).sort({ goalsScored: -1 }).toArray());

// 5. Count the number of players who are older than 30 years.
print("Number of players older than 30 years:");
print(db.footballPlayers.countDocuments({ age: { $gt: 30 } }));
