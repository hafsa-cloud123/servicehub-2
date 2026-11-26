// Fills the database with demo data so you can see the app working.
// Run it with:  npm run seed
// WARNING: it first DELETES all users, categories, services, bookings and reviews.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { DEMO_PROVIDER_EMAIL } = require('./constants');

const PASSWORD = process.env.SEED_PASSWORD || 'Password123';

const categories = [
  { name: 'Electrician', description: 'Wiring, repairs and installations' },
  { name: 'Plumber', description: 'Leaks, pipes and bathroom fittings' },
  { name: 'Home Tutor', description: 'One-to-one lessons at home' },
  { name: 'Salon & Beauty', description: 'Haircuts, styling and beauty services' },
  { name: 'Car Mechanic', description: 'Car repair and servicing' },
  { name: 'AC Repair', description: 'AC servicing, gas filling and repair' },
  { name: 'Cleaning', description: 'Home and office cleaning' },
  { name: 'Painter', description: 'Interior and exterior painting' },
];

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const sixDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// [title, category, description, price, duration, city, days, start, end]
const services = [
  ['House Wiring and Switch Repair', 'Electrician', 'Fix faulty switches, sockets and wiring problems. Tools and basic fittings included.', 1500, 60, 'Lahore', sixDays, '09:00', '18:00'],
  ['Ceiling Fan and Light Installation', 'Electrician', 'Installation of ceiling fans, tube lights and LED fixtures with a one-month service guarantee.', 1200, 45, 'Karachi', weekdays, '10:00', '17:00'],
  ['Leakage and Pipe Repair', 'Plumber', 'Water leakage, blocked drains and pipe replacement for kitchens and bathrooms.', 1800, 60, 'Lahore', sixDays, '08:00', '17:00'],
  ['Bathroom Fitting Service', 'Plumber', 'Commode, basin and shower fitting by an experienced plumber. Quality parts available on request.', 2500, 120, 'Islamabad', weekdays, '09:00', '16:00'],
  ['Matric Maths and Physics Tuition', 'Home Tutor', 'One-to-one home tuition for Matric students with weekly tests and parent feedback.', 2000, 60, 'Lahore', weekdays, '15:00', '20:00'],
  ['O Level English Tutor', 'Home Tutor', 'Essay writing, grammar and comprehension practice for O Level students.', 2500, 90, 'Karachi', sixDays, '14:00', '20:00'],
  ['Haircut and Styling at Home', 'Salon & Beauty', 'Professional haircut and styling at your home. Suitable for men and women.', 1500, 45, 'Islamabad', sixDays, '11:00', '19:00'],
  ['Car General Servicing', 'Car Mechanic', 'Oil change, filter replacement, brake check and general inspection at your doorstep.', 4500, 120, 'Lahore', sixDays, '09:00', '17:00'],
  ['AC Service and Gas Filling', 'AC Repair', 'Complete AC cleaning, gas pressure check and gas filling for split and window ACs.', 3000, 90, 'Karachi', sixDays, '09:00', '18:00'],
  ['Full Home Deep Cleaning', 'Cleaning', 'Deep cleaning of floors, kitchen, bathrooms and windows for apartments and houses.', 6000, 240, 'Lahore', weekdays, '09:00', '15:00'],
  ['Interior Wall Painting', 'Painter', 'Room painting with surface preparation and two coats. Price is per room.', 8000, 480, 'Islamabad', weekdays, '08:00', '17:00'],
];

const run = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is blocked in production because it deletes data.');
  }
  await connectDB();

  await Promise.all([User, Category, Service, Booking, Review].map((M) => M.deleteMany({})));
  await Promise.all([User, Category, Service, Booking, Review].map((M) => M.syncIndexes()));

  // User.create() runs the bcrypt hashing hook, so passwords are stored hashed.
  const [admin, provider, customer] = await User.create([
    { name: 'Admin User', email: 'admin@servicehub.test', password: PASSWORD, role: 'admin', city: 'Lahore' },
    { name: 'Demo Provider', email: DEMO_PROVIDER_EMAIL, password: PASSWORD, role: 'provider', city: 'Lahore', phone: '0300-0000000' },
    { name: 'Demo Customer', email: 'customer@servicehub.test', password: PASSWORD, role: 'customer', city: 'Lahore' },
  ]);

  const createdCategories = await Category.create(categories);
  const byName = Object.fromEntries(createdCategories.map((c) => [c.name, c._id]));

  await Service.create(
    services.map(([title, category, description, price, durationMinutes, city, workingDays, startTime, endTime]) => ({
      title, description, price, durationMinutes, city, workingDays, startTime, endTime,
      category: byName[category],
      provider: provider._id,
    }))
  );

  console.log('Seed complete:');
  console.log(`  ${createdCategories.length} categories, ${services.length} services, 3 users`);
  console.log('Demo logins (used from Week 3):');
  [admin, provider, customer].forEach((u) => console.log(`  ${u.role.padEnd(8)} ${u.email}  /  ${PASSWORD}`));
};

run()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
