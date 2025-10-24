const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});
router.post('/image', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'saree-website',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }
        
        res.json({
          message: 'Image uploaded successfully',
          imageUrl: result.secure_url,
          publicId: result.public_id
        });
      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/images', authenticateAdmin, upload.array('images', 10), async (req, res) => {
  try {
    console.log('Upload request received:', {
      filesCount: req.files ? req.files.length : 0,
      adminId: req.admin?.id
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    console.log('Processing', req.files.length, 'files for upload');

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        console.log(`Uploading file ${index + 1}:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'saree-website',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' }
            ],
            timeout: 120000 // 2 minutes timeout for Cloudinary
          },
          (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error for file ${index + 1}:`, error);
              reject(error);
            } else {
              console.log(`File ${index + 1} uploaded successfully:`, result.secure_url);
              resolve({
                imageUrl: result.secure_url,
                publicId: result.public_id
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    console.log('All files uploaded successfully:', results.length);

    res.json({
      message: 'Images uploaded successfully',
      images: results
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    
    if (error.message && error.message.includes('timeout')) {
      res.status(408).json({ message: 'Upload timeout. Please try with smaller images.' });
    } else if (error.message && error.message.includes('size')) {
      res.status(413).json({ message: 'File too large. Maximum size is 10MB per image.' });
    } else {
      res.status(500).json({ message: 'Upload failed. Please try again.' });
    }
  }
});
router.delete('/image/:publicId', authenticateAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
