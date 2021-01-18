const axios = require("axios");

const sendMessage = async () => {};
/* const SENDER_NUMBER = "201283300793";
const ORANGE_TOKEN_URI = "https://api.orange.com/oauth/v2/token";
const ORANGE_SEND_URI =
  "https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B" +
  SENDER_NUMBER +
  "/requests";
const CURRENT_TOKEN = process.env.CURRENT_TOKEN;
const getOrangeToken = async () => {
  try {
    const resp = await axios.post(
      ORANGE_TOKEN_URI,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: process.env.ORANGE_AUTH,
        },
      }
    );
    return resp.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
const sendMessage = async (body, receivers) => {
  if (!receivers) return;
  const sendToNumber = `2${receivers[0]}`;
  const requestBody = {
    outboundSMSMessageRequest: {
      address: `tel:+${sendToNumber}`,
      senderAddress: `tel:+${SENDER_NUMBER}`,
      senderName: "Dolapk",
      outboundSMSTextMessage: {
        message: body,
      },
    },
  };

  try {
    await axios.post(ORANGE_SEND_URI, requestBody, {
      headers: {
        Authorization: process.env.CURRENT_TOKEN,
      },
    });
  } catch (e) {
    try {
      console.log(e);
      console.log(e.response && e.response.data);
      console.log(
        e.response && e.response.data && e.response.data.requestError
      );
    } catch (e) {
      return;
    }
  }
}; */
module.exports = sendMessage;
