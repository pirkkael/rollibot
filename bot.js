const discord = require("discord.io");
const axios = require("axios");
const cheerio = require("cheerio");
const auth = require("./auth.json");

const bot = new discord.Client({
  token: auth.token,
  autorun: true,
});
bot.on("ready", function (evt) {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.username + " - (" + bot.id + ")");
});
bot.on("message", async function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) == "!") {
    const args = message.substring(1).split(" ");
    const cmd = args[0];

    switch (cmd) {
      case "commands":
        bot.sendMessage({
          to: channelID,
          message: "Available commands: !troll !coinflip",
        });
        break;
      case "ping":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
        break;
      case "troll":
        bot.sendMessage({
          to: channelID,
          message: await troll(),
        });
        break;
      case "coinflip":
        bot.sendMessage({
          to: channelID,
          message: await coinFlip(),
        });
        break;
      case "gif":
        bot.sendMessage({
          to: channelID,
          message: await getGifUrl(),
        });
        break;
    }
  }
});

async function troll() {
  const siteUrl = "http://rolloffle.churchburning.org/troll_me.php";
  const result = await axios.get(siteUrl);
  const data = cheerio.load(result.data);
  return data("p").first().text();
}

async function coinFlip() {
  const num = Math.floor(Math.random() * Math.floor(2));
  let text = "Tails";
  if (num === 0) {
    text = "Heads";
  }
  return text;
}

async function getGifUrl() {
  const siteUrl =
    "http://api.giphy.com/v1/gifs/random?api_key=" + auth.giphyApiKey;
  const result = await axios.get(siteUrl);
  return result.data.data.bitly_url;
}
