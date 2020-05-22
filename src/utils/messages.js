const generateMessage = (text, username = "Admin") => {
  return {
    text,
    createdAt: new Date().getTime(),
    username,
  };
};

const generateLocationMessage = (url, username = "Admin") => {
  return {
    url,
    createdAt: new Date().getTime(),
    username,
  };
};

module.exports = { generateMessage, generateLocationMessage };
