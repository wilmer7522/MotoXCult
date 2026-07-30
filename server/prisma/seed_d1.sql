PRAGMA foreign_keys = OFF;

INSERT OR REPLACE INTO "User" (id, email, password, name, nickname, bio, location, birthDate, country, city, phone, club, avatar, karma, role, clubRole) VALUES 
(5, 'wilmer7522@gmail.com', '$2b$10$Er8IyK6bdzoTEvBUEeCONe9MVSVLq9pjBHIY/hdYT8mDmGmdoG8q2', 'Wilmer Rojas', 'Wilmer', 'Motero apasionado', 'Cúcuta, Colombia', '1988-05-12', 'Colombia', 'Cúcuta', '+57 300 123 4567', 'GAIA''S BIKERS', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 1500, 'ADMIN', 'Líder'),
(1, 'carlos@motoxcult.com', 'password123', 'Carlos R.', 'El Aventurero', 'Amante de las rutas largas', 'Medellín, Colombia', '1992-08-20', 'Colombia', 'Medellín', '+57 310 987 6543', 'GAIA''S BIKERS', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 850, 'USER', 'Miembro Oficial'),
(2, 'pedro@motoxcult.com', 'password123', 'Pedro Gómez', 'PedroG', 'Rutas por Venezuela', 'Cúa, Venezuela', '1990-03-15', 'Venezuela', 'Cúa', '+58 412 555 1234', 'GAIA''S BIKERS', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', 620, 'USER', 'Miembro Oficial'),
(3, 'ana@motoxcult.com', 'password123', 'Ana María Silva', 'AnaRider', 'Velocidad y pasión', 'Caracas, Venezuela', '1995-11-04', 'Venezuela', 'Caracas', '+58 414 444 8899', 'GAIA''S BIKERS', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', 940, 'USER', 'Miembro Oficial'),
(4, 'sofia@motoxcult.com', 'password123', 'Sofía López', 'SofiCustom', 'Rodando por la costa', 'Bogotá, Colombia', '1993-07-22', 'Colombia', 'Bogotá', '+57 315 222 3344', 'Moto Club Cúcuta High Speed', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 510, 'USER', 'Miembro Oficial'),
(6, 'javier@motoxcult.com', 'password123', 'Javier Rodríguez', 'JaviMoto', 'Fanático del touring', 'Cúcuta, Colombia', '1989-01-30', 'Colombia', 'Cúcuta', '+57 320 777 9900', 'Moto Club Cúcuta High Speed', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300', 780, 'USER', 'Miembro Oficial'),
(7, 'diego@motoxcult.com', 'password123', 'Diego Mendoza', 'DiegoRider', 'Motero libre', 'Bucaramanga, Colombia', '1996-09-18', 'Colombia', 'Bucaramanga', '+57 311 666 4433', NULL, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', 320, 'USER', NULL),
(8, 'valentina@motoxcult.com', 'password123', 'Valentina Torres', 'Valen', 'En busca de un moto club', 'Barquisimeto, Venezuela', '1997-12-10', 'Venezuela', 'Barquisimeto', '+58 424 111 2233', NULL, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300', 410, 'USER', NULL),
(9, 'mateo@motoxcult.com', 'password123', 'Mateo Morales', 'TeoBike', 'Amante de las Enduro', 'Cali, Colombia', '1991-04-25', 'Colombia', 'Cali', '+57 318 999 1122', NULL, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300', 290, 'USER', NULL);

INSERT OR REPLACE INTO "Bike" (id, brand, model, year, nickname, photo, plate, userId) VALUES 
(1, 'AKT', 'TT DS 200', 2023, 'VALIENTE', '/assets/garage-bg.jpg', 'PWL08F', 5),
(2, 'BMW', 'R1250GS', 2023, 'La Bestia', '/assets/garage-bg.jpg', NULL, 5),
(3, 'Harley Davidson', 'Iron 883', 2018, 'La Negra', '/assets/ride-map.jpg', NULL, 5),
(4, 'Yamaha', 'MT-09', 2024, 'Hyper Naked', '/assets/garage-bg.jpg', 'KMX90', 1),
(5, 'Suzuki', 'V-Strom 650', 2022, 'La Viajera', '/assets/garage-bg.jpg', 'VZ88A', 2),
(6, 'Kawasaki', 'Z900', 2023, 'Verde Ninja', '/assets/ride-map.jpg', 'AA109', 3),
(7, 'Honda', 'CB500X', 2021, 'Red Explorer', '/assets/garage-bg.jpg', 'BGT12', 4);

INSERT OR REPLACE INTO "Club" (id, name, logo, banner, description, city, country, leaderId, selectedPlan, paymentStatus, isSubscriptionActive, subscriptionExpiresAt, createdAt) VALUES 
(1, "GAIA'S BIKERS", '/assets/garage-bg.jpg', '/assets/garage-bg.jpg', 'Moto Club oficial registrado en la comunidad MotoXCult.', 'Cúa', 'Venezuela', 5, 'monthly', 'APPROVED', 1, '2026-08-20T23:59:59.000Z', '2026-07-22 10:00:00'),
(2, 'Moto Club Cúcuta High Speed', '/assets/garage-bg.jpg', '/assets/garage-bg.jpg', 'Moto Club de alta cilindrada en Cúcuta.', 'Cúcuta', 'Colombia', 5, 'annual', 'APPROVED', 1, '2027-12-31T23:59:59.000Z', '2026-07-01 10:00:00');

PRAGMA foreign_keys = ON;