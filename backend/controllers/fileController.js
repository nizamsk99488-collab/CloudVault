const File = require("../models/File");
const fs = require("fs");
const path = require("path");

// Upload File
const uploadFile = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("UPLOAD REQUEST");
    console.log("User ID:", userId);
    console.log("File:", req.file);

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

    console.log("File saved to MongoDB:", newFile);

    res.status(200).json({
      message: "File uploaded successfully",
      file: newFile,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

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
    console.log("GET FILES ERROR:", error);

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

    const fileLocation = path.join(
      __dirname,
      "../uploads",
      file.filePath
    );

    console.log("Downloading:", fileLocation);

    res.download(
      fileLocation,
      file.fileName,
      (error) => {
        if (error) {
          console.log("DOWNLOAD ERROR:", error);

          if (!res.headersSent) {
            res.status(500).json({
              message: "File download failed",
            });
          }
        }
      }
    );

  } catch (error) {
    console.log("DOWNLOAD ERROR:", error);

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

    const fileLocation = path.join(
      __dirname,
      "../uploads",
      file.filePath
    );

    console.log("Deleting:", fileLocation);

    if (fs.existsSync(fileLocation)) {
      fs.unlinkSync(fileLocation);
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "File deleted successfully",
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);

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