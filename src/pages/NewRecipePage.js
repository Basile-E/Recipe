import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewRecipePage({ onAddRecipe }) {
  const navigate = useNavigate();
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    prepTime: '',
    imageUrl: '',
    ingredients: [''],
    instructions: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index] = value;
    setNewRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...newRecipe.instructions];
    newInstructions[index] = value;
    setNewRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addInstruction = () => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const addRecipe = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs obligatoires
      if (!newRecipe.title.trim()) {
        alert('Le titre de la recette est obligatoire');
        return;
      }

      if (newRecipe.ingredients.length === 0 || newRecipe.ingredients.every(ing => !ing.trim())) {
        alert('Veuillez ajouter au moins un ingrédient');
        return;
      }

      if (newRecipe.instructions.length === 0 || newRecipe.instructions.every(inst => !inst.trim())) {
        alert('Veuillez ajouter au moins une instruction');
        return;
      }

      await onAddRecipe(newRecipe);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la recette:', error);
      alert(`Impossible d'ajouter la recette : ${error.message}`);
    }
  };

  return (
    <div className="new-recipe-page">
      <div className="new-recipe-container">
        <h1>Créer une nouvelle recette</h1>
        <div className="recipe-form">
          <form onSubmit={addRecipe}>
            <div className="form-group">
              <label htmlFor="title">Titre de la recette</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Ex: Gâteau au chocolat"
                value={newRecipe.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prepTime">Temps de préparation</label>
              <input
                id="prepTime"
                type="text"
                name="prepTime"
                placeholder="Ex: 45 minutes"
                value={newRecipe.prepTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">URL de l'image (optionnel)</label>
              <input
                id="imageUrl"
                type="url"
                name="imageUrl"
                placeholder="Coller l'URL d'une image de votre recette"
                value={newRecipe.imageUrl}
                onChange={handleInputChange}
              />
              {newRecipe.imageUrl && (
                <div className="image-preview">
                  <img 
                    src={newRecipe.imageUrl} 
                    alt="Aperçu de la recette" 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>Ingrédients</h3>
              {newRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="form-group">
                  <input
                    type="text"
                    placeholder={`Ingrédient ${index + 1}`}
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              <button 
                type="button" 
                className="add-more-btn" 
                onClick={addIngredient}
              >
                + Ajouter un ingrédient
              </button>
            </div>
            
            <div className="form-section">
              <h3>Instructions</h3>
              {newRecipe.instructions.map((instruction, index) => (
                <div key={index} className="form-group">
                  <input
                    type="text"
                    placeholder={`Étape ${index + 1}`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              <button 
                type="button" 
                className="add-more-btn" 
                onClick={addInstruction}
              >
                + Ajouter une étape
              </button>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">Ajouter la recette</button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => navigate('/')}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewRecipePage; 