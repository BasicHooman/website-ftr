const express = require('express');
const router = express.Router();
const { Officers } = require('../models');

router.get('/', async (req, res) => {
    try {
        const listOfOfficers = await Officers.findAll();
        const officersWithBase64Images = listOfOfficers.map(officer => {
            if (officer.photo && officer.photo instanceof Buffer) {
                return {
                    ...officer.toJSON(),
                    photo: officer.photo.toString('base64')
                };
            }
            return officer.toJSON();
        });
        res.json(officersWithBase64Images);
    } catch (error) {
        console.error("Error fetching officers:", error);
        res.status(500).json({ message: "Server Error fetching officers" });
    }
});

// Add your routes here

module.exports = router;