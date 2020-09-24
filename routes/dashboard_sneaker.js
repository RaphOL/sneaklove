const express = require("express"); // import express in this module
const router = new express.Router(); // create an app sub-module (router)
const fileUploader = require("../config/cloudinary");
const Sneaker = require("../models/Sneaker");
const Tag = require("../models/Tag");

router.get("/prod-manage", async (req, res, next) => {
  try {
    const dashShoes = await Sneaker.find();
    res.render("products_manage", { sneakers: dashShoes });
  } catch (error) {
    next(error);
  }
});

router.get("/prod-add", async (req, res, next) => {
  try {
    const tagDocuments = await Tag.find();
    res.render("products_add", { tags: tagDocuments });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/prod-add",
  fileUploader.single("image"),
  async (req, res, next) => {
    const newShoe = req.body;
    if (req.file) {
      newShoe.image = req.file.path;
    }
    try {
      const createShoe = await Sneaker.create(newShoe);
      res.redirect("/prod-manage");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/product-delete/:id", (req, res, next) => {
  const SneakerId = req.params.id;
  Sneaker.findByIdAndDelete(SneakerId)
    .then((dbResult) => {
      res.redirect("/prod-manage");
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/product-edit/:id", async (req, res, next) => {
  try {
    const tagDocuments = await Tag.find();
    const sneakerId = req.params.id;
    dbresult = await Sneaker.findById(sneakerId).populate("Tag");
    Sneaker.findByIdAndUpdate(sneakerId);
    res.render("product_edit", { sneaker: dbresult, tags: tagDocuments });
  } catch (error) {
    next(error);
  }
});

router.post("/product-edit/:id", async (req, res, next) => {
  try {
    const sneakerId = req.params.id;
    const updatedSneaker = await Sneaker.findByIdAndUpdate(sneakerId, req.body);
    res.redirect("/prod-manage");
  } catch (error) {
    next(error);
  }
});

router.post("/tag-add", async (req, res, next) => {
  try {
    const newTag = req.body;
    const createTag = await Tag.create(newTag);
    res.redirect("prod-add");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
