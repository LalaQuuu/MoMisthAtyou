document.getElementById('new-artwork-button').addEventListener('click', async function() {
    try {
        const response = await fetch('/new-artwork');
        const artwork = await response.json();

        // Update the DOM with new artwork data
        document.getElementById('artwork-title').textContent = artwork.title;
        document.getElementById('artwork-artist').textContent = artwork.artistDisplayName;
        document.getElementById('artwork-medium').textContent = artwork.medium;
        document.getElementById('artwork-objectName').textContent = artwork.objectName; 
        document.getElementById('artwork-objectDate').textContent = artwork.objectDate;        
        document.getElementById('artwork-artistDisplayBio').textContent = artwork.artistDisplayBio;

        

        const artworkImage = document.getElementById('artwork-image');

        if (artwork.primaryImage) {
            artworkImage.src = artwork.primaryImage;
            artworkImage.alt = artwork.title;
            artworkImage.style.display = 'block';
        } else {
            artworkImage.src = '';
            artworkImage.alt = 'No image available';
            artworkImage.style.display = 'none';
            artworkImage.textContent = 'No image available';
        }
    } catch (error) {
        console.error('Error fetching new artwork:', error);
    }
});

// function reloadPage() {
//     window.location.reload();
// }

function startFetchingArtwork() {
    const progressBar = document.getElementById("loadBar");
    progressBar.style.width = '0%';  // Reset the progress bar
    progressBar.innerText = '0%';

    // Start task by sending request to the server to start fetching artwork
    fetch('/start-task', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                // Start polling the server for progress updates
                pollProgress();
            } else {
                console.error('Error starting task');
            }
        });
}

// Poll the server for task progress
function pollProgress() {
    const progressBar = document.getElementById("loadBar");

    fetch('/progress')
        .then(response => response.json())
        .then(data => {
            const progress = data.progress;
            progressBar.style.width = progress + '%';
            // progressBar.innerText = progress + '%';

            if (progress < 100) {
                // Continue polling until the task is 100% complete
                setTimeout(pollProgress, 500);  // Poll every 0.5 seconds
            } else {
                // Once 100%, fetch and display the new artwork
                fetchNewArtwork();
            }
        });
}

// Fetch and display new artwork once progress reaches 100%
function fetchNewArtwork() {
    fetch('/new-artwork')
        .then(response => response.json())
        .then(artwork => {
            document.getElementById('artwork-title').innerText = artwork.artistDisplayName;
            document.getElementById('artwork-artist').innerText = artwork.title;
            document.getElementById('artwork-medium').innerText = artwork.medium;
            document.getElementById('artwork-objectName').innerText = artwork.objectName;
            document.getElementById('artwork-objectDate').innerText = artwork.objectDate;
            document.getElementById('artwork-artistDisplayBio').innerText = artwork.artistDisplayBio;

            const artworkImage = document.getElementById('artwork-image');
            if (artwork.primaryImage) {
                artworkImage.src = artwork.primaryImage;
                artworkImage.alt = artwork.title;
            } else {
                artworkImage.innerText = 'No image available';
            }
        });
}
