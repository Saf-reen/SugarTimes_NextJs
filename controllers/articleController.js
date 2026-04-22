import Article from "../models/Article.js";
import Category from "../models/Category.js";

export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, subcategory, search, admin } = req.query;
    const filter = {};

    // For non-admin/public view, exclude drafts
    if (admin !== "true") {
      filter.status = { $ne: "draft" };
    }

    // Default taxonomy fallback — labels MUST match categories.js exactly
    // Added synonyms (Market Industry, Sugar Industry News, etc.) to capture legacy data.
    const CATEGORY_MAP = {
      "Sugar Industry":        ["Sugar Mill News", "Policy", "Sugarcane Dept.", "Sugar Prices", "Sugar Industry News"],
      "Ethanol":               ["Blending News", "Distillery Projects", "ENA Trade", "Biofuel Policy", "Molasses", "E20 Push"],
      "Farmer / किसान":        ["SAP / FRP Rates", "Cane Farming", "AgriTech", "Hindi News", "Agriculture"],
      "Market & Prices":       ["Market Trends", "Market Rates", "International Trade", "Export / Import", "Market Industry"],
      "Technology":            ["Research & Development", "Conferences", "Interviews"],
      "Jaggery & Food":        ["Jaggery / Gur", "Sugar & Health", "Food Industry", "Lifestyle"],
    };

    if (category) {
      // Build a list of all names to match: the category itself + all its
      // child category names.
      let matchNames = [category];

      // 1. Check DB for children
      const parentDoc = await Category.findOne({ name: category, parent: null });
      if (parentDoc) {
        const children = await Category.find({ parent: parentDoc._id });
        children.forEach((c) => matchNames.push(c.name));
      } else {
        // 2. Fallback to hardcoded map — Case Insensitive search
        const foundKey = Object.keys(CATEGORY_MAP).find(
          (k) => k.toLowerCase() === category.toLowerCase()
        );
        if (foundKey) {
          matchNames = [foundKey, ...CATEGORY_MAP[foundKey]];
        }
      }

      // Combine names into a single regex for robust matching (handles variations in & vs &amp; etc)
      const pattern = matchNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
      const regexFilter = { $regex: `^(${pattern})$`, $options: "i" };

      if (subcategory) {
        filter.$and = [
          { $or: [{ category: regexFilter }, { subcategory: regexFilter }] },
          { subcategory: { $regex: `^${subcategory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
        ];
      } else {
        filter.$or = [
          { category: regexFilter },
          { subcategory: regexFilter },
        ];
      }
    } else if (subcategory) {
      filter.subcategory = { $regex: `^${subcategory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };
    }

    if (search) filter.title = { $regex: search, $options: "i" };

    // DEBUG: log the filter to see what's being queried
    if (process.env.NODE_ENV !== "production") {
      console.log("[Articles] category param:", category);
      console.log("[Articles] filter:", JSON.stringify(filter, null, 2));
    }

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

// Whitelist of fields accepted from the admin form. Any `_id`/`id` etc.
// would crash findByIdAndUpdate or be rejected by Mongoose strict mode, so
// we pick explicitly instead of spreading the raw body.
const ARTICLE_FIELDS = [
  "title", "slug", "excerpt", "content", "category", "subcategory",
  "image", "author", "premium", "trending",
  "showContributor", "contributorName", "contributorBio",
  "status", "wpId",
];

const pickArticlePayload = (body) =>
  ARTICLE_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

export const createArticle = async (req, res) => {
  try {
    const articleData = pickArticlePayload(req.body);
    if (!articleData.category) articleData.category = "Trending";
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const updateData = pickArticlePayload(req.body);
    if (updateData.category === "") updateData.category = "Trending";
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true, strict: false }
    );
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
