const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        bikes: {
          include: { photos: true }
        }
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, birthDate, country, city, phone, club, bio, location, nickname } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        country,
        city,
        phone,
        club: club ? club.toUpperCase() : undefined,
        bio,
        location,
        nickname
      },
      include: {
        bikes: true
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.addBike = async (req, res) => {
  const { brand, model, year, nickname, photo } = req.body;
  try {
    const bike = await prisma.bike.create({
      data: {
        brand,
        model,
        year: parseInt(year),
        nickname,
        photo,
        userId: req.user.id
      }
    });
    res.status(201).json(bike);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bike', error: error.message });
  }
};

exports.deleteBike = async (req, res) => {
  try {
    const bike = await prisma.bike.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!bike || bike.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized or bike not found' });
    }

    await prisma.bike.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bike', error: error.message });
  }
};

