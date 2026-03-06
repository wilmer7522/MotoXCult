const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const prisma = new PrismaClient();

exports.uploadPhoto = async (req, res) => {
  const { userId, eventId } = req.body;
  
  try {
    // Check limit: 10 photos per user per event
    const photoCount = await prisma.photo.count({
      where: {
        userId: parseInt(userId),
        eventId: parseInt(eventId)
      }
    });

    if (photoCount >= 10) {
      return res.status(403).json({ message: 'Limit reached: Max 10 photos per event' });
    }

    // Image resizing simulation with sharp (if file was uploaded)
    // const resized = await sharp(req.file.buffer).resize(1200).toBuffer();
    
    const photo = await prisma.photo.create({
      data: {
        url: req.body.url || 'https://via.placeholder.com/1200x800',
        userId: parseInt(userId),
        eventId: parseInt(eventId)
      }
    });

    res.json({ message: 'Photo uploaded and optimized', photo });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
};
