import React, { useState } from 'react';
import './RecipeCardNew.css';

const RecipeCardNew = ({ recipe, onDelete, onOpenFullScreen }) => {
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl || 'https://via.placeholder.com/500x200');

  const handleImageError = () => {
    setImageUrl('https://via.placeholder.com/500x200');
  };

  const handleCardClick = () => {
    if (onOpenFullScreen) {
      onOpenFullScreen(recipe);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (onDelete) {
      try {
        await onDelete(recipe.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (!recipe) {
    return <div className="recipe-card-empty">Aucune recette trouvée</div>;
  }

  return (
    <div 
      className="recipe-card" 
      onClick={handleCardClick}
    >
      <div className="recipe-card-image">
        <img 
          src={imageUrl} 
          alt={recipe.title} 
          onError={handleImageError}
        />
      </div>
      
      <div className="recipe-card-content">
        <div className="recipe-card-glass-overlay"></div>
        <div className="recipe-card-inner-content">
          {/* Titre de la recette */}
          <h3 className="recipe-title">{recipe.title}</h3>

          {/* Section Temps de préparation */}
          <div className="recipe-prep-time">
            <strong>Temps de préparation :</strong>
            <p>{recipe.prepTime || 'Non spécifié'}</p>
          </div>

          {/* Section Ingrédients */}
          <div className="recipe-ingredients">
            <strong>Ingrédients :</strong>
            <ul>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))
              ) : (
                <li>Aucun ingrédient</li>
              )}
            </ul>
          </div>

          {/* Section Instructions */}
          <div className="recipe-instructions">
            <strong>Instructions :</strong>
            <ol>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : (
                <li>Aucune instruction</li>
              )}
            </ol>
          </div>

          {/* Section Prix */}
          <div className="recipe-price">
            <strong>Prix :</strong>
            <p>{recipe.price ? `${recipe.price} €` : 'Non spécifié'}</p>
          </div>

          {/* Bouton de suppression */}
          {onDelete && (
            <button 
              className="delete-btn"
              onClick={handleDelete}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCardNew; 