import path from "path";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    url: req.file.path,
    filename: req.file.filename.replace("SugarTimes/articles/", "")
  });
};

// We use Cloudinary tags to "hide" files from the Media Explorer.
export const hideFile = async (req, res) => {
  const { filename } = req.params;
  const publicId = `SugarTimes/articles/${filename}`;
  
  try {
    // Add "hidden" tag to the image so it doesn't appear in the gallery
    await cloudinary.uploader.add_tag("hidden", [publicId]);
    res.status(200).json({ message: "File hidden from gallery successfully" });
  } catch (error) {
    console.error("Cloudinary Hide Error:", error);
    res.status(500).json({ message: "Failed to hide file" });
  }
};

export const getUploadedFiles = async (req, res) => {
  try {
    // Search for resources in the folder, excluding those with the "hidden" tag
    const result = await cloudinary.search
      .expression('folder:"SugarTimes/articles" AND NOT tags:hidden')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    const files = result.resources.map((resource) => ({
      name: resource.public_id.replace("SugarTimes/articles/", ""),
      url: resource.secure_url
    }));

    res.status(200).json({ files });
  } catch (error) {
    console.error("Cloudinary Search Error:", error);
    res.status(500).json({ message: "Failed to list files" });
  }
};
