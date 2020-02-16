const express = require('express');
const { check, validationResult, matchedData } = require('express-validator');
const csrf = require('csurf');
const multer = require('multer');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contact', csrfProtection, (req, res) => {
  res.render('contact', {
    data: {},
    errors: {},
    csrfToken: req.csrfToken(),
  });
});

router.post('/contact', upload.single('photo'), csrfProtection, [
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
      csrfToken: req.csrfToken(),
    });
  }

  if (req.file) {
    console.log('Uploaded: ', req.file);
  }

  const data = matchedData(req);
  console.log('Sanitized:', data);

  req.flash('success', `Thanks for the message! Here's what you provided: ${JSON.stringify(data)}`);
  res.redirect('/');
});

router.get('/submit-form', (req, res) => {
  res.render('submit-form', {
    data: {},
    errors: {},
  });
});

router.post('/submit-form', [
  check('username')
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .trim(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('submit-form', {
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
