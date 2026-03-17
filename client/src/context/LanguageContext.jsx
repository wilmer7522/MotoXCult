import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  es: {
    nav: {
      home: 'Inicio',
      rides: 'Rodadas',
      forum: 'Foro',
      garage: 'Garaje',
      shop: 'Tienda',
      login: 'Ingresar',
      join: 'Unirse'
    },
    home: {
      heroTitle: 'Más que motos,',
      heroSubtitle: 'una hermandad global.',
      cta: 'Crea tu Cuenta Gratis',
      nextRides: 'Próximas Rodadas',
      lastThreads: 'Últimos Debates en el Foro',
      viewDetails: 'Ver Detalles'
    },
    garage: {
      title: 'Mi Garaje',
      addBike: 'Agregar Moto',
      karma: 'Karma',
      myGarage: 'Mi Garaje',
      myRides: 'Mis Rodadas',
      messages: 'Mensajes',
      settings: 'Ajustes'
    },
    forum: {
      title: 'Últimos Temas',
      newTopic: 'Nuevo Tema',
      categories: 'Categorías Principales',
      searchPlaceholder: 'Buscar con temas del foro',
      statReplies: 'Respuestas',
      statViews: 'Vistas',
      lastPost: 'Último post'
    },
    shop: {
      supportTitle: 'Apoya a la Comunidad',
      supportDesc: 'Tu contribución nos ayuda a mantener los servidores y organizar mejores rodadas.',
      rafflesTitle: 'Sorteos Activos 🎟️',
      membershipTitle: 'Membresía Premium',
      buyTicket: 'Comprar Boleta',
      joinNow: 'Unirme Ahora'
    },
    rides: {
      title: 'Rodadas',
      newRide: 'Crear Nueva Rodada',
      date: 'Fecha',
      type: 'Tipo de Rodada',
      difficulty: 'Dificultad',
      distance: 'Distancia',
      upcoming: 'Rodadas Próximas',
      confirmed: 'confirmados'
    },
    auth: {
      loginTitle: 'Bienvenido de Nuevo',
      registerTitle: 'Únete a la Hermandad',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      name: 'Nombre Completo',
      birthDate: 'Fecha de Nacimiento',
      country: 'País',
      city: 'Ciudad',
      phone: 'Teléfono',
      club: 'Moto Club (Ej. LOS REYES)',
      loginBtn: 'Ingresar',
      registerBtn: 'Crear Cuenta',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      error: 'Error en la autenticación'
    },
    common: {
      language: 'Idioma'
    }
  },
  en: {
    nav: {
      home: 'Home',
      rides: 'Rides',
      forum: 'Forum',
      garage: 'Garage',
      shop: 'Shop',
      login: 'Login',
      join: 'Join'
    },
    home: {
      heroTitle: 'More than bikes,',
      heroSubtitle: 'a global brotherhood.',
      cta: 'Create Free Account',
      nextRides: 'Upcoming Rides',
      lastThreads: 'Latest Forum Topics',
      viewDetails: 'View Details'
    },
    garage: {
      title: 'My Garage',
      addBike: 'Add Bike',
      karma: 'Karma',
      myGarage: 'My Garage',
      myRides: 'My Rides',
      messages: 'Messages',
      settings: 'Settings'
    },
    forum: {
      title: 'Latest Topics',
      newTopic: 'New Topic',
      categories: 'Main Categories',
      searchPlaceholder: 'Search forum topics',
      statReplies: 'Replies',
      statViews: 'Views',
      lastPost: 'Last post'
    },
    shop: {
      supportTitle: 'Support the Community',
      supportDesc: 'Your contribution helps us keep the servers running and organize better rides.',
      rafflesTitle: 'Active Raffles 🎟️',
      membershipTitle: 'Premium Membership',
      buyTicket: 'Buy Ticket',
      joinNow: 'Join Now'
    },
    rides: {
      title: 'Rides',
      newRide: 'Create New Ride',
      date: 'Date',
      type: 'Ride Type',
      difficulty: 'Difficulty',
      distance: 'Distance',
      upcoming: 'Upcoming Rides',
      confirmed: 'confirmed'
    },
    auth: {
      loginTitle: 'Welcome Back',
      registerTitle: 'Join the Brotherhood',
      email: 'Email Address',
      password: 'Password',
      name: 'Full Name',
      birthDate: 'Date of Birth',
      country: 'Country',
      city: 'City',
      phone: 'Phone Number',
      club: 'Riding Club (e.g. THE KINGS)',
      loginBtn: 'Login',
      registerBtn: 'Register',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      error: 'Authentication error'
    },
    common: {
      language: 'Language'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('es');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'es' ? 'en' : 'es'));
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
