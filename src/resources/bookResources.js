// Modules
const express = require("express");
const BookResources = express.Router();

//Controllers
const { BookControllers } = require("../controllers");

//Middleware
const { check } = require("express-validator");

///Custom Middleware to check input data types
const validateInput = (req, res, next) => {
  const { body } = req;
  let errorArray = [];
  if (typeof body.author !== "string") {
    errorArray.push({
      message: "Ups! author should be a string!",
    });
  }
  if (typeof body.title !== "string") {
    errorArray.push({
      message: "Ups! title should be a string!",
    });
  }
  if (typeof body.year !== "number") {
    errorArray.push({
      message: "Ups! year should be a number!",
    });
  }

  if (errorArray.length === 0) {
    return next();
  } else {
    return res.status(400).json({
      error: errorArray.map((element) => {
        return element.message;
      }),
    });
  }
};

///Third Party Middleware - Express Validator
const checkBook = [
  check("title", "title should be at least 2 characters long")
    .isLength({ min: 2 })
    .trim(),
  check("author", "author should be at least 2 characters long")
    .isLength({ min: 2 })
    .trim(),
  check(
    "year",
    "year should be larger than 1454 and less or equal than 2021"
  ).isInt({ min: 1455, max: 2021 }),
];

const validateBook = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((element) => {
        return element.msg;
      }),
    });
  }
  return next();
};

//All book resources
BookResources.get("/", BookControllers.getAll);
BookResources.post(
  "/",
  validateInput,
  checkBook,
  validateBook,
  BookControllers.createBook
);
BookResources.get("/:guid", BookControllers.getByGuid);
BookResources.put(
  "/:guid",
  validateInput,
  checkBook,
  validateBook,
  BookControllers.updateBook
);
BookResources.delete("/:guid", BookControllers.deleteBook);

module.exports = BookResources;
