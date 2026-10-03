// Facts about the café, used on the pages and in the structured data for search engines.
export const site = {
  url: 'https://benefi.cafe',
  name: 'Benefi Café',
  street: 'Yeni, Atatürk Blv. No:138',
  postcode: '09270',
  city: 'Didim',
  region: 'Aydın',
  country: 'TR',
  phone: '+90 555 692 43 15',
  email: 'info@benefi.cafe',
  instagram: 'https://www.instagram.com/benefi_cafe/',
  image: '/coffee.jpg',
  // Monday first, 24-hour clock.
  hours: [
    ['08:00', '24:00'],
    ['08:00', '24:00'],
    ['08:00', '24:00'],
    ['08:00', '24:00'],
    ['08:00', '24:00'],
    ['08:00', '24:00'],
    ['10:00', '24:00'],
  ] as const,
};
