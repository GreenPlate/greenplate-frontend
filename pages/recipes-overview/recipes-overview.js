import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "./../../utility.js"

export async function initRecipesOverview(){
    console.log("initRecipesOverview()");

    await getRecipes()

}

async function getRecipes(){
    console.log("getRecipes()")
    
    // fetch recipes from database
    const recipes = [
        {
            "recipeId": 1,
            "recipeTitle": "Spaghetti Bolognese",
            "recipeBody": "Classic Italian pasta dish with a rich meat sauce.",
            "recipeIngredients": "500g ground beef, 1 onion, 2 cloves garlic, 1 can crushed tomatoes, 1 tsp oregano, 2 tbsp tomato paste, salt, pepper, 400g spaghetti"
        },
        {
            "recipeId": 2,
            "recipeTitle": "Chicken Caesar Salad",
            "recipeBody": "A refreshing salad with grilled chicken and Caesar dressing.",
            "recipeIngredients": "2 boneless chicken breasts, Romaine lettuce, croutons, Parmesan cheese, Caesar dressing"
        },
        {
            "recipeId": 3,
            "recipeTitle": "Vegetarian Stir Fry",
            "recipeBody": "Quick and healthy stir-fried vegetables with tofu.",
            "recipeIngredients": "1 block tofu, broccoli, bell peppers, carrots, soy sauce, ginger, garlic, sesame oil"
        },
        {
            "recipeId": 4,
            "recipeTitle": "Mango Avocado Salsa",
            "recipeBody": "A fruity salsa with a hint of spice.",
            "recipeIngredients": "2 ripe mangoes, 2 avocados, red onion, cilantro, lime juice, jalapeño, salt"
        },
        {
            "recipeId": 5,
            "recipeTitle": "Shrimp Scampi Pasta",
            "recipeBody": "Garlicky shrimp served over a bed of linguine.",
            "recipeIngredients": "250g linguine, 1 lb shrimp, garlic, white wine, lemon juice, parsley, salt, pepper"
        },
        {
            "recipeId": 6,
            "recipeTitle": "Caprese Salad",
            "recipeBody": "Simple and classic Italian salad with fresh tomatoes, mozzarella, and basil.",
            "recipeIngredients": "Tomatoes, fresh mozzarella, fresh basil, balsamic glaze, olive oil, salt, pepper"
        },
        {
            "recipeId": 7,
            "recipeTitle": "BBQ Chicken Pizza",
            "recipeBody": "Homemade pizza topped with BBQ chicken, red onions, and cilantro.",
            "recipeIngredients": "Pizza dough, cooked chicken, BBQ sauce, red onion, cilantro, mozzarella cheese"
        },
        {
            "recipeId": 8,
            "recipeTitle": "Quinoa Salad with Roasted Vegetables",
            "recipeBody": "Healthy and hearty salad with quinoa, roasted veggies, and a lemon vinaigrette.",
            "recipeIngredients": "Quinoa, cherry tomatoes, bell peppers, zucchini, red onion, olive oil, lemon juice, feta cheese"
        },
        {
            "recipeId": 9,
            "recipeTitle": "Beef and Broccoli Stir Fry",
            "recipeBody": "Quick and flavorful stir fry with tender beef and crisp broccoli.",
            "recipeIngredients": "500g beef sirloin, broccoli, soy sauce, ginger, garlic, sesame oil, rice vinegar"
        },
        {
            "recipeId": 10,
            "recipeTitle": "Chocolate Banana Smoothie",
            "recipeBody": "A delicious and indulgent smoothie with chocolate and banana.",
            "recipeIngredients": "2 ripe bananas, milk, chocolate protein powder, peanut butter, ice cubes"
        },
    ];

    // Map recipes to innerHTML
    const recipeRows = recipes.map(recipe => `
        <div class="custom-card mt-2">
            <div class="card-body">
                <h5 class="card-title">${recipe.recipeTitle}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${recipe.recipeIngredients}</h6>
                <p class="card-text">${recipe.recipeBody}<p>
                <button id="${recipe.recipeId}_recipeid" href="#" class="card-link">Ændre opskrift</button>
                <button id="${recipe.recipeId}_recipeid" href="#" class="card-link">Slet opskrift</button>
            </div>
        </div>
    `).join("");

    document.querySelector('#recipe-section').innerHTML = sanitizeStringWithTableRows(recipeRows);


    // Setup event listeners on change or delete buttons
    const buttons = document.querySelectorAll('.custom-card button');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const recipeId = event.target.id.split('_')[0];
            const action = event.target.textContent.trim().toLowerCase(); // "Ændre opskrift" or "Slet opskrift"

            if (action === 'ændre opskrift') {
                // Handle change button click
                console.log(`Change recipe with ID ${recipeId}`);

                 // Find the selected recipe based on the recipeId
                 const selectedRecipe = recipes.find(recipe => recipe.recipeId === parseInt(recipeId));

                // Populate the modal with recipe information
                document.getElementById('modal-recipe-id').textContent = `Recipe ID: ${selectedRecipe.recipeId}`;
                document.getElementById('recipe-name').value = selectedRecipe.recipeTitle;
                document.getElementById('recipe-ingredients').value = selectedRecipe.recipeIngredients;
                document.getElementById('recipe-body').value = selectedRecipe.recipeBody;
 
                 // Open the modal
                const changeRecipeModal = new bootstrap.Modal(document.getElementById('changeRecipe'));
                changeRecipeModal.show();

            } else if (action === 'slet opskrift') {
                // Handle delete button click
                console.log(`Delete recipe with ID ${recipeId}`);
            }
        });
    });

    // Setup event listener for "Gem opskrift" button in the modal
    const saveButton = document.getElementById('save-recipe-button');
    saveButton.addEventListener('click', saveRecipe);
}


function saveRecipe() {
    console.log("saveRecipe()")

    // Build JSON object
    const patchRecipe = {
        "recipeId": document.querySelector('#modal-recipe-id').value,
        "recipeTitle": document.querySelector('#recipe-name').value,
        "recipeBody": document.querySelector('#recipe-body').value,
        "recipeIngredients": document.querySelector('#recipe-ingredients').value,
    };

    console.log(patchRecipe);
}

