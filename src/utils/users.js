const users = [];

const addUser = ({ id, username, room } = null) => {
  //Validate username and room
  if (!username || !room || !username.trim() || !room.trim()) {
    return { error: "username and room are required!" };
  }

  //Clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate existing user
  const isExistingUser = users.some(
    (user) => user.username === username && user.room === room
  );
  if (isExistingUser) {
    return { error: "username already present in room!" };
  }

  //store user
  const user = { id, username, room };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  let foundUser;
  if (!users) {
    return foundUser;
  }

  foundUser = users.find((user) => user.id === id);
  return foundUser;
};

const getUsersInRoom = (room) => {
  let foundUsers;
  if (!users || !room) {
    return foundUsers;
  }
  foundUsers = users.filter((user) => user.room === room.trim().toLowerCase());
  return foundUsers;
};

const clearUsers = (room) => {
  users.splice(0, users.length);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  clearUsers,
};
