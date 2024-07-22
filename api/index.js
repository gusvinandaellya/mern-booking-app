const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "dsbfhdjbf387483yrv8r83bv8748348783vyrvgfvgd";

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) reject(err);
      resolve(userData);
    });
  });
}

app.get('/test', (req, res) => {
  res.json('Test OK');
});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt)
    });

    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const userDoc = await User.findOne({email});

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id,
      }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('Wrong password');
    }

  } else {
    res.json('user not found');
  }
});

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name, email, _id} = await User.findById(userData.id);
      res.json({name, email, _id});
    });
  } else {
    res.json(null);
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('token').json('Logged out');
});

app.post('/upload-by-links', async (req, res) => {
  const { links } = req.body;

  if (!Array.isArray(links)) {
    return res.status(400).json({ error: 'Links should be provided as an array' });
  }

  const newNames = [];
  for (let i = 0; i < links.length; i++) {
    const newName = 'photo' + Date.now() + i + '.jpg';
    try {
      await imageDownloader.image({
        url: links[i],
        dest: __dirname + '/uploads/' + newName
      });
      newNames.push(newName);
    } catch (err) {
      console.error(`Error downloading image from ${links[i]}:`, err);
      newNames.push(null); // or handle the error as needed
    }
  }

  res.json(newNames);
});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''));
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const {token} = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      photos: addedPhotos,
      title, address, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc);
  });
})

app.get('/user-places', async (req, res) => {
  const { token } = req.cookies;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified
  const skip = (page - 1) * limit;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { id } = userData;

    try {
      const places = await Place.find({ owner: id }).skip(skip).limit(limit);
      const totalItems = await Place.countDocuments({ owner: id });

      res.json({
        places,
        pageInfo: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          last_pagetotalPages: Math.ceil(totalItems / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const {token} = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        photos: addedPhotos,
        title, address, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price
      });
      await placeDoc.save();
      res.json(placeDoc);
    }
  });
});

app.get('/places', async (req, res) =>{
  res.json(await Place.find());
})

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut,
    guests, name, phone, price
  } = req.body;

  Booking.create({
    place, checkIn, checkOut,
    guests, name, phone, price, user: userData.id
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
})

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({user: userData.id}).populate('place'));
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});