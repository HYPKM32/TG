const express = require('express');
const router = express.Router();
const multer = require('multer');
const snapController = require('../controllers/snapController');

// multer 설정
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }  // 5MB
});

// multer 미들웨어를 미리 적용하지 않고 라우터에서 직접 적용
router.post('/process', upload.single('image'), snapController.processImage);
router.post('/save/:userId/:fridgeName/:foodName', snapController.putfridge)

module.exports = router;