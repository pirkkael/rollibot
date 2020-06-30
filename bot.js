const Discord = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");
const auth = require("./auth.json");

const client = new Discord.Client();

client.on("ready", function (evt) {
  console.log("Connected!");
});

client.on("message", async function (message) {
  console.log(message.content);
  if (message.content.substring(0, 1) == "!") {
    const args = message.content.substring(1).split(" ");
    const cmd = args[0];
    const add = args[1];

    switch (cmd) {
      case "ping":
        message.channel.send("Pong.");
        break;
      case "commands":
        message.channel.send("Available commands: !troll !coinflip !gif");
        break;
      case "troll":
        message.channel.send(await troll());
        break;
      case "coinflip":
        message.channel.send(await coinFlip());
        break;
      case "gif":
        message.channel.send(await getGifUrl(add));
        break;
    }
  }
});

client.login(auth.token);

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

async function getGifUrl(tag) {
  const siteUrl =
    "http://api.giphy.com/v1/gifs/random?api_key=" +
    auth.giphyApiKey +
    "&tag=" +
    tag +
    "&verificationMode=true";
  const result = await axios.get(siteUrl);
  console.log(result);
  return result.data.data.bitly_url;
}
