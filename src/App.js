import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewRecipePage from './pages/NewRecipePage';
import MealPlanningPage from './pages/MealPlanningPage';
import Auth from './components/Auth';
import { supabase, handleSupabaseError, testSupabaseConnection } from './supabaseClient';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [fullScreenRecipe, setFullScreenRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // Si l'utilisateur se connecte, charger les recettes
        if (event === 'SIGNED_IN') {
          fetchRecipes();
        }
      }
    );

    // Initialiser l'application
    const initializeApp = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        const isConnected = await testSupabaseConnection();
        
        if (isConnected) {
          setConnectionStatus('connected');
          if (user) {
            await fetchRecipes();
          }
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        setConnectionStatus('error');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Nettoyer l'écouteur lors du démontage
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*');

      if (error) {
        handleSupabaseError(error);
        return;
      }

      setRecipes(data || []);
    } catch (error) {
      handleSupabaseError(error);
    }
  };

  const addRecipe = async (newRecipe) => {
    try {
      console.log('Nouvelle recette reçue:', newRecipe);

      // Récupérer l'utilisateur actuellement connecté
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Utilisateur connecté:', user);

      if (!user) {
        console.error('Aucun utilisateur connecté');
        throw new Error('Vous devez être connecté pour ajouter une recette');
      }

      // Préparer la recette à ajouter
      const recipeToAdd = {
        title: newRecipe.title,
        prepTime: newRecipe.prepTime,
        imageUrl: newRecipe.imageUrl || 'https://via.placeholder.com/500x200',
        ingredients: Array.isArray(newRecipe.ingredients) 
          ? newRecipe.ingredients.filter(ing => ing.trim() !== '')
          : (newRecipe.ingredients || '').split(',').map(item => item.trim()).filter(item => item !== ''),
        instructions: Array.isArray(newRecipe.instructions)
          ? newRecipe.instructions.filter(inst => inst.trim() !== '')
          : (newRecipe.instructions || '').split(',').map(item => item.trim()).filter(item => item !== ''),
        user_id: user.id,
        price: newRecipe.price || ''
      };

      console.log('Recette à ajouter:', recipeToAdd);

      const { data, error } = await supabase
        .from('recipes')
        .insert(recipeToAdd)
        .select();

      console.log('Résultat de l\'insertion:', { data, error });

      if (error) {
        console.error('Erreur détaillée lors de l\'ajout:', error);
        throw error;
      }

      // Mettre à jour l'état local avec la nouvelle recette
      setRecipes(prev => [...prev, data[0]]);
      
      console.log('Recette ajoutée avec succès');
      return data[0];
    } catch (error) {
      console.error('Erreur complète lors de l\'ajout de la recette:', error);
      alert(`Impossible d'ajouter la recette : ${error.message}`);
      throw error;
    }
  };

  const deleteRecipe = async (id) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        handleSupabaseError(error);
        return;
      }

      // Mettre à jour l'état local
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      
      // Fermer la vue plein écran si la recette supprimée est en plein écran
      if (fullScreenRecipe && fullScreenRecipe.id === id) {
        setFullScreenRecipe(null);
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  };

  const editRecipe = async (recipeId, updatedRecipe) => {
    try {
      // Validation des paramètres d'entrée
      if (!recipeId) {
        console.error('ID de recette invalide');
        alert('Impossible de modifier la recette : ID manquant');
        return null;
      }

      // Validation et formatage du prix
      if (updatedRecipe.price) {
        // Remplacer les virgules par des points
        updatedRecipe.price = updatedRecipe.price.replace(',', '.');
        
        // Vérifier si le prix est un nombre valide
        if (isNaN(parseFloat(updatedRecipe.price))) {
          alert('Le prix doit être un nombre valide');
          return null;
        }
      }

      // Préparer les données à mettre à jour
      const recipeToUpdate = {
        title: updatedRecipe.title || '',
        prepTime: updatedRecipe.prepTime || '',
        imageUrl: updatedRecipe.imageUrl || '',
        ingredients: Array.isArray(updatedRecipe.ingredients) 
          ? updatedRecipe.ingredients.filter(ing => ing.trim() !== '')
          : [],
        instructions: Array.isArray(updatedRecipe.instructions)
          ? updatedRecipe.instructions.filter(inst => inst.trim() !== '')
          : [],
        price: updatedRecipe.price || ''
      };

      console.log('Mise à jour de la recette:', { recipeId, recipeToUpdate });

      const { data, error } = await supabase
        .from('recipes')
        .update(recipeToUpdate)
        .eq('id', recipeId)
        .select();

      if (error) {
        console.error('Erreur Supabase lors de la modification:', error);
        handleSupabaseError(error);
        return null;
      }

      if (!data || data.length === 0) {
        console.error('Aucune donnée retournée après modification');
        alert('Impossible de récupérer la recette modifiée');
        return null;
      }

      // Mettre à jour l'état local
      setRecipes(prev => 
        prev.map(recipe => 
          recipe.id === recipeId ? { ...recipe, ...data[0] } : recipe
        )
      );

      return data[0];
    } catch (error) {
      console.error('Erreur lors de la modification de la recette:', error);
      alert(`Impossible de modifier la recette : ${error.message}`);
      return null;
    }
  };

  const openFullScreen = (recipe) => {
    setFullScreenRecipe(recipe);
    document.body.classList.add('no-scroll');
  };

  const closeFullScreen = () => {
    setFullScreenRecipe(null);
    document.body.classList.remove('no-scroll');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setRecipes([]);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Écran de chargement personnalisé
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Connexion à Supabase...</p>
      </div>
    );
  }

  // Écran d'erreur de connexion
  if (connectionStatus === 'error') {
    return (
      <div className="error-screen">
        <h1>Erreur de connexion</h1>
        <p>Impossible de se connecter à Supabase. Vérifiez vos paramètres.</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {user ? (
            <>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    recipes={recipes} 
                    onDelete={deleteRecipe} 
                    onOpenFullScreen={openFullScreen}
                    onEdit={editRecipe}
                  />
                } 
              />
              <Route 
                path="/new-recipe" 
                element={<NewRecipePage onAddRecipe={addRecipe} onEditRecipe={editRecipe} />} 
              />
              <Route 
                path="/meal-planning" 
                element={<MealPlanningPage recipes={recipes} />} 
              />
              <Route 
                path="/auth" 
                element={<Navigate to="/" replace />} 
              />
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </>
          ) : (
            <>
              <Route 
                path="/auth" 
                element={<Auth />} 
              />
              <Route 
                path="*" 
                element={<Navigate to="/auth" replace />} 
              />
            </>
          )}
        </Routes>

        {/* Overlay plein écran */}
        {user && fullScreenRecipe && (
          <div className="full-screen-overlay" onClick={closeFullScreen}>
            <div 
              className="full-screen-recipe" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="full-screen-recipe-glass-overlay"></div>
              
              <button 
                className="close-full-screen-btn" 
                onClick={closeFullScreen}
              >
                ✕
              </button>

              <div className="full-screen-recipe-image">
                <img 
                  src={fullScreenRecipe.imageUrl || 'https://via.placeholder.com/500x200'} 
                  alt={fullScreenRecipe.title} 
                />
              </div>
              
              <div className="full-screen-recipe-content">
                <div className="full-screen-recipe-details">
                  <h2>{fullScreenRecipe.title}</h2>

                  <div className="recipe-prep-time">
                    <h3>Temps de préparation</h3>
                    <p>{fullScreenRecipe.prepTime || 'Non spécifié'}</p>
                  </div>

                  <div className="recipe-ingredients">
                    <h3>Ingrédients</h3>
                    <ul>
                      {fullScreenRecipe.ingredients && fullScreenRecipe.ingredients.length > 0 ? (
                        fullScreenRecipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))
                      ) : (
                        <li>Aucun ingrédient</li>
                      )}
                    </ul>
                  </div>

                  <div className="recipe-instructions">
                    <h3>Instructions</h3>
                    <ol>
                      {fullScreenRecipe.instructions && fullScreenRecipe.instructions.length > 0 ? (
                        fullScreenRecipe.instructions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))
                      ) : (
                        <li>Aucune instruction</li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {user && (
          <div className="app-navigation">
            <button 
              onClick={handleLogout} 
              className="logout-btn"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
