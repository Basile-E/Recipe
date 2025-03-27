import React from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

function HomePage({ recipes, onDelete, onOpenFullScreen }) {
  return (
    <div className="home-page">
      <h1>Mes Recettes</h1>
      <Link to="/new-recipe" className="add-recipe-btn">
        Ajouter une nouvelle recette
      </Link>
      
      {recipes.length === 0 ? (
        <p>Aucune recette pour le moment. Commencez par en ajouter une !</p>
      ) : (
        <div className="recipe-list">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onDelete={onDelete} 
              onOpenFullScreen={onOpenFullScreen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage; 