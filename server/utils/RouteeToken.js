const axios = require("axios");
const Routee = {
  id: process.env.RouteeAPI_ID,
  secret: process.env.RouteeAPI_SECRET,
};

const RouteeBase64 = Buffer.from(`${Routee.id}:${Routee.secret}`).toString(
  "base64"
);

const getRouteeToken = async () => {
  let data = { grant_type: "client_credentials" };

  try {
    const response = await axios.post(
      "https://auth.routee.net/oauth/token",
      new URLSearchParams(Object.keys(data).map((key) => [key, data[key]])),
      {
        async: true,
        crossDomain: true,

        headers: {
          authorization: `Basic ${RouteeBase64}`,
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (e) {
    console.log(e);
  }
};

module.exports = getRouteeToken;
