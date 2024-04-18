import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import { register } from './controllers/auth.js';
import authroutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { verifyToken } from './middleware/auth.js';
import { createPost } from './controllers/posts.js';

// Uncomment following to insert dummy data one time and then recomment
// import User from './models/User.js';
// import Post from './models/Post.js';
// import { users, posts } from './data/index.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: 'true' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: 'true' }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILES
app.post('auth/register', upload.single('picture'), register);
app.post('posts', verifyToken, upload.single('picture'), createPost);

// ROUTES
app.use('/auth', authroutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server PORT: ${PORT}`);
    });

    // Uncomment following to insert dummy data one time and then recomment
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.log(`${err} \n Could not connect`);
  });
