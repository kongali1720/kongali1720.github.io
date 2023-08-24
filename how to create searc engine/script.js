// Constants
const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash API access key
const imageContainer = document.getElementById('image-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Function to fetch images from Unsplash API
async function fetchImages(query) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${accessKey}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Function to display images
function displayImages(images) {
    imageContainer.innerHTML = '';
    images.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.regular;
        imgElement.alt = image.alt_description;
        imageContainer.appendChild(imgElement);
    });
}

// Event listener for search button
searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        const images = await fetchImages(searchTerm);
        displayImages(images);
    }
});

// Initial load
searchButton.click();
