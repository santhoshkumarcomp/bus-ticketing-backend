const homeController = {
  get: (req, res) => {
    res.send("response for get req");
  },
  post: (req, res) => {
    res.send("response for post");
  },
};

module.exports = homeController;
