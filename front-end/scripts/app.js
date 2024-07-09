// Empty array to initialize the recipe list.
let recipes = [];

// The following function adds a new recipe as an object to the database with a unique ID, name, description, category
// and default value for favorite (false).
async function addRecipe(name, description, category) {
    try {
        await axios.post("http://localhost:3000/recipes", {
            name,
            description,
            category,
            favorite: false,
        });
        document.getElementById("rcpName").value = "";
        document.getElementById("rcpDescription").value = "";
        document.getElementById("rcpCategory").value = "Breakfast";
        displayRecipes();
    } catch (error) {
        console.error("Error adding recipe:", error.response.data || error.message);
		showAlert("An error occurred while adding the recipe. Please try again.");
    }
}

// The following function gets the recipes from the database and displays them.
async function displayRecipes(recipeData = null) { // Handles null default value.
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = "";
    try {
        if (!recipeData) { // Only fetches the data if recipeData is null
            const response = await axios.get("http://localhost:3000/recipes/");
            if (response.status !== 200) {
                console.error("Error fetching data:", response.statusText);
                return;
            }
            recipeData = response.data; // Assigns fetched data from backend to recipeData variable.
        }

        recipes = recipeData;

        recipeData.forEach(recipe => { // Use the passed recipeData
            const recipeItem = document.createElement("li");
            const recipeDetails = document.createElement("span");
            recipeDetails.textContent = `${recipe.name} - ${recipe.description} - ${recipe.category}`;

            const favoriteButton = document.createElement("button");
            const favoriteButtonIcon = document.createElement("span");
            favoriteButtonIcon.className = "material-symbols-outlined";
            favoriteButtonIcon.textContent = "favorite";
            favoriteButton.className = "favorite-button";
            favoriteButton.dataset.id = recipe.recipe_id;
            favoriteButton.addEventListener("click", async () => {
                await toggleRecipeFavorite(recipe.recipe_id);
                displayRecipes();
            });
            updateFavoriteButton(favoriteButton, recipe.favorite);

            const deleteButton = document.createElement("button");
            const deleteButtonIcon = document.createElement("span");
            deleteButtonIcon.className = "material-symbols-outlined";
            deleteButtonIcon.textContent = "delete";
            deleteButton.className = "delete-button";
            deleteButton.addEventListener("click", async () => {
                await deleteRecipe(recipe.recipe_id);
                displayRecipes();
            });

            const updateDescriptionButton = document.createElement("button");
            const updateDescriptionIcon = document.createElement("span");
            updateDescriptionIcon.className = "material-symbols-outlined";
            updateDescriptionIcon.textContent = "edit";
            updateDescriptionButton.className = "update-description-button";
            updateDescriptionButton.addEventListener("click", () => {
                promptUpdateDescription(recipe.recipe_id);
            });

            updateDescriptionButton.appendChild(updateDescriptionIcon);
            favoriteButton.appendChild(favoriteButtonIcon);
            deleteButton.appendChild(deleteButtonIcon);
            recipeItem.appendChild(recipeDetails);
            recipeItem.appendChild(favoriteButton);
            recipeItem.appendChild(deleteButton);
            recipeItem.appendChild(updateDescriptionButton);
            recipeList.appendChild(recipeItem);
        });
    } catch (error) {
        console.error("Error viewing recipe:", error.response.data || error.message);
		showAlert("An error occurred while viewing the recipes. Please try again.");
    }
}

//The following function is a helper function that flips the text content of the favorite button
//based on a given recipe's favorite status.
function updateFavoriteButton(button, isFavorited) {
    if (isFavorited) {
        button.classList.add("favorited");
        button.classList.remove("not-favorited");
    } else {
        button.classList.remove("favorited");
        button.classList.add("not-favorited");
    }
}

// The following function flips the favorite status of a specified recipe based on its id.
async function toggleRecipeFavorite(id) {
    try {
        const button = document.querySelector(`button[data-id="${id}"]`);
        const isFavorited = button.classList.contains("favorited");

        const response = await axios.put(`http://localhost:3000/recipes/${id}/favorite`, { favorite: !isFavorited });
        if (response.status === 200) {
            updateFavoriteButton(button, !isFavorited);
        }
    } catch (error) {
		console.error("Error favoriting/unfavoriting recipe:", error.response.data || error.message);
		showAlert("An error occurred while favoriting/unfavoriting the recipe. Please try again.");
    }
}

// The following function deletes a specific recipe from the database based on its id.
async function deleteRecipe(id) {
    try {
        const response = await axios.delete(`http://localhost:3000/recipes/${id}`);
        if (response.status === 200) {
            console.log(`Recipe with the ID ${id} was deleted`);
        } else {
            console.error("Error deleting recipe:", response.statusText);
        }
    } catch (error) {
		console.error("Error deleting recipe:", error.response.data || error.message);
		showAlert("An error occurred while deleting the recipe. Please try again.");
    }
}

// The following function returns a new array that includes only the recipes that are marked as favorites.
async function filterFavoriteRecipes() {
    try {
        const response = await axios.get("http://localhost:3000/recipes/favorites");
        return response.data;
    } catch (error) {
        console.error("Error viewing favorite recipes:", error.response.data || error.message);
		showAlert("An error occurred while viewing the favorite recipes. Please try again.");
    }
}

//The following function sorts the recipes by their category(Alphabetically).
async function sortRecipesByCategory() {
    try {
        const response = await axios.get("http://localhost:3000/recipes/sort");
        if (response.status === 200) {
            displayRecipes(response.data);
        } else {
            console.error("Error fetching the data", response.statusText);
        }
    } catch (error) {
        console.error("Error sorting recipes:", error.response.data || error.message);
		showAlert("An error occurred while sorting the recipes. Please try again.");
    }
}

// The following function updates the description of a specific recipe by its id.
async function updateRecipeDescription(id, newDescription) {
    try {
        await axios.put(`http://localhost:3000/recipes/${id}`, { description: newDescription });
        console.log("Recipe description updated successfully");
        displayRecipes();
    } catch (error) {
        console.error("Error updating recipe description:", error.response.data);
        showAlert("An error occurred while updating the recipe description. Please try again.");
    }
}

// The following function finds the recipe with the matching id
// and if it find it, it shows the modal with it's current description
function promptUpdateDescription(id) {
    const recipe = recipes.find(recipe => recipe.recipe_id === id); // Ensure the correct field is used for finding the recipe
    if (recipe) {
        showModal(id, recipe.description); 
    } else {
        console.error("Recipe not found");
    }
}

// The following function logs a summary of the recipes array
//(total amount, total amount of favorite recipes, total amount of not favorite recipes)
async function generateRecipeReport() {
    try {
        const response = await axios.get("http://localhost:3000/recipes");
        if (response.status === 200) {
            const recipes = response.data;
            const totalRecipes = recipes.length;
            const favoriteRecipes = recipes.filter(recipe => recipe.favorite).length;
            const notFavoriteRecipes = totalRecipes - favoriteRecipes;
            const reportDiv = document.getElementById("recipeReport");
            reportDiv.innerHTML = "";
            
            const totalRecipesPara = document.createElement("p");
            totalRecipesPara.textContent = `Total recipes: ${totalRecipes}`;
            reportDiv.appendChild(totalRecipesPara);

            const favoriteRecipesPara = document.createElement("p");
            favoriteRecipesPara.textContent = `Number of favorite recipes: ${favoriteRecipes}`;
            reportDiv.appendChild(favoriteRecipesPara);

            const notFavoriteRecipesPara = document.createElement("p");
            notFavoriteRecipesPara.textContent = `Number of recipes not marked as favorites: ${notFavoriteRecipes}`;
            reportDiv.appendChild(notFavoriteRecipesPara);
        } else {
            console.error("Error fetching data:", response.statusText);
            showAlert("An error occurred while creating a report. Please try again.");
        }
    } catch (error) {
        console.error("Error generating report:", error.response.data || error.message);
		showAlert("An error occurred while creating a report. Please try again.");
    }
}

// The following function returns a new array containing only the recipes
// where the name, description or category includes the search term
async function searchRecipes(term) {
    const termLowerCase = term.toLowerCase();
    try {
        const response = await axios.get("http://localhost:3000/recipes/search", {
            params: {
                name: termLowerCase,
                description: termLowerCase,
                category: termLowerCase
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Error fetching search results:", response.statusText);
            return [];
        }
    } catch (error) {
		console.error("Error searching recipes:", error.response.data || error.message);
		showAlert("An error occurred while searching. Please try again.");
        return [];
    }
}

// Event listener for adding a new recipe.
document.getElementById("addRecipeButton").addEventListener("click", () => {
    const recipeName = document.getElementById("rcpName").value.trim();
    const recipeDescription = document.getElementById("rcpDescription").value.trim();
    const recipeCategory = document.getElementById("rcpCategory").value;
    const errorMessage = document.getElementById("name-descriptionErrorMessage");

    if (!recipeName || !recipeDescription) {
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
        addRecipe(recipeName, recipeDescription, recipeCategory);
        recipeName.value = "";
        recipeDescription.value = "";
        recipeCategory.value = "Breakfast";
    }
});

// Event listener for displaying all the recipes.
document.getElementById("showAll").addEventListener("click", async () => {
    await displayRecipes();
});

// Event listener for displaying all the favorite recipes.
document.getElementById("showFavorites").addEventListener("click", async () => {
    const favoriteRecipes = await filterFavoriteRecipes();
    await displayRecipes(favoriteRecipes);
});

// Event listener for generating a report of the recipes and showing it/hiding it based on its visibility.
document.getElementById("recipeReporter").addEventListener("click", async () => {
    const reportDiv = document.getElementById("recipeReport");
    if (reportDiv.style.display === "none" || !reportDiv.innerHTML) {
        await generateRecipeReport();
        reportDiv.style.display = "block";
    } else {
        reportDiv.style.display = "none";
    }
});

// Event listener for sorting the recipes by their category alphabetically (Descending).
document.getElementById("sortByCategory").addEventListener("click", async () => {
    await sortRecipesByCategory();
});

// Event listener for searching functionality
document.getElementById("searchInput").addEventListener("input", async () => {
    const recipeSearchInput = document.getElementById("searchInput");
    const recipeSearch = recipeSearchInput.value.trim();
    if (recipeSearch.length > 0) {
        const searchResult = await searchRecipes(recipeSearch);
        displayRecipes(searchResult);
    } else {
        displayRecipes();
    }
});

// Getters for the modal elements
const modal = document.getElementById("updateDescriptionModal");
const closeButton = document.getElementById("close");
const updateButton = document.getElementById("updateButton");
let currentRecipeId = null;

// The following function shows the modal that shows up when editing a recipe's description.
function showModal(id, currentDescription) {
    currentRecipeId = id;
    const newDescriptionField = document.getElementById("newDescription");
    newDescriptionField.value = currentDescription; 
    modal.style.display = "block";
}

//The following function hides the modal and resets it's textarea
function closeModal() {
    modal.style.display = "none";
    document.getElementById("newDescription").value = "";
    document.getElementById("errorMessage").style.display = "none";
}

//The following function closes the modal when the user clicks the close(x) button.
closeButton.onclick = function () {
    closeModal();
}

//The following function closes the modal when the user clicks anywhere outside of the modal.
window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

//The following function updates the recipe description when the update button (that is inside the modal) is clicked
updateButton.onclick = async function () {
    const newDescription = document.getElementById("newDescription").value;
    const errorMessage = document.getElementById("errorMessage");
    if (newDescription) {
        await updateRecipeDescription(currentRecipeId, newDescription);
        closeModal();
    } else {
        errorMessage.style.display = "block";
    }
}

//The following function is a helper function that shows a div with error details.
//It shows up when something goes wrong.
function showAlert(message) {
    const alertDiv = document.getElementById("alertDiv");
    alertDiv.textContent = message;
    alertDiv.style.display = "block";

    setTimeout(() => {
        alertDiv.style.display = "none";
    }, 6000);
}

// Initial display of recipes
displayRecipes();

//The following function tests the connection with the server.
async function connection() {
	try {
		const connTest = await axios.get("http://localhost:3000/recipes/");
    	console.log(connTest)
	} catch (error) {
		console.error("Error testing the connection:", error.response.data || error.message);
	}  
}

connection();