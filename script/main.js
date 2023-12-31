// Function to fetch anime data based on criteria
function fetchAnimeDataByCriteria(criteria) {
  const apiUrl = `https://kitsu.io/api/edge/anime?filter[text]=${criteria}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Check if the data array is empty
      if (data.data.length === 0) {
        // Hide the dropdown if no results
        hideDropdown();
        return;
      }

      // Process the data as needed
      const dropdownElement = document.querySelector(".anime-dropdown");
      dropdownElement.innerHTML = "";

      // Create an option for each result
      let optionCount = 0; // Counter for the number of options
      data.data.forEach((anime) => {
        if (optionCount < 5) {
          // Only create options for the first 5 results
          const option = document.createElement("div"); // Changed from 'option' to 'div'

          // Check if titles.en exists, otherwise use titles.en_jp
          const title = anime.attributes.titles.en ? anime.attributes.titles.en : anime.attributes.titles.en_jp;

          option.textContent = title;
          option.setAttribute("data-anime-id", anime.id); // Use a unique identifier as the data attribute
          option.classList.add("dropdown-option"); // Add a class for styling
          dropdownElement.appendChild(option);
          optionCount++; // Increment the counter
        } else {
          return; // Break the loop after reaching 5 options
        }
      });

      // Show the dropdown
      showDropdown();
    })
    .catch((error) => {
      console.error("Error fetching anime data:", error);

      // Display an error message in the frontend
      const errorElement = document.querySelector(".js-error-message");
      errorElement.textContent = `Error: ${error.message}`;
      errorElement.classList.add("show");

      // Clear the 'show' class after the transition ends
      setTimeout(() => {
        errorElement.classList.remove("show");
      }, 3000); // Clear the message after 3 seconds
    });
}

function fetchAnimeDataByCriteriaButton(criteria) {
  const apiUrl = `https://kitsu.io/api/edge/anime?filter[text]=${criteria}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Check if the data array is empty
      if (data.data.length === 0) {
        // Hide the dropdown if no results
        hideDropdown();
        return;
      }

      // Process the data as needed
      const anime = data.data[0].attributes; // Take the first result

      // Save relevant information in variables
      const animeTitle = anime.canonicalTitle;
      const animeSynopsis = anime.synopsis;
      const animeRating = Math.round(anime.averageRating);
      const animeStartDate = anime.startDate;
      const animeEndDate = anime.endDate ?? "Ongoing";
      const animeEpisodeCount = anime.episodeCount ?? "Ongoing";

      if (anime.posterImage && anime.posterImage.small) {
        const animePosterSmall = anime.posterImage.small;
        document.querySelector(".js-anime-small-poster").src = animePosterSmall;
      } else {
        // Handle the case when anime.coverImage or anime.coverImage.large is null
        document.querySelector(".js-anime-small-poster").src = "../images/card.png";
      }

      if (anime.coverImage && anime.coverImage.large) {
        const animeCoverSmall = anime.coverImage.large;
        document.querySelector(".js-anime-small-cover").style.background = `linear-gradient(0deg, rgba(26, 26, 26, 0.2), rgba(26, 26, 26, 0.9), rgba(26, 26, 26, 1)), url(${animeCoverSmall})`;
      } else {
        // Handle the case when anime.coverImage or anime.coverImage.large is null
        document.querySelector(".js-anime-small-cover").style.background = `linear-gradient(0deg, rgba(26, 26, 26, 0.2), rgba(26, 26, 26, 0.9), rgba(26, 26, 26, 1)), url(images/background.jpg)`;
      }

      // Update each element with the corresponding animeInfo value
      const animeInfoElement = document.querySelector(".js-anime-info");
      const card = document.querySelector(".js-card");
      animeInfoElement.querySelector(".js-anime-title").textContent = animeTitle;
      animeInfoElement.querySelector(".js-anime-synopsis").textContent = animeSynopsis;
      animeInfoElement.querySelector(".js-anime-rating").textContent = animeRating;
      animeInfoElement.querySelector(".js-anime-start-date").textContent = animeStartDate;
      animeInfoElement.querySelector(".js-anime-end-date").textContent = animeEndDate;
      animeInfoElement.querySelector(".js-anime-episode-count").textContent = animeEpisodeCount;

      card.classList.add("show");

      const ratingBubble = document.querySelector(".js-ratingBubble");

      if (animeRating >= 75 && animeRating <= 100) {
        ratingBubble.style.backgroundColor = "var(--accent-color-1)"; // Dark Purple for 75-100
      } else if (animeRating >= 50 && animeRating < 75) {
        ratingBubble.style.backgroundColor = "var(--accent-color-2)"; // Medium Purple for 50-75
      } else if (animeRating >= 25 && animeRating < 50) {
        ratingBubble.style.backgroundColor = "var(--accent-color-3)"; // Light Purple for 25-50
      } else if (animeRating >= 0 && animeRating < 25) {
        ratingBubble.style.backgroundColor = "var(--accent-color-4)"; // Another Purple for 0-25
      }
    })
    .catch((error) => {
      console.error("Error fetching anime data:", error);

      // Display an error message in the frontend
      const errorElement = document.querySelector(".js-error-message");
      errorElement.textContent = `Error: ${error.message}`;
      errorElement.classList.add("show");

      // Clear the 'show' class after the transition ends
      setTimeout(() => {
        errorElement.classList.remove("show");
      }, 3000); // Clear the message after 3 seconds
    });
}

// Attach input event listener to the input field
const criteriaInput = document.getElementById("criteria-input");
criteriaInput.addEventListener("input", () => {
  const criteriaValue = criteriaInput.value.trim();

  // Fetch anime data based on the criteria
  fetchAnimeDataByCriteria(criteriaValue);
});

// Attach click event listener to the dropdown options
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("dropdown-option")) {
    // Update the input field with the selected title
    const criteriaInput = document.getElementById("criteria-input");
    criteriaInput.value = event.target.textContent;

    // Hide the dropdown
    hideDropdown();
  }

  // Attach click event listener to the document to hide the dropdown when clicking outside
  document.addEventListener("click", (event) => {
    const searchDropdownContainer = document.querySelector(".search-dropdown-container");

    // Check if the clicked element is within the search dropdown container
    if (!searchDropdownContainer.contains(event.target)) {
      // Hide the dropdown
      hideDropdown();
    }
  });

  // Attach input event listener to the input field
  criteriaInput.addEventListener("click", () => {
    const criteriaValue = criteriaInput.value.trim();

    // Show the dropdown if there are options available
    const dropdownElement = document.querySelector(".anime-dropdown");
    if (dropdownElement.innerHTML.trim() !== "") {
      showDropdown();
    }
  });
});

// Attach click event listener to the button with the class "fetch-anime-button"
const fetchAnimeButton = document.querySelector(".js-fetch-anime");

fetchAnimeButton.addEventListener("click", () => {
  // Get the input value
  const criteriaInput = document.getElementById("criteria-input");
  const criteriaValue = criteriaInput.value.trim();

  // Check if the criteria is empty
  if (criteriaValue === "") {
    // Display an error message in the frontend
    const errorElement = document.querySelector(".js-error-message");
    errorElement.textContent = "Please enter a title";
    errorElement.classList.add("show");

    // Clear the 'show' class after the transition ends
    setTimeout(() => {
      errorElement.classList.remove("show");
    }, 3000); // Clear the message after 3 seconds

    return;
  }

  // Clear previous error messages
  const errorElement = document.querySelector(".js-error-message");
  errorElement.textContent = "Error";
  errorElement.classList.remove("show");

  // Fetch anime data based on the criteria
  fetchAnimeDataByCriteriaButton(criteriaValue);
});

// Function to show the dropdown
function showDropdown() {
  const dropdownElement = document.querySelector(".anime-dropdown");
  dropdownElement.style.display = "flex";
}

// Function to hide the dropdown
function hideDropdown() {
  const dropdownElement = document.querySelector(".anime-dropdown");
  dropdownElement.style.display = "none";
}

/*All waifu pic functionality*/
/*Get waifu pic category*/
function getCustomCategory(category) {
  const apiUrl = `https://nekos.best/api/v2/${category}`;
  fetchAndDisplayImage(apiUrl);
}

/*Get random waifu pic*/
function getRandomWaifu() {
  const apiUrl = "https://nekos.best/api/v2/waifu";
  fetchAndDisplayImage(apiUrl);
}

/*Fetch waifu pic*/
function fetchAndDisplayImage(apiUrl) {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const waifuImages = document.querySelectorAll(".js-img");
      waifuImages.forEach((waifuImage) => {
        // Extracting data from the JSON
        const firstResult = data.results[0];
        const artistHref = firstResult.artist_href ?? "Not found";
        const artistName = firstResult.artist_name ?? firstResult.anime_name;
        const sourceUrl = firstResult.source_url;
        const imageUrl = firstResult.url;
        const card = document.querySelector(".js-artist");

        waifuImage.src = imageUrl;
        waifuImage.alt = "Waifu Image";

        // Store the image URL in a variable for copy
        imageUrlCopy = imageUrl;

        // Update the artist information in the frontend
        card.classList.add("show");
        const artistNameElement = document.querySelector(".js-artist-name");
        const artistHrefElement = document.querySelector(".js-artist-href");
        const sourceUrlElement = document.querySelector(".js-source-url");
        const cardTitle = document.querySelector(".js-artist-title");
        const cardText = document.querySelectorAll(".js-card-text");

        cardText.forEach((cardText) => {
          if (artistName === firstResult.artist_name) {
            cardTitle.textContent = "Artist Information";
            cardText.classList.add("show");
            cardText.classList.remove("hide");
          } else {
            cardTitle.textContent = "Anime Information";
            cardText.classList.remove("show");
            cardText.classList.add("hide");
          }
        });

        artistNameElement.textContent = artistName;
        artistHrefElement.href = artistHref;
        sourceUrlElement.href = sourceUrl;
      });
    })
    .catch((error) => {
      console.error("Error fetching waifu image:", error);
    });
}

/*Copy img url to clipboard*/
function copyImageUrlToClipboard() {
  if (imageUrlCopy) {
    navigator.clipboard
      .writeText(imageUrlCopy)
      .then(() => {
        // Display the copy status message
        showCopyStatus();
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  }
}

function showCopyStatus() {
  const copyStatus = document.querySelector(".js-copy");

  // Add the 'show' class to trigger the transition
  copyStatus.classList.add("fa-fade");

  // Clear the 'show' class after the transition ends
  setTimeout(() => {
    copyStatus.classList.remove("fa-fade");
  }, 3000); // Clear the message after 3 seconds
}

// Attach click event listener to all buttons with the class "js-category-button"
const categoryButtons = document.querySelectorAll(".js-category-button");
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    getCustomCategory(category);
  });
});

// Attach click event listener to the button with the class "js-random-waifu"
const randomWaifuButton = document.querySelector(".js-random-waifu");
randomWaifuButton.addEventListener("click", getRandomWaifu);

// Attach click event listener to the button with the class "js-copy-url"
const copyUrlButton = document.querySelector(".js-copy-url");
let imageUrl = ""; // Variable to store the current image URL
copyUrlButton.addEventListener("click", copyImageUrlToClipboard);

function nav() {
  var header = document.getElementById("myHeader");
  var page = document.querySelector(".js-page");
  var openMenuButton = document.getElementById("openmenu");

  window.addEventListener("scroll", function () {
    page.classList.remove("menuopen");
    if (window.scrollY >= 100) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  // Event listener to remove the sticky class when the button is clicked
  openMenuButton.addEventListener("click", function () {
    header.classList.remove("sticky");
  });

  var links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      // Prevent the default action
      event.preventDefault();

      // Get the target element
      var targetId = this.getAttribute("href");
      var targetElement = document.querySelector(targetId);

      // Smooth scroll to target
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}

function init() {
  nav();
  /*load pic at page start*/
  getRandomWaifu();
}

document.addEventListener("DOMContentLoaded", init);
