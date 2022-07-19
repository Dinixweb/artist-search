const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
const axios = require("axios");
const converter = require("json-2-csv");
const Api404Error = require("../errors/error404");
const { API_KEY } = process.env;
const { API_BASE_URL } = process.env;

exports.findUserByName = async (req, res) => {
  const { artistName } = req.query;

  try {
    if (!artistName) {
      res.status(404).send({
        success: false,
        artist: "null",
        message: "Enter an artist name in the query params",
      });
      return;
    }
    let getArtistData = await axios.get(
      `${API_BASE_URL}?method=artist.search&api_key=${API_KEY}&format=json&artist=${artistName}`
    );

    // this will return only result without search information
    let artistBio = getArtistData.data.results.artistmatches.artist;

    // csv table column header
    const tableColumn = ["name", "mbid", "url", "image"];

    // this will filter only data matching column header
    artistBio = artistBio.map((list, i) => {
      return Object.keys(list)
        .filter((key) => tableColumn.includes(key))
        .reduce((obj, key) => {
          return Object.assign(obj, {
            [key]: list[key],
          });
        }, {});
    });

    //return all image
    let image = artistBio.map((obj) => obj.image);

    //this will return all small images belonging to each artist
    let small_image = artistBio.map((obj) => [obj.image[0]["#text"]]).flat();

    // this will re-apend the images to artist data in the order of the data
    artistBio.forEach((e, i) => {
      return (e.image = image[i]), (e.small_image = small_image[i]);
    });

    (async () => {
      try {
        const csvData = await converter.json2csvAsync(artistBio);

        // write CSV to a file
        fs.writeFileSync(`downloads/${artistName}.csv`, csvData);
      } catch (err) {
        console.log(err);
      }
    })();

    // response
    res.status(200).send(artistBio);
  } catch (error) {
    console.log(error);
    res.status(404).send(new Api404Error());
  }
};
