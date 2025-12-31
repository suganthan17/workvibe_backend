// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'profile-pics');

// ensure directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // use user id + timestamp + ext to avoid collisions
    const userId = req.session?.user?.id || 'anon';
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${userId}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

// Filter only images
function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|webp/;
  const mimetype = allowed.test(file.mimetype);
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, jpg, png, webp).'));
}

const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB max
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
