const express = require('express');
const router = express.Router();
const Team = require('../Models/Team');

const teamRoutes = (io) => {
  // Get all teams
  router.get('/', async (req, res) => {
    try {
      const teams = await Team.find();
      res.json(teams);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Create a new team
  router.post('/', async (req, res) => {
    if(req.body.password != process.env.PASSWORD)
      return 
    
    const team = new Team({
      name: req.body.name
    });

    try {
      const newTeam = await team.save();
      res.status(201).json(newTeam);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Increment a team's wins
  router.patch('/:id/increment', async (req, res) => {
    try {
      const result = await Team.findByIdAndUpdate(
        req.params.id,
        { $inc: { wins: 1 } },
        { new: true, useFindAndModify: false }
      );

      if (!result) return res.status(404).json({ message: 'Team not found' });
      const leaderboard = await Team.find().sort({ wins: -1 });

      io.emit('teamUpdated', leaderboard); // Emit event to all clients

      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Get leaderboard sorted by wins
  router.get('/leaderboard', async (req, res) => {
    try {
      const leaderboard = await Team.find().sort({ wins: -1 });
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get leaderboard sorted by total wins
  router.get('/leaderboardTotal', async (req, res) => {
    try {
      const leaderboard = await Team.find().sort({ winsTotal: -1 });
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};

module.exports = teamRoutes;
