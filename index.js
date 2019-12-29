const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pepe:pepe@cluster0-lfedf.mongodb.net/pepecaust?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('---------------- Connected to MongoDB : ) ----------------'))
    .catch(error => console.log(error))

// Mongoose Models
const bannedPepes = require('./models/bannedPepes');
const users = require('./models/users');


// Here we load the config.json file that contains our configs.
const config = require("./config.json");

client.on("ready", async() => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Pepe Blaster™️ has started for ${client.users.size} users.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Killing pepes since 2019`);
    /*
        const user = new users({ user_id: 235614059767136269 });
        await user.save();*/
});

client.on('messageUpdate', async(oldMessage, newMessage) => {
    findAnnoyingPepes(newMessage);
})

client.on("message", async message => {

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    findAnnoyingPepes(message, command);

    // Gets how many times pepe got deleted.
    if (command == 'peps') {
        try {
            const countPepes = await bannedPepes.countDocuments();
            await message.channel.send(`A total of ${countPepes} pepes were deleted.`);
        } catch (error) {
            await message.channel.send(`Can not receive how many pepes got deleted.`);
        }
    }

    // Adds a word to blacklist
    if (command === "addp" && args.length) {
        const filter = { word: args[0] };
        const findPepe = await bannedPepes.find(filter);
        if (findPepe.length) {
            message.reply("Dude... this word is already banned.");
        } else {
            message.reply(`**${args[0]}** successfully added to blacklist, @T5 rage increased by 10%.`);
            const addPepe = new bannedPepes(filter);
            await addPepe.save();
        }
    }
    // Removes a word from blacklist
    if (command === "removep" && args.length) {
        const filter = { word: args[0] };
        const findPepe = await bannedPepes.find(filter);
        if (findPepe.length) {
            message.reply(`**${args[0]}** successfully removed from blacklist, @T5 rage decreased by 10%`);
            await bannedPepes.deleteOne(filter);
        } else {
            message.reply("This word is not banned, go ahead.");
        }
    }

    // Add user to blacklist
    if (command === "addtoblacklist" && args.length) {
        const filter = { user_id: args[0] };
        const user = await users.find(filter);
        if (user.length) {
            message.reply("Dude... this user is already blacklisted.");
        } else {
            message.reply(`**${args[0]}** successfully added to blacklist.`);
            const add_user = new users(filter);
            await add_user.save();
        }
    }

    // Remove user from blacklist
    if (command === "removeblacklist" && args.length) {
        const filter = { user_id: args[0] };
        const user = await users.find(filter);
        if (user.length) {
            message.reply(`**${args[0]}** successfully removed from blacklist.`);
            await users.deleteOne(filter);
        } else {
            message.reply("Dude... this user is not blacklisted.");
        }
    }
});


const findAnnoyingPepes = async(message, command) => {

    console.log(command)

    if (command !== 'addp' && command !== 'removep') {
        const user = await users.find({ user_id: message.author.id });
        if (user.length > 0) {
            const words = await bannedPepes.find();
            let found = false;
            Array.from(words).forEach((word) => {
                if (message.content.toLowerCase().includes(word.word)) {
                    found = true;
                    return; //////// ?
                }
            })

            if (found) {
                message.channel.send("@T5 just got hit by the Pepe Blaster™️");
                message.delete(message.content);
            }
        }
    }

}

const isUserInBlackList = async(user_id) => {
    const user = await users.find({ user_id });
    if (user.length > 0) return true;
    return false;
}

client.login(config.token);