document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const tagButtons = document.querySelectorAll('.tag-button');
    const imageDisplaySection = document.getElementById('image-display');
    const tagSelectionSection = document.getElementById('tag-selection');
    const imageElement = document.getElementById('image');
    const ageVerification = document.getElementById('age-verification');
    const ageYesButton = document.getElementById('age-yes');
    const ageNoButton = document.getElementById('age-no');
    const chooseAnotherTagButton = document.getElementById('choose-another-tag');
    const getAnotherImageButton = document.getElementById('get-another-image');

    let currentTag = null;

    // Load and apply the saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'dark-mode';
    }

    // Toggle theme
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', themeToggle.checked);
        document.body.classList.toggle('light-mode', !themeToggle.checked);
        localStorage.setItem('theme', themeToggle.checked ? 'dark-mode' : 'light-mode');
    });

    // Tag button click event
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentTag = button.dataset.tag;
            if (button.classList.contains('nsfw')) {
                showAgeVerification();
            } else {
                fetchImage(currentTag);
            }
        });
    });

    // Age verification buttons
    ageYesButton.addEventListener('click', () => {
        fetchImage(currentTag);
        ageVerification.classList.add('hidden');
    });

    ageNoButton.addEventListener('click', () => {
        window.location.href = 'https://google.com';
    });

    // Fetch image function
    function fetchImage(tag) {
        fetch(`https://api.waifu.im/search?included_tags=${tag}`)
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.images[0].url;
                const dominantColor = data.images[0].dominant_color;
                imageElement.src = imageUrl;
                document.body.style.backgroundColor = dominantColor;
                tagSelectionSection.classList.add('hidden');
                imageDisplaySection.classList.remove('hidden');
            });
    }

    // Show age verification
    function showAgeVerification() {
        ageVerification.classList.remove('hidden');
        imageDisplaySection.classList.remove('hidden');
    }

    // Choose another tag
    chooseAnotherTagButton.addEventListener('click', () => {
        tagSelectionSection.classList.remove('hidden');
        imageDisplaySection.classList.add('hidden');
        document.body.style.backgroundColor = '';
    });

    // Get another image
    getAnotherImageButton.addEventListener('click', () => {
        fetchImage(currentTag);
    });
});
