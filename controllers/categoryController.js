import Category from "../models/Category.js";

// GET /categories — public, returns tree structure
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort({ order: 1, createdAt: 1 });

    // Build tree: parent categories with their children nested
    const parents = categories.filter((c) => !c.parent);
    const tree = parents.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      emoji: p.emoji,
      color: p.color,
      order: p.order,
      children: categories
        .filter((c) => c.parent && c.parent.toString() === p._id.toString())
        .map((c) => ({
          _id: c._id,
          name: c.name,
          slug: c.slug,
          order: c.order,
        })),
    }));

    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /categories/all — admin, returns flat list including inactive
export const getAllCategoriesFlat = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name slug")
      .sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /categories — admin, create category
export const createCategory = async (req, res) => {
  try {
    const { name, slug, emoji, color, parent, order } = req.body;

    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: "Category slug already exists" });

    const category = await Category.create({
      name,
      slug,
      emoji: emoji || "",
      color: color || "from-emerald-500 to-teal-600",
      parent: parent || null,
      order: order ?? 0,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /categories/:id — admin, update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /categories/:id — admin, delete category and its children
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // If parent category, also delete all children
    if (!category.parent) {
      await Category.deleteMany({ parent: category._id });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
