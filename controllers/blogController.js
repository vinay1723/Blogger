const Blogs = require("../models/blogModel");

exports.myblogs = async (req, res, next) => {
  try {
    const allblogs = await Blogs.find({ userId: req.user._id });
    res.render("myblogs", { blogs: allblogs, message: null });
  } catch (err) {
    res.render("myblogs", { blogs: null, message: "failed to fetch blogs" });
  }
  // res.render("myblogs", { blogs: null });
};

exports.home = async (req, res) => {
  const perPage = 5;
  const page = req.query.page || 1;
  const sort = req.query.sort || "title";
  try {
    const blogs = await Blogs.find()
      .skip(page * perPage - perPage)
      .sort({ [sort]: 1 })
      .limit(perPage);

    const count = await Blogs.countDocuments();
    const totalPages = Math.ceil(count / perPage);
    if (blogs) {
      res.render("home", {
        blogs: blogs,
        current: page,
        pages: totalPages,
        sort: sort,
      });
    } else {
      throw new Error("no blogs found");
    }
  } catch (err) {
    console.log(err.message);
    res.render("home", {
      blogs: [],
      message: err.message,
      pages: 0,
      current: 1,
      sort: "",
    });
  }
  // res.render("home");
};

exports.addblogs = (req, res, next) => {
  res.render("addblog", { message: null });
};

exports.editBlogPage = async (req, res, next) => {
  const blog = await Blogs.findById(req.params.id);
  res.render("editblogpage", { message: null, id: req.params.id, blog: blog });
};

exports.editBlog = async (req, res, next) => {
  try {
    const id = req.params.id;

    await Blogs.findByIdAndUpdate(id, req.body, {
      new: true, // return updated doc
      runValidators: true, // ensure schema rules apply
    });

    res.redirect("/blogs/myblogs");
  } catch (err) {
    console.log(err.message);
    res.render("editblogpage", {
      message: "cannot edit now please try again later",
      id: req.params.id,
    });
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const newBlog = await Blogs.create(req.body);
    if (newBlog) {
      res.redirect("/blogs/myblogs");
    } else {
      res.render("addblog", { message: "cannot create blog at this moment" });
    }
  } catch (err) {
    res.render("addblog", { message: err.message });
  }
};

exports.deleteBlog = async (req, res, next) => {
  console.log(req.params.id);
  try {
    await Blogs.findByIdAndDelete(req.params.id);
    res.redirect("/blogs/myblogs");
  } catch (err) {
    console.log(err);
  }
};
