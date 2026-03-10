const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const prisma = new PrismaClient();

exports.uploadPhoto = async (req, res) => {
  const { eventId, bikeId } = req.body;
  const userId = req.user.id;
  
  try {
    if (!eventId && !bikeId) {
      return res.status(400).json({ message: 'Must provide either eventId or bikeId' });
    }

    const where = { userId };
    if (eventId) where.eventId = parseInt(eventId);
    if (bikeId) where.bikeId = parseInt(bikeId);

    const photoCount = await prisma.photo.count({ where });

    if (photoCount >= 10) {
      return res.status(403).json({ message: 'Limit reached: Max 10 photos per item' });
    }

    const photo = await prisma.photo.create({
      data: {
        url: req.body.url || 'https://via.placeholder.com/1200x800',
        userId,
        eventId: eventId ? parseInt(eventId) : null,
        bikeId: bikeId ? parseInt(bikeId) : null
      }
    });

    res.json({ message: 'Photo uploaded successfully', photo });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
};

