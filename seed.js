// seed.js
require("dotenv").config();
const mongoose = require('mongoose');
const Country = require("./models/Countries");
const State = require("./models/State");
const City = require("./models/City");

const seedData = {
    countries: ['Country1', 'Country2', 'Country3'],
    states: {
        Country1: ['State1A', 'State1B', 'State1C'],
        Country2: ['State2A', 'State2B', 'State2C'],
        Country3: ['State3A', 'State3B', 'State3C'],
    },
    cities: {
        State1A: ['City1A', 'City1B', 'City1C'],
        State1B: ['City1D', 'City1E', 'City1F'],
        
    },
};

const seedDatabase = async () => {
    await Country.deleteMany()
    await State.deleteMany()
    await City.deleteMany()
    await Country.insertMany(seedData.countries.map(name => ({ name })));

    for (const countryName in seedData.states) {
        const country = await Country.findOne({ name: countryName });

        const states = seedData.states[countryName];
        if (states) {
            const stateDocs = states.map(name => ({ name, country: country._id }));
            await State.insertMany(stateDocs);

            for (const stateName of states) {
                const state = await State.findOne({ name: stateName });

                const cities = seedData.cities[stateName];
                if (cities) {
                    const cityDocs = cities.map(name => ({ name, state: state._id }));
                    await City.insertMany(cityDocs);
                }
            }
        }
    }

    console.log('Database seeded successfully');
    mongoose.connection.close();
};

mongoose.connect(process.env.MONGO_DB_URL);
seedDatabase();
