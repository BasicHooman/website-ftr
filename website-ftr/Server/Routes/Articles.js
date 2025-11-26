const express = require("express");
const router = express.Router();
const db = require("../models");
const Articles = db.Articles;

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Articles.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // To get the latest articles first
    });
    const totalPages = Math.ceil(count / limit);
    res.json({ articles: rows, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
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

router.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Articles.findAndCountAll({
      where: { genre: category },
      limit,
      offset,
      order: [['createdAt', 'DESC']], // To get the latest articles first
    });
    const totalPages = Math.ceil(count / limit);
    res.json({ articles: rows, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
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

