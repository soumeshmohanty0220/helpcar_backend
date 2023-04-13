const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const admin = require("firebase-admin");
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://helpcar-e85a5-default-rtdb.firebaseio.com"
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Create new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    
    // Save user data in Firebase Realtime Database
    await admin
      .database()
      .ref("users")
      .child(userRecord.uid)
      .set({
        name: name,
        email: email,
        phone: phone,
      });

    console.log("Successfully created new user:", userRecord.uid);
    res.send("Registration successful!");
  } catch (error) {
    console.log("Error creating new user:", error);
    res.status(400).send("Registration failed!");
  }
});

app.listen(8080, () => {
  console.log(`Server listening on port 8080`);
});
