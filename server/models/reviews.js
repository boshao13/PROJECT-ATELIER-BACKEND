var db = require('../db/index');



module.exports = {


  getAll: function (callback, id, page, count) {
     return db.query(`SELECT *,(SELECT json_agg(photos) AS photos FROM (SELECT id, url FROM photos where review_id=reviews.id) photos) FROM reviews WHERE product_id=${id} LIMIT ${count} OFFSET ${page * count}`, (err, data) => {
      if (err) {
        console.log('error')
      } else {
        callback(data)
      }
     })
  },
  getMeta: (callback, id) => {
    console.log('inside models getMeta', id);
    const query = `SELECT count(*) FILTER (WHERE product_id = ${id} AND recommend) FROM reviews`;
    const metaObj = {};
    metaObj.product_id = id;
    metaObj.ratings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    metaObj.recommended = {
      false: 0,
      true: 0,
    };
    metaObj.characteristics = {};
    Promise.all(Array.from({ length: 5 }, (_, i) => i + 1).map(num => {
      return db.query(`SELECT count(*) FROM reviews WHERE rating=${num} AND product_id = ${id}`)
        .then(res => {
          metaObj.ratings[num] = res.rows[0].count;
        });
    }))
      .then(res1 => {
        const total = Object.values(metaObj.ratings).reduce((acc, value) => {
          acc += Number(value);
          return acc;
        }, 0);
        console.log('total ', total);
        db.query(`SELECT count(*) FILTER (WHERE product_id = ${id} AND recommend) FROM reviews`)
          .then(res => {
            metaObj.recommended.true = res.rows[0].count;
            metaObj.recommended.false = total - res.rows[0].count;
            db.query(`SELECT id, name FROM characteristics WHERE product_id = ${id}`)
              .then(res => { // get characteristic id and name
                Promise.all(res.rows.map(char => {
                  return db.query(`SELECT value FROM characteristic_reviews WHERE characteristic_id = ${char.id}`) // for each characteristic, get values
                    .then(res => {
                      console.log('inner inner loop values?', res.rows); // values for each characteristic!!!!!
                      const average = res.rows.reduce((acc, value) => {
                        acc += value.value;
                        return acc;
                      }, 0);
                      metaObj.characteristics[char.name] = {
                        id: char.id,
                        value: average / res.rows.length,
                      };
                    });
                }))
                  .then(res => {
                    callback(metaObj);
                  })
                  .catch(err => {
                    callback(err);
                  });
              });
          });
      });
  },
  postReview: (callback, newReview) => {
    console.log('inside models postReview', newReview);
    db.query(`INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${newReview.product_id}, ${newReview.rating}, ${newReview.date}, '${newReview.summary.replaceAll("'", "''")}', '${newReview.body.replaceAll("'", "''")}', ${newReview.recommend}, ${newReview.reported}, '${newReview.reviewer_name.replaceAll("'", "''")}', '${newReview.reviewer_email.replaceAll("'", "''")}', '${newReview.response}', ${newReview.helpfulness})`)
      .then(res1 => {
        console.log('successfully inserted reviews into db ', res1);
        newReview.photos.forEach(photo => {
          db.query(`INSERT INTO reviews_photos(review_id, url) VALUES ((SELECT id FROM reviews WHERE date = ${newReview.date}), '${photo}')`)
            .then(res0 => {
              console.log('photo has been successfully inserted');
            })
            .then(res2 => {
              console.log('successfully inserted photos into db ', res2);
              const keys = Object.keys(newReview.characteristics);

              keys.forEach(name => {
                console.log('num values', newReview.characteristics[name].value);
                db.query(`INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES ((SELECT id FROM characteristics WHERE product_id = ${newReview.product_id} AND name = '${name}'), (SELECT id FROM reviews WHERE date = ${newReview.date}), ${newReview.characteristics[name].value})`)
                  .then(res3 => {
                    console.log('successfully inserted characteristic_review into db');
                  })
                  .catch(err => {
                    console.log('failed to insert characteristic_review into db');
                  });
              });
            })
            .catch(err => {
              console.log('error inserting photo');
            });
        });
      })
      .then((err, results) => {
        callback(err, results);
      })
      .catch(err => {
        console.log('failed to insert reviews into db ', err);
        callback(err);
      });
  },

//   },
//   edit: function(obj) {

// }
};