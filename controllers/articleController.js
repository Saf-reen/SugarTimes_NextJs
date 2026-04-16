import Article from "../models/Article.js";

export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, subcategory, search } = req.query;
    const filter = {};
    // Match on either parent category OR subcategory so user-facing
    // /news?category=<label> still finds articles when <label> is a
    // sub-category (e.g. "Molasses" under "Ethanol").
    if (category && subcategory) {
      filter.$and = [
        { $or: [{ category }, { subcategory: category }] },
        { subcategory },
      ];
    } else if (category) {
      filter.$or = [{ category }, { subcategory: category }];
    } else if (subcategory) {
      filter.subcategory = subcategory;
    }
    if (search) filter.title = { $regex: search, $options: "i" };

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Article.countDocuments(filter);
    res.json({ articles, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
