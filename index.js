const express = require('express');
const axios = require('axios');
const GitHubRepo = require('./githubRepo');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.post('/github', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url);
        const repos = response.data;

        for (const repo of repos) {
            const existingRepo = await GitHubRepo.findOne({ id: repo.id });

            if (existingRepo) {
                await GitHubRepo.updateOne({ id: repo.id }, repo);
            } else {
                await GitHubRepo.create(repo);
            }
        }

        res.status(200).send('GitHub data saved to MongoDB');
    } catch (error) {
        console.error('Error saving GitHub data to MongoDB:', error);
        res.status(500).send('Error saving GitHub data to MongoDB');
    }
});

app.get('/github/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const repo = await GitHubRepo.findOne({ id });

        if (repo) {
            res.status(200).json(repo);
        } else {
            res.status(404).send('GitHub repository not found');
        }
    } catch (error) {
        console.error('Error retrieving GitHub data from MongoDB:', error);
        res.status(500).send('Error retrieving GitHub data from MongoDB');
    }
});

app.listen(8080, async () => {
    await mongoose.connect("mongodb://localhost:27017/github")
    console.log(`Server is running on port ${PORT}`);
});
