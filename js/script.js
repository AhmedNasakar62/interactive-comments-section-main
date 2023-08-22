//Variables
const htmlArticles = document.querySelectorAll(".secondary-article");
const Scores = document.querySelectorAll(".score");
const incrementButtons = document.querySelectorAll(".plus");
const decrementButtons = document.querySelectorAll(".minus");
const replyButtons = document.querySelectorAll(".reply-selector");
const responseField = document.querySelectorAll(".field");
const formFields = document.querySelectorAll(".form");
const responseComments = document.querySelectorAll(".response-comment");
const deleteButton = document.querySelector(".delete");
const editButton = document.querySelector(".edit");
const updateField = document.querySelector(".update");
const replySections = document.querySelectorAll(".reply-section");
const wrapper = document.querySelector(".wrapper");
const noButton = document.querySelector(".no");
const yesButton = document.querySelector(".yes");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Fetch data from API
  fetch("data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Populate data on page load
      populatePage(data);
    });
});

//Functions
function populatePage(data) {
  // Populate articles and scores
  populateArticlesAndScores(data.comments);

  // Populate replies
  populateReplies(data.comments[1].replies);

  // Set up event listeners
  setupEventListeners();
}

function populateArticlesAndScores(comments) {
  // Populate articles and scores
  comments.forEach((comment) => {
    // Get the ID from API data
    const apiComment = comment.id;

    // Loop through HTML elements
    htmlArticles.forEach((htmlArticle) => {
      Scores.forEach((score) => {
        // Get the ID from HTML elements
        const commentArticle = htmlArticle.id;
        const scoreId = score.id;

        // Compare IDs and insert content
        if (apiComment == commentArticle && apiComment == scoreId) {
          const contents = `
                  <p>${comment.content}</p>
                `;
          const scores = `
                  <p style="font-weight: 600; color: hsl(238, 40%, 52%);">${comment.score}</p>
                `;

          htmlArticle.innerHTML = contents;
          score.innerHTML = scores;
          const scoreValue = score.children[0];
          scoreValue.id = scoreId;
        }
      });
    });
  });
}

function populateReplies(replies) {
  // Populate replies
  replies.forEach((reply) => {
    // Get the ID from API data
    const apiReply = reply.id;

    // Loop through HTML elements
    htmlArticles.forEach((htmlArticle) => {
      Scores.forEach((score) => {
        // Get the ID from HTML elements
        const commentArticle = htmlArticle.id;
        const scoreId = score.id;

        // Compare IDs and insert content
        if (apiReply == commentArticle && apiReply == scoreId) {
          const contents = `
                  <p id="${reply.id}"><span style="font-weight: 600; color: hsl(238, 40%, 52%);">@${reply.replyingTo}</span> ${reply.content}</p>
              `;

          const scores = `
                  <p  style="font-weight: 600; color: hsl(238, 40%, 52%);">${reply.score}</p>
                `;

          htmlArticle.innerHTML = contents;
          score.innerHTML = scores;
          const scoreValue = score.children[0];
          scoreValue.id = scoreId;
        }
      });
    });
  });
}

function setupEventListeners() {
  // Edit Button
  editButton.addEventListener("click", () => {
    const selectorId = editButton.getAttribute("id");

    responseField.forEach((response) => {
      if (response.id === selectorId) {
        const replyParent = response.closest(".reply-section");
        replyParent.style.display = "block";

        htmlArticles.forEach((htmlArticle) => {
          const htmlArticleId = htmlArticle.id;
          if (htmlArticleId === selectorId) {
            const articleContent = htmlArticle.children[0];
            const input = updateField.querySelector("input");
            input.value = articleContent.textContent;

            // Show the reply form
            const replyForm = replyParent.querySelector(".update");
            replyForm.addEventListener("submit", (e) => {
              e.preventDefault();
              // Get the updated content
              const updatedContent = input.value;
              // Update content on the screen
              articleContent.textContent = updatedContent;

              // Update local storage
              updateLocalStorageContent(selectorId, updatedContent);

              // Clear the input field after submission
              input.value = "";

              // Hide the reply form after submission
              replyParent.style.display = "none";
            });
          }
        });
      }
    });
  });

  // Increment Buttons
  incrementButtons.forEach((incrementButton) => {
    incrementButton.addEventListener("click", () => {
      const parentScoreSpace = incrementButton.closest(".scoreSpace");
      const parentScore = parentScoreSpace.querySelector(".score");
      const scoreId = parentScore.getAttribute("id");
      const scoreValue = parentScore.children[0];

      if (scoreValue.id === scoreId) {
        // Increment the score
        const newScore = parseInt(scoreValue.textContent) + 1;
        scoreValue.textContent = newScore;

        // Update local storage
        updateLocalStorage(scoreId, scoreValue);
      }
    });
  });

  // Decrement Buttons
  decrementButtons.forEach((decrementButton) => {
    decrementButton.addEventListener("click", () => {
      const parentScoreSpace = decrementButton.closest(".scoreSpace");
      const parentScore = parentScoreSpace.querySelector(".score");
      const scoreId = parentScore.getAttribute("id");
      const scoreValue = parentScore.children[0];

      if (scoreValue.id === scoreId) {
        // Decrement the score
        const newScore = parseInt(scoreValue.textContent) - 1;

        scoreValue.textContent = newScore;
        // Update local storage
        updateLocalStorage(scoreId, scoreValue);
      }
    });
  });

  // Print local storage value on load for Increment & decrement
  let incrementdecrementValues = getLocalStorage();

  Scores.forEach((score) => {
    const scoreId = score.getAttribute("id");
    const scoreValue = score.children[0];

    if (scoreValue.id === scoreId) {
      // Increment the score based on local storage value
      const storedValue = incrementdecrementValues.find(
        (item) => item.id === scoreId
      );
      if (storedValue) {
        scoreValue.textContent = storedValue.value;
      }
    }
  });

  // Reply Buttons
  replyButtons.forEach((replyButton) => {
    replyButton.addEventListener("click", () => {
      const selector = replyButton.querySelector(".response");
      const selectorId = selector.getAttribute("id");

      responseField.forEach((response) => {
        if (response.id === selectorId) {
          const replyParent = response.closest(".reply-section");
          replyParent.style.display = "block";
        }
      });
    });
  });

  // Form Field
  formFields.forEach((formField) => {
    formField.addEventListener("submit", (e) => {
      e.preventDefault();
      const formId = formField.getAttribute("id");
      const input = formField.querySelector("input");

      responseComments.forEach((responseComment) => {
        if (responseComment.id === formId) {
          const response = responseComment;

          // Create a new comment element with the submitted content
          const newComment = document.createElement("div");
          newComment.id = formId;
          newComment.className = "comment";
          newComment.innerHTML = `<p>${input.value}</p>`;

          // Append the new comment to the response comment section
          response.appendChild(newComment);

          let storeResponse = getLocalStorage();
          storeResponse.push({ id: formId, content: input.value });
          localStorage.setItem("responses", JSON.stringify(storeResponse));

          // Clear the input field after submission
          input.value = "";

          // Reload after submission
          replySections.forEach((replySection) => {
            replySection.style.display = "none";
          });
        }
      });
    });
  });

  // Display stored responses
  let storedResponses = getLocalStorage();

  responseComments.forEach((responseComment) => {
    const responseId = responseComment.getAttribute("id");

    storedResponses.forEach((response) => {
      if (response.content !== undefined) {
        if (response.id === responseId) {
          const comment = document.createElement("div");
          comment.className = "comment";
          comment.innerHTML = `<p>${response.content}</p>`;
          responseComment.appendChild(comment);
        }
      }
    });
  });

  // Delete Button
  deleteButton.addEventListener("click", () => {
    wrapper.style.display = "block";

    noButton.addEventListener("click", () => {
      wrapper.style.display = "none";
    });

    yesButton.addEventListener("click", () => {
      const selectorId = editButton.getAttribute("id");

      // Remove the article from the local storage
      removeArticleFromLocalStorage(selectorId);

      // Remove the article from the screen
      removeArticleFromScreen(selectorId);

      wrapper.style.display = "none";
    });
  });

  // Function to remove article from local storage
  const removeArticleFromLocalStorage = (articleId) => {
    let scoreValues = getLocalStorage();

    // Find the index of the article based on its ID
    const index = scoreValues.findIndex((item) => item.id === articleId);

    if (index !== -1) {
      // Remove the entry from the array
      scoreValues.splice(index, 1);

      // Update local storage
      localStorage.setItem("responses", JSON.stringify(scoreValues));
    }
  };

  // Function to remove article from the screen
  const removeArticleFromScreen = (articleId) => {
    htmlArticles.forEach((htmlArticle) => {
      if (htmlArticle.id === articleId) {
        // Clear the content
        htmlArticle.innerHTML = "";
      }
    });
  };

  // Update local storage content
  const updateLocalStorageContent = (id, articleContent) => {
    let scoreValues = getLocalStorage();

    // Find the index of the score value based on its ID
    const index = scoreValues.findIndex((item) => item.id === id);

    if (index !== -1) {
      // Update the content only
      scoreValues[index].content = articleContent;
    } else {
      // If the score is not found, add a new entry to the array
      scoreValues.push({
        id: id,
        // Add content
        content: articleContent,
      });
    }

    // Convert scoreValues array into string and update local storage
    localStorage.setItem("responses", JSON.stringify(scoreValues));
  };
}

// Set & update local storage
const updateLocalStorage = (id, value) => {
  let scoreValues = getLocalStorage();

  // Find the index of the score value based on its ID
  const index = scoreValues.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Update the score value at the found index
    scoreValues[index].value = parseInt(value.textContent);
  } else {
    // If the score is not found, add a new entry to the array
    scoreValues.push({
      id: id,
      value: parseInt(value.textContent),
    });
  }

  // Convert scoreValues array into string and update local storage
  localStorage.setItem("responses", JSON.stringify(scoreValues));
};

// Get local storage
const getLocalStorage = () => {
  let responseValues;
  const responseValuesLS = JSON.parse(localStorage.getItem("responses"));

  // Get the values and if null is returned then create an empty array
  if (responseValuesLS === null) {
    responseValues = [];
  } else {
    responseValues = responseValuesLS;
  }
  return responseValues;
};
