import React, { useState } from 'react';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onDelete, onOpenFullScreen }) => {
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || 'https://via.placeholder.com/500x200');

  const handleImageError = () => {
    setImageUrl('https://via.placeholder.com/500x200');
  };

  const handleCardClick = () => {
    onOpenFullScreen(recipe);
  };

  return (
    <div className="recipe-card" onClick={handleCardClick}>
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
          <h3>{recipe.title}</h3>
          <div className="recipe-details">
            <p><strong>Temps de préparation :</strong> {recipe.prepTime}</p>
            <p><strong>Ingrédients :</strong></p>
            <ul>
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
              {recipe.ingredients.length > 3 && (
                <li>... et {recipe.ingredients.length - 3} autres</li>
              )}
            </ul>
            <p><strong>Instructions :</strong></p>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onDelete(recipe.id);
            }} 
            className="delete-btn"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard; 