const express = require("express");
const router = express.Router();
const db = require("../models");
const Articles = db.Articles;

router.get("/", async (req, res) => {
  const listofarticles = await Articles.findAll();
  res.json(listofarticles);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Articles.findByPk(id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, author, displayimg, genre,summary } = req.body;

    // Validate required fields
    if (!title || !content || !author || !displayimg) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newArticle = await Articles.create({
      title,
      content,
      author,
      displayimg,
      genre,
      summary,
    });

    res.status(201).json(newArticle); // 201 = Created
  } catch (err) {
    res.status(500).json({ error: "Failed to create article" });
  }
});

module.exports = router;
