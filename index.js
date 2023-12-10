const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const app = express();
const apiKey = process.env.OPENAI_API_KEY;
const key = process.env.KEY;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => res.send("Welcome"));

app.post("/bot", async (req, res) => {
    const { userMessage } = req.body;
    console.log(userMessage);

    try {
        // OpenAI GPT-3.5-turbo API request
        const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: userMessage }]
            })
        });

        const gptData = await gptResponse.json();
        const gptResult = gptData.choices[0].message.content;

        // Weather API request (you may customize this part)
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${gptResult}&appid=${key}&units=metric&sys=unix`
        );

        const weatherData = await weatherResponse.json();
        const weatherResult = {
            location: weatherData.name,
            temperature: weatherData.main.temp,
            unit: "celsius",
        };

        res.json({ result: weatherResult });
    } catch (error) {
        console.log(error);
        const message = "It seems the answer to this question is not available.";
        res.send({ message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
