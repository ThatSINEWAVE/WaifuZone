document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const tagButtons = document.querySelectorAll('.tag-button');
    const imageDisplaySection = document.getElementById('image-display');
    const tagSelectionSection = document.getElementById('tag-selection');
    const imageContainer = document.getElementById('image-container');
    const imageElement = document.getElementById('image');
    const ageVerification = document.getElementById('age-verification');
    const ageYesButton = document.getElementById('age-yes');
    const ageNoButton = document.getElementById('age-no');
    const chooseAnotherTagButton = document.getElementById('choose-another-tag');
    const getAnotherImageButton = document.getElementById('get-another-image');

    let currentTag = null;
    let isAgeVerified = false;

    // Load and apply the saved theme; checking if there's a saved theme in the local storage; and applying it to the body; and setting the theme toggle accordingly based on the saved theme;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'dark-mode';
    }

    // Toggle theme; toggling between dark and light modes based on the toggle switch; and saving the selected theme to the local storage;
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', themeToggle.checked);
        document.body.classList.toggle('light-mode', !themeToggle.checked);
        localStorage.setItem('theme', themeToggle.checked ? 'dark-mode' : 'light-mode');
    });

    // Tag button click event; adding event listeners to each tag button; capturing the clicked tag and processing it accordingly;
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentTag = button.dataset.tag;
            if (button.classList.contains('nsfw')) {
                if (isAgeVerified) {
                    fetchImage(currentTag); // if age is verified, directly fetch and display the image;
                } else {
                    showAgeVerification(); // if age is not verified, show the age verification popup;
                }
            } else {
                fetchImage(currentTag); // for SFW tags, directly fetch and display the image;
            }
        });
    });

    // Age verification buttons; handling the clicks on the age verification buttons;
    ageYesButton.addEventListener('click', () => {
        isAgeVerified = true;
        fetchImage(currentTag); // fetching and displaying the image associated with the current tag;
        hideAgeVerification(); // hiding the age verification popup;
    });

    ageNoButton.addEventListener('click', () => {
        window.location.href = 'https://google.com'; // redirecting to Google if the user clicks "No" on the age verification popup;
    });

    // Fetch image function; fetching the image associated with the provided tag from the API;
    function fetchImage(tag) {
        fetch(`https://api.waifu.im/search?included_tags=${tag}`)
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.images[0].url; // extracting the URL of the fetched image;
                const dominantColor = data.images[0].dominant_color; // extracting the dominant color of the fetched image;
                imageElement.src = imageUrl; // setting the source of the image element to the fetched URL;
                document.body.style.backgroundColor = dominantColor; // changing the background color of the body to the dominant color of the fetched image;
                tagSelectionSection.classList.add('hidden'); // hiding the tag selection section;
                imageDisplaySection.classList.remove('hidden'); // showing the image display section;
                if (!currentTag.includes('nsfw')) { // if the current tag is not NSFW, show the image container and image
                    imageContainer.classList.remove('hidden'); // showing the image container;
                    imageElement.classList.remove('hidden'); // showing the image itself;
                }

                // Update the artist name and source
                const artistNameElement = document.getElementById('artist-name');
                const sourceLinkElement = document.getElementById('source-link');

                const artistName = data.images[0].artist || 'Unknown artist';
                const source = data.images[0].source || 'Unknown source';

                artistNameElement.textContent = artistName;
                sourceLinkElement.textContent = 'View Source';
                sourceLinkElement.href = source;
                sourceLinkElement.target = '_blank';

                // Show image info box
                const imageInfoBox = document.getElementById('image-info');
                imageInfoBox.classList.remove('hidden');
            });
    }


    // Show age verification; displaying the age verification popup and hiding the image container and image;
    function showAgeVerification() {
        ageVerification.classList.remove('hidden'); // showing the age verification popup;
        imageDisplaySection.classList.remove('hidden'); // showing the image display section;
        chooseAnotherTagButton.classList.add('hidden'); // hiding the "Choose Another Tag" button;
        getAnotherImageButton.classList.add('hidden'); // hiding the "Get Another Image" button;
        imageContainer.classList.add('hidden'); // hiding the image container;
        imageElement.classList.add('hidden'); // hiding the image itself;
    }

    // Hide age verification; hiding the age verification popup;
    function hideAgeVerification() {
        ageVerification.classList.add('hidden'); // hiding the age verification popup;
        chooseAnotherTagButton.classList.remove('hidden'); // showing the "Choose Another Tag" button;
        getAnotherImageButton.classList.remove('hidden'); // showing the "Get Another Image" button;
    }

    // Choose another tag; handling clicks on the "Choose Another Tag" button;
    chooseAnotherTagButton.addEventListener('click', () => {
        tagSelectionSection.classList.remove('hidden'); // showing the tag selection section;
        imageDisplaySection.classList.add('hidden'); // hiding the image display section;
        imageContainer.classList.add('hidden'); // hiding the image container;
        imageElement.classList.add('hidden'); // hiding the image itself;
        document.getElementById('image-info').classList.add('hidden'); // hiding the image info box
        document.body.style.backgroundColor = ''; // resetting the background color of the body;
    });

    // Get another image; handling clicks on the "Get Another Image" button;
    getAnotherImageButton.addEventListener('click', () => {
        fetchImage(currentTag); // fetching and displaying another image associated with the current tag;
    });
});
