const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { DAYS, TIME_REGEX } = require('../utils/constants');
const {
  getServices,
  getCities,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

const router = express.Router();

const idRule = param('id').isMongoId().withMessage('Invalid service id');

// Rules for the data sent when creating or updating a service
const serviceRules = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3 to 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10 to 1000 characters'),
  body('category').isMongoId().withMessage('Please choose a valid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a number, 0 or more'),
  body('durationMinutes').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('workingDays').isArray({ min: 1 }).withMessage('Select at least one working day'),
  body('workingDays.*').isIn(DAYS).withMessage('Working days must be Mon, Tue, Wed, Thu, Fri, Sat or Sun'),
  body('startTime').matches(TIME_REGEX).withMessage('Start time must be in HH:MM format'),
  body('endTime').matches(TIME_REGEX).withMessage('End time must be in HH:MM format'),
];

// Rules for the filters used when listing services
const listRules = [
  query('category').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid category id'),
  query('minPrice').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('minPrice must be a number, 0 or more'),
  query('maxPrice').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('maxPrice must be a number, 0 or more'),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('page must be 1 or more'),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50'),
];

router.get('/', listRules, validate, getServices);
router.get('/cities', getCities); // must be before '/:id' so "cities" is not read as an id
router.get('/:id', idRule, validate, getServiceById);
router.post('/', serviceRules, validate, createService);
router.put('/:id', idRule, serviceRules, validate, updateService);
router.delete('/:id', idRule, validate, deleteService);

module.exports = router;
