const converter = require("json-2-csv");
const fs = require("fs");

exports.writeCSVFile = (artistBio, artistName) => {
  (async () => {
    try {
      const csvData = await converter.json2csvAsync(artistBio);

      // write CSV to a file
      fs.writeFileSync(`downloads/${artistName}.csv`, csvData);
    } catch (err) {
      console.log(err);
    }
  })();
};
