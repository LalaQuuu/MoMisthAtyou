import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

let progress = 0;  // Track progress

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Function to get random female artwork with progress
async function getRandomFemaleArtwork() {
    try {
        const idsResponse = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects');
        const objectIDs = idsResponse.data.objectIDs;

        let femaleArtwork = null;
        progress = 0; // Reset progress

        // Loop to find an artwork by a female artist
        while (!femaleArtwork) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
            progress += 10; // Increment progress by 10%

            const randomObjectID = objectIDs[Math.floor(Math.random() * objectIDs.length)];
            const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`);
            const objectData = objectResponse.data;

            if (objectData.artistGender && objectData.artistGender.toLowerCase() === 'female') {
                femaleArtwork = objectData;
            }

            if (progress >= 100) {
                progress = 100;  // Cap progress at 100%
            }
        }

        return femaleArtwork;
    } catch (error) {
        console.error("Error fetching artwork:", error);
        return null;
    }
}

// Serve the main page
app.get('/', async (req, res) => {
    const artwork = await getRandomFemaleArtwork();
    res.render('index', { artwork });
});

// Route to start fetching new artwork (reset progress)
app.post('/start-task', (req, res) => {
    progress = 0;
    res.sendStatus(200);
});

// Route to get progress
app.get('/progress', (req, res) => {
    res.json({ progress });
});

// Route to get new artwork as JSON
app.get('/new-artwork', async (req, res) => {
    const artwork = await getRandomFemaleArtwork();
    res.json(artwork);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
