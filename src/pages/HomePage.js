import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RecipeCardNew from '../components/RecipeCardNew';
import './HomePage.css';

const HomePage = ({ recipes, onDelete, onOpenFullScreen, onEdit }) => {
  const navigate = useNavigate();
  const [processedRecipes, setProcessedRecipes] = useState([]);

  // Effet pour traiter et valider les recettes
  useEffect(() => {
    // Fonction pour valider et nettoyer une recette
    const validateRecipe = (recipe) => {
      if (!recipe || typeof recipe !== 'object') {
        console.warn('Recette invalide:', recipe);
        return null;
      }

      // Vérification et nettoyage des champs
      return {
        id: recipe.id || Date.now(), // Générer un ID temporaire si absent
        title: recipe.title || 'Recette sans titre',
        prepTime: recipe.prepTime || '',
        imageUrl: recipe.imageUrl || 'https://via.placeholder.com/500x200',
        ingredients: Array.isArray(recipe.ingredients) 
          ? recipe.ingredients.filter(ing => ing && ing.trim() !== '')
          : [],
        instructions: Array.isArray(recipe.instructions) 
          ? recipe.instructions.filter(inst => inst && inst.trim() !== '')
          : [],
        price: recipe.price || ''
      };
    };

    // Traiter et filtrer les recettes
    const processedRecipes = recipes
      .map(validateRecipe)
      .filter(recipe => recipe !== null);

    setProcessedRecipes(processedRecipes);
  }, [recipes]);

  const handleEditRecipe = (recipe) => {
    // Vérification supplémentaire avant navigation
    if (!recipe) {
      console.error('Tentative de modification d\'une recette undefined');
      return;
    }

    navigate('/new-recipe', { 
      state: { recipe } 
    });
  };

  return (
    <div className="home-page">
      <h1>Mes Recettes</h1>
      
      <div className="home-page-actions">
        <Link to="/new-recipe" className="add-recipe-btn">
          Ajouter une nouvelle recette
        </Link>
        <Link to="/meal-planning" className="meal-planning-btn">
          Meal Planning
        </Link>
      </div>

      <div className="recipe-list">
        {processedRecipes.length > 0 ? (
          processedRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card-container">
              <RecipeCardNew 
                recipe={recipe} 
                onDelete={onDelete}
                onOpenFullScreen={onOpenFullScreen}
              />
              <button 
                className="edit-recipe-btn"
                onClick={() => handleEditRecipe(recipe)}
              >
                Modifier
              </button>
            </div>
          ))
        ) : (
          <div className="no-recipes">
            <p>Aucune recette trouvée. Commencez par ajouter une nouvelle recette !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 