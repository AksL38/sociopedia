import User from '../models/User.js';

// READ

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)),
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => ({
        id,
        firstName,
        lastName,
        location,
        occupation,
        picturePath,
      }),
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friend)) {
      user.friends = user.friends.filter((friend) => friend !== friendId);
      friend.friends = friend.friends.filter((friend) => friend !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
