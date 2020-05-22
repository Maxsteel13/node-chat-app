const {
  addUser,
  removeUser,
  getUsersInRoom,
  clearUsers,
} = require("../src/utils/users");

beforeEach(() => {
  clearUsers();
});

test("addUser should not accept empty username and room", () => {
  const result = addUser({ id: 1 });
  expect(result.error).not.toBeUndefined();
});

test("addUser must not allow duplicate username", () => {
  addUser({ id: 1, username: "test user", room: "testroom" });
  const result = addUser({ id: 1, username: "Test User", room: "Testroom" });
  expect(result.error).not.toBeUndefined();
});

test("add user successfully returns user", () => {
  const result = addUser({
    id: 11,
    username: "test user 1",
    room: "testroom1",
  });

  expect(result).toMatchObject({
    id: 11,
    username: "test user 1",
    room: "testroom1",
  });
});

test("user should be removed when remove user is called", () => {
  addUser({ id: 1, username: "test1", room: "room1" });
  addUser({ id: 2, username: "test2", room: "room1" });
  addUser({ id: 3, username: "test3", room: "room1" });

  const result = removeUser(2);
  expect(result).toMatchObject({ id: 2, username: "test2", room: "room1" });
});

test("should get all users in room", () => {
  addUser({ id: 1, username: "test1", room: "room1" });
  addUser({ id: 2, username: "test2", room: "room1" });
  addUser({ id: 3, username: "test3", room: "room2" });

  const result = getUsersInRoom("room1");
  expect(result.length).toEqual(2);
});
