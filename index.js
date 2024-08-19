import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// let objectIDs = [];

// Math.floor(Math.random() * objectIDs.length)

// Function to get a random object by a female artist
async function getRandomFemaleArtwork() {
    try {
        // Fetch all object IDs from the MoMA API
        const idsResponse = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects');
        const objectIDs = idsResponse.data.objectIDs;

        let femaleArtwork = null;

        // Loop to find an artwork by a female artist
        while (!femaleArtwork) {
            // Select a random object ID
            const randomObjectID = objectIDs[Math.floor(Math.random() * objectIDs.length)];

            // Fetch details for the selected object ID
            const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`);
            const objectData = objectResponse.data;

            // Check if the artist's gender is female
            if (objectData.artistGender && objectData.artistGender.toLowerCase() === 'female') {
                femaleArtwork = objectData;
            }
        }

        return femaleArtwork;
    } catch (error) {
        console.error("Error fetching data from MoMA API:", error);
        return null;
    }
}

// Route to fetch and display a random artwork by a female artist
app.get('/', async (req, res) => {
    const artwork = await getRandomFemaleArtwork();
    res.render('index', { artwork });
});

// Route to get new random female artwork as JSON
app.get('/new-artwork', async (req, res) => {
    const artwork = await getRandomFemaleArtwork();
    res.json(artwork);
});


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });