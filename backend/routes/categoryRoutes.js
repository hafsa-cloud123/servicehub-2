const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

const router = express.Router();

const idRule = param('id').isMongoId().withMessage('Invalid category id');
const categoryRules = [
  body('name').trim().isLength({ min: 2, max: 40 }).withMessage('Category name must be 2 to 40 characters'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 200 }).withMessage('Description cannot be longer than 200 characters'),
];

router.get('/', getCategories);
router.post('/', categoryRules, validate, createCategory);
router.put('/:id', idRule, categoryRules, validate, updateCategory);
router.delete('/:id', idRule, validate, deleteCategory);

module.exports = router;
