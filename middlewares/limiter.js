const limiter = require('express-rate-limit');

module.exports = limiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
