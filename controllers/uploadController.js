import path from "path";
import fs from "fs";

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Construct the file URL (assuming the server is running on the same host)
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/articles/${req.file.filename}`;
  
  res.status(200).json({
    message: "File uploaded successfully",
    url: fileUrl,
    filename: req.file.filename
  });
};

export const getUploadedFiles = (req, res) => {
  const uploadDir = path.join(process.cwd(), "uploads", "articles");
  
  if (!fs.existsSync(uploadDir)) {
    return res.status(200).json({ files: [] });
  }

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Failed to list files" });
    }

    const fileList = files.map(file => ({
      name: file,
      url: `${req.protocol}://${req.get("host")}/uploads/articles/${file}`
    }));

    res.status(200).json({ files: fileList });
  });
};
