const File = require("../models/File");
const fs = require("fs");
const path = require("path");

// Upload File
const uploadFile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const newFile = await File.create({
      userId,
      fileName: req.file.originalname,
      filePath: req.file.filename,
    });

    res.status(200).json({
      message: "File uploaded successfully",
      file: newFile,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Files
const getFiles = async (req, res) => {
  try {
    const { userId } = req.query;

    const files = await File.find({ userId });

    res.status(200).json(files);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Download File
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.download(
      path.join(__dirname, "../uploads", file.filePath),
      file.fileName
    );

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete File
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const fileLocation = path.join(__dirname, "../uploads", file.filePath);

    if (fs.existsSync(fileLocation)) {
      fs.unlinkSync(fileLocation);
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "File deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
};