const { getPrisma } = require('../db');

const prisma = {
  get giveaway() { return getPrisma().giveaway; },
  get ticket() { return getPrisma().ticket; }
};

exports.buyTicket = async (req, res) => {
  const { userId, giveawayId } = req.body;
  
  try {
    const ticketCount = await prisma.ticket.count({ where: { giveawayId } });
    const ticketNumber = ticketCount + 1; // Simple generation logic

    const ticket = await prisma.ticket.create({
      data: {
        number: ticketNumber,
        userId: parseInt(userId),
        giveawayId: parseInt(giveawayId),
        status: 'SOLD'
      }
    });

    res.json({ message: 'Ticket purchased successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing ticket', error: error.message });
  }
};
