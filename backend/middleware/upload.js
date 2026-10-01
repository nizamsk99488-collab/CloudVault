const multer = require("multer");

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Configure upload
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

module.exports = upload;