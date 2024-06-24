"use strict";

const { body, validationResult } = require("express-validator");
const Talk = require("../models/Talk");

module.exports = {
  index: (req, res, next) => {
    Talk.find()
      .then((talks) => {
        res.locals.talks = talks;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching talks: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("talks/index", {
      page: "talks",
      title: "All Talks",
    });
  },

  new: (req, res) => {
    res.render("talks/new", {
      page: "new-talk",
      title: "New Talk",
    });
  },

  create: [
    body("meta.title").notEmpty().withMessage("Title is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let talkParams = {
        meta: {
          title: req.body.meta.title,
          subtitle: req.body.meta.subtitle,
          abstractOneLine: req.body.meta.abstractOneLine,
          abstract: req.body.meta.abstract,
          keywords: req.body.meta.keywords,
        },
        given: {
          date: req.body.given.date,
          location: {
            name: req.body.given.location.name,
            korean: req.body.given.location.korean,
            url: req.body.given.location.url,
          },
          organization: {
            name: req.body.given.organization.name,
            korean: req.body.given.organization.korean,
            url: req.body.given.organization.url,
          },
          event: {
            name: req.body.given.event.name,
            korean: req.body.given.event.korean,
            url: req.body.given.event.url,
          },
        },
        links: {
          code: req.body.links.code,
          slides: req.body.links.slides,
          article: req.body.links.article,
        },
        talkImg: req.body.talkImg,
        user: req.body.user,
      };

      Talk.create(talkParams)
        .then((talk) => {
          res.locals.redirect = "/talks";
          res.locals.talk = talk;
          next();
        })
        .catch((error) => {
          console.log(`Error saving talk: ${error.message}`);
          next(error);
        });
    },
  ],

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let talkId = req.params.id;
    Talk.findById(talkId)
      .then((talk) => {
        res.locals.talk = talk;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching talk by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("talks/show", {
      page: "talk-details",
      title: "Talk Details",
    });
  },

  edit: (req, res, next) => {
    let talkId = req.params.id;
    Talk.findById(talkId)
      .then((talk) => {
        res.render("talks/edit", {
          talk: talk,
        });
      })
      .catch((error) => {
        console.log(`Error fetching talk by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let talkId = req.params.id;
    let talkParams = {
      meta: {
        title: req.body.meta.title,
        subtitle: req.body.meta.subtitle,
        abstractOneLine: req.body.meta.abstractOneLine,
        abstract: req.body.meta.abstract,
        keywords: req.body.meta.keywords,
      },
      given: {
        date: req.body.given.date,
        location: {
          name: req.body.given.location.name,
          korean: req.body.given.location.korean,
          url: req.body.given.location.url,
        },
        organization: {
          name: req.body.given.organization.name,
          korean: req.body.given.organization.korean,
          url: req.body.given.organization.url,
        },
        event: {
          name: req.body.given.event.name,
          korean: req.body.given.event.korean,
          url: req.body.given.event.url,
        },
      },
      links: {
        code: req.body.links.code,
        slides: req.body.links.slides,
        article: req.body.links.article,
      },
      talkImg: req.body.talkImg,
      user: req.body.user,
    };

    Talk.findByIdAndUpdate(talkId, { $set: talkParams })
      .then((talk) => {
        res.locals.redirect = `/talks/${talkId}`;
        res.locals.talk = talk;
        next();
      })
      .catch((error) => {
        console.log(`Error updating talk by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let talkId = req.params.id;
    Talk.findByIdAndRemove(talkId)
      .then(() => {
        res.locals.redirect = "/talks";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting talk by ID: ${error.message}`);
        next();
      });
  },
};
