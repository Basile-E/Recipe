import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NewRecipePage({ onAddRecipe, onEditRecipe }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    prepTime: '',
    imageUrl: '',
    ingredients: [''],
    instructions: [''],
    price: ''
  });

  useEffect(() => {
    // Check if we're editing an existing recipe
    const state = location.state;
    if (state && state.recipe) {
      const { recipe } = state;
      setIsEditing(true);
      setRecipeId(recipe.id);
      setNewRecipe({
        title: recipe.title || '',
        prepTime: recipe.prepTime || '',
        imageUrl: recipe.imageUrl || '',
        ingredients: recipe.ingredients && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : [''],
        instructions: recipe.instructions && recipe.instructions.length > 0 
          ? recipe.instructions 
          : [''],
        price: recipe.price || ''
      });
    }
  }, [location]);

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

  const submitRecipe = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs obligatoires
      if (!newRecipe.title || !newRecipe.title.trim()) {
        alert('Le titre de la recette est obligatoire');
        return;
      }

      // Vérification des ingrédients
      const validIngredients = (newRecipe.ingredients || [])
        .filter(ing => ing && ing.trim() !== '');
      
      if (validIngredients.length === 0) {
        alert('Veuillez ajouter au moins un ingrédient');
        return;
      }

      // Vérification des instructions
      const validInstructions = (newRecipe.instructions || [])
        .filter(inst => inst && inst.trim() !== '');
      
      if (validInstructions.length === 0) {
        alert('Veuillez ajouter au moins une instruction');
        return;
      }

      // Validation et formatage du prix
      let formattedPrice = '';
      if (newRecipe.price) {
        // Remplacer les virgules par des points
        formattedPrice = newRecipe.price.replace(',', '.');
        
        // Vérifier si le prix est un nombre valide
        if (isNaN(parseFloat(formattedPrice))) {
          alert('Le prix doit être un nombre valide');
          return;
        }
      }

      // Préparer la recette à soumettre
      const recipeToSubmit = {
        title: newRecipe.title.trim(),
        prepTime: newRecipe.prepTime || '',
        imageUrl: newRecipe.imageUrl || '',
        ingredients: validIngredients,
        instructions: validInstructions,
        price: formattedPrice
      };

      console.log('Soumission de la recette:', recipeToSubmit);

      if (isEditing) {
        // Édition d'une recette existante
        if (!recipeId) {
          throw new Error('ID de recette manquant pour la modification');
        }
        await onEditRecipe(recipeId, recipeToSubmit);
      } else {
        // Ajout d'une nouvelle recette
        await onAddRecipe(recipeToSubmit);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la soumission de la recette:', error);
      alert(`Impossible de soumettre la recette : ${error.message}`);
    }
  };

  return (
    <div className="new-recipe-page">
      <div className="new-recipe-container">
        <h1>{isEditing ? 'Modifier la recette' : 'Créer une nouvelle recette'}</h1>
        <div className="recipe-form">
          <form onSubmit={submitRecipe}>
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
              <label htmlFor="price">Prix (optionnel)</label>
              <input
                id="price"
                type="text"
                name="price"
                placeholder="Ex: 15.50"
                value={newRecipe.price}
                onChange={handleInputChange}
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
              <button type="submit" className="submit-btn">
                {isEditing ? 'Modifier la recette' : 'Ajouter la recette'}
              </button>
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