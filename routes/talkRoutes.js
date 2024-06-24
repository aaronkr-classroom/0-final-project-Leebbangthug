"use strict";

const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const talksController = require("../controllers/talksController");

// Index route
router.get("/", talksController.index, talksController.indexView);

// New route
router.get("/new", talksController.new);

// Create route with validation middleware
router.post(
  "/create",
  [
    body("meta.title").notEmpty().withMessage("Title is required"),
    // 다른 필드에 대한 유효성 검사 규칙 추가
  ],
  talksController.create,
  talksController.redirectView
);

// Show route
router.get("/:id", talksController.show, talksController.showView);

// Edit route
router.get("/:id/edit", talksController.edit);

// Update route
router.put("/:id/update", talksController.update, talksController.redirectView);

// Delete route
router.delete("/:id/delete", talksController.delete, talksController.redirectView);

module.exports = router;
