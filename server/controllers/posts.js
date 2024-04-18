import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    const user = User.findById(userId);

    const newPost = new Post({
      userId,
      description,
      picturePath,
      firstName: user.firstNmae,
      lastName: user.LastName,
      location: user.location,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const posts = Post.find();

    res.status(201).json(posts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// export const editPost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const { title, description, picturePath } = req.body;

//     const post = await Post.findById(id);
//     if (post.userId !== userId) {
//       return res.status(400).send('This post doesnt belong to this user!');
//     }

//     const updatedPost = await Post.findByIdAndUpdate(
//       id,
//       {
//         userId,
//         title,
//         description,
//         picturePath,
//       },
//       { new: true },
//     );

//     res.status(200).json(updatedPost);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (post.userId !== userId) {
      return res.status(400).send('This post doesnt belong to this user!');
    }

    const deletedPost = await Post.findByIdAndUpdate(id);

    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.send(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(id);

    if (post.likes.get(userId)) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        likes: post.likes,
      },
      { new: true },
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
