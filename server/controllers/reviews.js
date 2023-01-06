var models = require('../models/reviews');
const axios = require('axios')

module.exports = {
  getAll: function (req, res) {
    const id = req.query.product_id
    const page = req.query.page || 0
    const count = req.query.count || 5
    models.getAll((data)=> {
      res.status(200).send(data.rows)
    },  id, page, count)
  },
  getMeta: function (req, res) {
    const productid = req.query.product_id
    models.getMeta((data)=> {
      res.status(200).send(data)

    }, productid)
  },


    postReview: (req, res) => {

      const { body } = req;

      const newReview = {
        product_id: body.product_id,
        rating: body.rating > 0 && body.rating <= 5 ? body.rating : null,
        summary: body.summary || '',
        body: body.body.length && body.body.length <= 1000 ? body.body : null,
        recommend: typeof body.recommend === 'boolean' ? body.recommend : null,
        reviewer_name: body.reviewer_name.length && body.reviewer_name.length <= 60 ? body.reviewer_name : null,
        reviewer_email: body.reviewer_email.length && body.reviewer_email.length <= 60 ? body.reviewer_email : null,
      };
      if (Object.values(newReview).indexOf(null) !== -1) {
        res.status(404).send();
      } else {
        newReview.response = null; // reviews
        newReview.date = Math.floor(new Date().getTime() / 1000); // reviews
        newReview.reported = false; // reviews
        newReview.helpfulness = 0; // reviews
        newReview.photos = body.photos;
        newReview.characteristics = body.characteristics;
      }
      postReview((err, results) => {
        if (err) {
          console.log('error in controllers postReview ', err);
          res.status(404).send(err);
        } else {
          console.log('success in controllers postReview ', results);
          res.status(201).send();
        }
      }, newReview);
    },
    updateReview: (req, res) => {

      updateReview((err, results) => {
        if (err) {
          console.log('ERROR IN updateReview ', err);
          res.status(404).send(err);
        } else {
          console.log('SUCCESS', results);
          res.status(204).send();
        }
      }, req.params);
    },
    reportReview: (req, res) => {

      reportReview((err, results) => {
        if (err) {
          console.log('ERROR IN REPORT REVIEW', err);
          res.status(404).send(err);
        } else {
          console.log('SUCCESS', results);
          res.status(204).send();
        }
      }, req.params);
    },
  };



