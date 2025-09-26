const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");

router.use(authController.protect);
router.route("/myblogs").get(blogController.myblogs);
router
  .route("/addblog")
  .get(blogController.addblogs)
  .post(blogController.createBlog);

router.route("/deleteblog/:id").get(blogController.deleteBlog);

router
  .route("/editblog/:id")
  .get(blogController.editBlogPage)
  .post(blogController.editBlog);

module.exports = router;
