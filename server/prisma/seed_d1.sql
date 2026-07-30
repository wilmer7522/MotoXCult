PRAGMA foreign_keys = OFF;

INSERT OR REPLACE INTO "User" (id, email, password, name, nickname, bio, location, birthDate, country, city, phone, club, avatar, karma, role, resetToken, resetTokenExpiry) VALUES 
(5, 'wilmer7522@gmail.com', '$2b$10$Er8IyK6bdzoTEvBUEeCONe9MVSVLq9pjBHIY/hdYT8mDmGmdoG8q2', 'Wilmer Rojas', NULL, 'Motero apasionado', 'Cúcuta, Colombia', NULL, 'Colombia', 'Cúcuta', '+57 300 123 4567', 'Moto Club Cúcuta High Speed', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 1500, 'ADMIN', NULL, NULL);

INSERT OR REPLACE INTO "Bike" (id, brand, model, year, nickname, photo, plate, userId) VALUES 
(1, 'AKT', 'TT DS 200', 2023, 'VALIENTE', '/assets/garage-bg.jpg', 'PWL08F', 5),
(2, 'BMW', 'R1250GS', 2023, 'La Bestia', '/assets/garage-bg.jpg', NULL, 5),
(3, 'Harley Davidson', 'Iron 883', 2018, 'La Negra', '/assets/ride-map.jpg', NULL, 5);

INSERT OR REPLACE INTO "Club" (id, name, logo, coverImage, description, city, country, leaderId, memberCount, selectedPlan, paymentStatus, isSubscriptionActive, subscriptionExpiresAt, createdAt) VALUES 
(1, "GAIA'S BIKERS", '/assets/garage-bg.jpg', '/assets/garage-bg.jpg', 'Moto Club oficial registrado en la comunidad MotoXCult.', 'Cúa', 'Venezuela', 5, 12, 'monthly', 'APPROVED', 1, '2026-08-20T23:59:59.000Z', '2026-07-22 10:00:00');

PRAGMA foreign_keys = ON;