const axios = require("axios");

const sendMessages = async (token, body, receviers) => {
  try {
    const response = await axios.post(
      receviers.length === 1
        ? "https://connect.routee.net/sms"
        : "https://connect.routee.net/sms/campaign",
      {
        body,
        to:
          receviers.length > 1
            ? receviers.map((n) => "+2" + n)
            : receviers.map((n) => "+2" + n)[0],
        from: "Dolapk",
      },
      {
        async: true,
        crossDomain: true,
        processData: false,
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    console.log(e.config ? e.config : e);
  }
};

module.exports = sendMessages;
