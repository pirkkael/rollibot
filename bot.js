import discord from "discord.io";
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

const authData = fs.readFileSync("./auth.json");
const auth = JSON.parse(authData);

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
    let args = message.substring(1).split(" ");
    const cmd = args[0];

    switch (cmd) {
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
    }
  }
});

async function troll() {
  const siteUrl = "http://rolloffle.churchburning.org/troll_me.php";
  const result = await axios.get(siteUrl);
  const data = cheerio.load(result.data);
  return data("p").first().text();
}
