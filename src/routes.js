const express = require('express');
const { check, validationResult, matchedData } = require('express-validator');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    data: {},
    errors: {},
  });
});

router.post('/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('That email doesn‘t look right')
    .bail()
    .trim()
    .normalizeEmail(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('contact', {
      data: req.body,
      errors: errors.mapped(),
    });
  }

  

  const data = matchedData(req);
  console.log('Sanitized:', data);

  req.flash('success', `Thanks for the message! Here's what you provided: ${JSON.stringify(data)}`);
  res.redirect('/');
});

module.exports = router;
