const axios = require("axios");

/* const sendMessage = async (body, receviers) => {
  let recipients = receviers.map((person) => {
    return { msisdn: parseInt(`2${person}`) };
  });
  const payload = {
    sender: "Dolapk",
    message: body,
    recipients,
  };
  const apiToken = process.env.GATEWAY_TOKEN;

  const encodedAuth = Buffer.from(`${apiToken}:`).toString("base64");
  try {
    const resp = await axios.post(
      "https://gatewayapi.com/rest/mtsms",
      JSON.stringify(payload),
      {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(resp.json());
    if (resp.ok) {
      console.log("congrats! messages are on their way!");
    } else {
      console.log("oh-no! something went wrong...");
    }
  } catch (e) {
    console.log(e);
  }
}; */
const sendMessage = () => {};
module.exports = sendMessage;
