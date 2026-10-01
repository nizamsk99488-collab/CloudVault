const File = require("../models/File");
const { v2: cloudinary } = require("cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// Upload File
const uploadFile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const newFile = await File.create({
      userId,
      fileName: req.file.originalname,
      filePath: result.secure_url,
      cloudinaryPublicId: result.public_id,
      resourceType: result.resource_type,
    });

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

    if (!file.filePath) {
      return res.status(404).json({
        message: "File URL not found",
      });
    }

    res.redirect(file.filePath);
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

    if (file.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
        resource_type: file.resourceType || "image",
      });
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