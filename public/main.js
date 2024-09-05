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

function reloadPage() {
    window.location.reload();
}