const bcrypt = require('bcrypt');

const password = 'dpto yixl pckk qkts'; // Replace with the actual password you want to hash
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Generated hash:', hash);
  }
});