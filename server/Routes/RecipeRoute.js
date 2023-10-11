const express = require("express");
const axios = require("axios");
const { createClient } = require("redis");
const api_key = "f186ddc686dc40e4917e57a471aa0835";
let api_url = `https://api.spoonacular.com/recipes/random?apiKey=${api_key}&number=50`;

const client = createClient({
  url: "redis://default:b5we5Cs4ZIDJrxRiSusw6GHooUEA9g2h@redis-10802.c99.us-east-1-4.ec2.cloud.redislabs.com:10802",
});
client.on("connect", () => {
  console.log("Connected to Redis");
});
client.on("error", (err) => console.log(err));

const recipe_router = express.Router();
recipe_router.get("/", async (req, res) => {
  try {
    // res.status(200).send(responseData.data);
    let data = await client.get("apiData");
    // console.log(data);
    if (data) {
      return res.status(200).send(data);
    } else {
      let responseData = await axios.get(api_url);
      await client.setEx("apiData", 3600, JSON.stringify(responseData.data));
      res.status(200).send(responseData.data);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send({ error: "Error Occurring While Fetching the Data" });
  }
});

// Searching the Recipe by Name
recipe_router.post("/search", async (req, res) => {
  const api_key = "f186ddc686dc40e4917e57a471aa0835";
  try {
    const { searchValue } = req.body;
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${api_key}&query=${searchValue}`;
    let searchResponseData = await axios.get(url);
    res.status(200).send(searchResponseData.data);
  } catch (error) {
    res.status(500).send({ error: "Error Occurring While Searching the Data" });
  }
});

module.exports = { recipe_router, client };

