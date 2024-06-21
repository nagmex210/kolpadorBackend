const mongoose = require('mongoose');
const Team = require('../Models/Team'); // Adjust the path as necessary
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  async function selectWeeklyWinner() {
    try {
      // Find the team with the highest number of current wins
      const teams = await Team.find();
      if (teams.length === 0) {
        console.log('No teams found');
        return;
      }

      // Find the team with the highest wins
      let winner = teams[0];
      for (const team of teams) {
        if (team.wins > winner.wins) {
          winner = team;
        }
      }

      // Increment the total wins of the winner and reset its current wins to 0
      winner.winsTotal += 1;

      // Reset the current wins of all teams to 0
      for (const team of teams) {
        team.wins = 0;
      }

      // Save all teams
      await Promise.all(teams.map(team => team.save()));

      console.log(`Weekly winner: ${winner.name}`);
    } catch (error) {
      console.error('Error selecting weekly winner:', error);
    } finally {
      mongoose.connection.close();
    }
  }

  selectWeeklyWinner();
});
