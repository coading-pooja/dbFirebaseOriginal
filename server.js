const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-node-4cbfc-default-rtdb.firebaseio.com"
});

const db = admin.database();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, phone, email, dob } = req.body;
  
  const newContactRef = db.ref('contactForm').push();
  newContactRef.set({
    name: name,
    phone: phone,
    email: email,
    dob: dob
  })
  .then(() => {
    res.status(200).send('Form submitted successfully');
  })
  .catch((error) => {
    console.error('Error writing to database', error);
    res.status(500).send('Error submitting form');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
