const csv = require('fast-csv');
const db = require('./index');
const contains = require('validator/lib/contains');
const fs = require('fs');
const path = require('path')
var copyFrom = require('pg-copy-streams').from

// other functions...

function insertFromCsv(filename) {
    let stream = fs.createReadStream(path.join(__dirname, `../../data/${filename}.csv`));
    let csvData = [];
    let csvStream = csv
            .parse()
            // .validate((data) => !contains(data[0], ','))
            // triggered when a new record is parsed, we then add it to the data array
            .on('data', (data) => {
                csvData.push(data);
            })
            .on('data-invalid', (row, rowNumber) =>
                console.log(
                    `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`
                )
            )
            .on('end', () => {
                // The insert statement
                const query =
                    'INSERT INTO photos (id, product_id, url) VALUES ($1, $2, $3)';
                // Connect to the db instance
                // db.connect((err, client, done) => {
                //     if (err) throw err;
                //     try {
                        // loop over the lines stored in the csv file
                        csvData.forEach((row) => {
                            // For each line we run the insert query with the row providing the column values
                            db.query(query, row, (err, res) => {
                                if (err) {
                                    // We can just console.log any errors
                                    console.log(err.stack);
                                } else {
                                    console.log('inserted ' + res.rowCount + ' row:', row);
                                }
                            });
                    //     });
                    // } finally {
                    // //     done();
                    // }
                // });
            })
            })
            stream.pipe(csvStream)
    // );
}

const copy = ()=> {
    db.connect()
    .then((client)=> {
        const stream = client.query(copyFrom("COPY characteristic_reviews(characteristic_id,review_id,value) FROM STDIN CSV HEADER NULL AS 'null'"))
        const fileStream = fs.createReadStream('/Users/boshao/HACK/PROJECT-ATELIER-REVIEWS-BACKEND/data/newCharacteristic_reviews.csv')
        fileStream.on('error', console.log)
        stream.on('error', console.log)
        stream.on('finish', client.release)
        fileStream.pipe(stream)
    })
}
copy()

// stream.pipe(insertFromCsv());