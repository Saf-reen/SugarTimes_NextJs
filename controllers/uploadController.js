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

// Moves the file into uploads/articles/archive so it disappears from the
// Media Explorer gallery but stays reachable at the same /uploads/articles/<name>
// URL (server.js serves the archive directory as a fallback static root).
// This keeps images in already-published articles intact.
export const hideFile = (req, res) => {
  const { filename } = req.params;
  const uploadDir = path.join(process.cwd(), "uploads", "articles");
  const archiveDir = path.join(uploadDir, "archive");

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const oldPath = path.join(uploadDir, filename);
  const newPath = path.join(archiveDir, filename);

  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ message: "File not found" });
  }

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to hide file" });
    }
    res.status(200).json({ message: "File hidden from gallery successfully" });
  });
};

export const getUploadedFiles = (req, res) => {
  const uploadDir = path.join(process.cwd(), "uploads", "articles");
  
  if (!fs.existsSync(uploadDir)) {
    return res.status(200).json({ files: [] });
  }

  // Use withFileTypes to filter out directories (like 'archive')
  fs.readdir(uploadDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return res.status(500).json({ message: "Failed to list files" });
    }

    const files = entries
      .filter(entry => entry.isFile())
      .map(entry => ({
        name: entry.name,
        url: `${req.protocol}://${req.get("host")}/uploads/articles/${entry.name}`
      }));

    res.status(200).json({ files });
  });
};
