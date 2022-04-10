const express = require("express");
const router = express.Router();
const axios = require("axios");
const { parseString } = require("xml2js").Parser({ explicitArray: false });

const PORT = process.env.PORT || 5000;
const USERID = "602IGAL02221";

// const testTracking1 = 420891239274890227365626421553;
// const testTracking2 = 9102084383041101186729;

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/:id", (req, res) => {
  var config = {
    method: "get",
    url: `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2\n&XML=<TrackFieldRequest USERID="${USERID}">\n\n<Revision>1</Revision>\n\n<ClientIp>122.3.3</ClientIp>\n\n<SourceId>XYZ Corp</SourceId>\n\n<TrackID ID="${req.params.id}"/>\n\n</TrackFieldRequest>`,
  };

  axios(config)
    .then(function (response) {
      parseString(response.data, (err, results) => {
        if (!results.TrackResponse.TrackInfo) {
          res.status(400).json("Invalid tracking number. Check syntax");
        } else {
          res.status(200).json(results.TrackResponse.TrackInfo);
        }
      });
    })
    .catch(function (err) {
      res.status(404).json(err);
    });
});

/* GET Homepage */
app.listen(PORT, () => console.log("Server started on port ", PORT));

// Detect Carrier
// ==============
// RegEx List:
// FedEx
// ^[0-9]{20}$
// ^[0-9]{15}$
// ^[0-9]{12}$
// ^[0-9]{22}$
// UPS
// ^(1Z)[0-9A-Z]{16}$
// ^(T)+[0-9A-Z]{10}$
// ^[0-9]{9}$
// ^[0-9]{26}$
// USPS
// ^(94|93|92|94|95)[0-9]{20}$
// ^(94|93|92|94|95)[0-9]{22}$
// ^(70|14|23|03)[0-9]{14}$
// ^(M0|82)[0-9]{8}$
// ^([A-Z]{2})[0-9]{9}([A-Z]{2})$
