import Article from "../models/Article.js";
import Category from "../models/Category.js";

export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, subcategory, search } = req.query;
    const filter = { status: { $ne: "draft" } };

    if (category) {
      // Build a list of all names to match: the category itself + all its
      // child category names. This way ?category=Ethanol also finds articles
      // stored with category "Molasses" or "E20 Push" (children of Ethanol).
      const matchNames = [category];

      // Look up the parent category in DB to find its children
      const parent = await Category.findOne({ name: category, parent: null });
      if (parent) {
        const children = await Category.find({ parent: parent._id });
        children.forEach((c) => matchNames.push(c.name));
      }

      if (subcategory) {
        filter.$and = [
          { $or: [{ category: { $in: matchNames } }, { subcategory: { $in: matchNames } }] },
          { subcategory },
        ];
      } else {
        filter.$or = [
          { category: { $in: matchNames } },
          { subcategory: { $in: matchNames } },
        ];
      }
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
    const articleData = { ...req.body };
    if (!articleData.category) articleData.category = "Trending";
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (!updateData.category && updateData.category !== undefined) {
      // If they explicitly sent an empty string or null, we still default to Trending
      if (!updateData.category) updateData.category = "Trending";
    }
    const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
