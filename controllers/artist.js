const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const Api404Error = require("../utils/errors/error404");
const { writeCSVFile } = require("../middleware/csv");
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

    // get all artist from json db
    let getArtistJsonDB = [];
    const randomArtist = await axios.get("http://localhost:5000/artist");
    getArtistJsonDB.push(randomArtist.data);

    if (artistBio.length <= 0) {
      res.status(201).send(randomArtist.data);
      return;
    } else {
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

      // destructure the array to one level
      [getArtistJsonDB] = getArtistJsonDB.map((obj) => obj.flat());

      // return all artist name from the json db for check purposes
      getArtistJsonDB = getArtistJsonDB.map((artistExist) => {
        return artistExist.name;
      });

      // inorder to add an artist multiple times
      // we do a check to know the artist already exist in the json db
      // else will add the artist
      const artistObj = [];
      artistBio.map((data) => {
        if (getArtistJsonDB.includes(data.name)) {
        } else {
          axios.post(`http://localhost:5000/artist`, data).then((res) => {
            artistObj.push(res.data);
          });
        }
      });

      // create csv
      writeCSVFile(artistBio, artistName);

      // response
      res.status(200).send(artistBio);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(new Api404Error());
  }
};
