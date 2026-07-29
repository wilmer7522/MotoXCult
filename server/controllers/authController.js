const { getPrisma } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = {
  get user() { return getPrisma().user; },
  get bike() { return getPrisma().bike; },
  get event() { return getPrisma().event; }
};

exports.register = async (req, res) => {
  const { email, password, name, birthDate, country, city, phone, club } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        birthDate: birthDate ? new Date(birthDate) : null,
        country,
        city,
        phone,
        club: club ? club.toUpperCase() : null
      },
      include: {
        bikes: true
      }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        birthDate: user.birthDate,
        country: user.country,
        city: user.city,
        phone: user.phone,
        club: user.club
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { bikes: true }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        birthDate: user.birthDate,
        country: user.country,
        city: user.city,
        phone: user.phone,
        club: user.club
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No existe un usuario registrado con este correo' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora de validez

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    console.log(`[AUTH] Reset token for ${email}: ${resetToken}`);

    res.json({
      message: 'Se ha generado el token de recuperación con éxito.',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Error procesando solicitud de recuperación', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'El token de recuperación es inválido o ha expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: 'Contraseña restablecida con éxito. Ya puedes iniciar sesión.' });
  } catch (error) {
    res.status(500).json({ message: 'Error restableciendo la contraseña', error: error.message });
  }
};

