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
  // Position of the Google Maps entry "Benefi Cafe".
  geo: { latitude: 37.3708502, longitude: 27.2681505 },
  maps: 'https://maps.google.com/?cid=290700912312207222',
  instagram: 'https://www.instagram.com/benefi_cafe/',
  // Created by helper_skripts/image_converter/image_converter.py
  image: '/og_image.jpg',
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
