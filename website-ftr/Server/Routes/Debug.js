const express = require("express");
const router = express.Router();
const db = require("../models");
const Articles = db.Articles;

const SEED_PREFIX = "[SEED]";
const CATEGORIES = ["news", "opinion", "resources", "action", "global"];

// POST /api/debug/seed-articles
router.post("/seed-articles", async (req, res) => {
  try {
    const articlesToCreate = [];
    for (const category of CATEGORIES) {
      for (let i = 1; i <= 2; i++) {
        articlesToCreate.push({
          title: `${SEED_PREFIX} ${category} Article ${i}`,
          content: JSON.stringify([
            { type: 'paragraph', children: [{ text: `This is the filler content for the ${category} article #${i}.` }] }
          ]),
          author: "Seed Script",
          displayimg: "https://via.placeholder.com/463x308",
          genre: category,
          summary: `This is a short summary for the seeded ${category} article #${i}.`,
        });
      }
    }

    await Articles.bulkCreate(articlesToCreate);
    res.status(201).json({ message: "Successfully seeded 10 articles." });
  } catch (error) {
    console.error("Error seeding articles:", error);
    res.status(500).json({ error: "Failed to seed articles." });
  }
});

// DELETE /api/debug/seed-articles
router.delete("/seed-articles", async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const result = await Articles.destroy({
      where: {
        title: {
          [Op.like]: `${SEED_PREFIX}%`,
        },
      },
    });
    res.status(200).json({ message: `Successfully deleted ${result} seeded articles.` });
  } catch (error) {
    console.error("Error deleting seeded articles:", error);
    res.status(500).json({ error: "Failed to delete seeded articles." });
  }
});

module.exports = router;