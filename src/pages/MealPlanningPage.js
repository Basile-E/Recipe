import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom';
import './MealPlanningPage.css';

// Draggable Recipe Card Component
const DraggableRecipeCard = ({ recipe, index, moveRecipe, className = '' }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'RECIPE',
    item: { id: recipe.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`draggable-recipe-card ${isDragging ? 'dragging' : ''} ${className}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img 
        src={recipe.imageUrl || 'https://via.placeholder.com/150'} 
        alt={recipe.title} 
      />
      <p>{recipe.title}</p>
    </div>
  );
};

// Droppable Slot Component
const DroppableSlot = ({ slot, onDrop, onDelete, isWeekView = false }) => {
  const [{ isOver }, drop] = useDrop({
    accept: isWeekView ? ['RECIPE', 'SAVED_DAY'] : 'RECIPE',
    drop: (item) => {
      // Determine if the dropped item is a recipe or a saved day
      if (item.recipes) {
        // It's a saved day
        onDrop(item, null, true);
      } else {
        // It's a recipe
        onDrop(item, null, isWeekView);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`day-slot ${isOver ? 'highlight' : ''}`}
    >
      {slot ? (
        <div className="day-slot-recipe">
          <DraggableRecipeCard 
            recipe={slot} 
            index={0} 
            moveRecipe={() => {}} 
            className="in-day-slot"
          />
          <button 
            className="delete-day-slot-recipe" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <p>Glisser une recette ou un jour ici</p>
      )}
    </div>
  );
};

// Draggable Saved Day Component
const DraggableSavedDay = ({ savedDay }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SAVED_DAY',
    item: savedDay,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag}
      className="saved-day-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="saved-day-draggable">
        <div className="saved-day-header">
          <span>{savedDay.date}</span>
          <span>{savedDay.totalPrice} €</span>
        </div>
        <div className="saved-day-recipes">
          {savedDay.recipes
            .filter(recipe => recipe)
            .map((recipe, index) => (
              <div key={index} className="saved-day-recipe">
                {recipe.title}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

function MealPlanningPage({ recipes }) {
  const [activeView, setActiveView] = useState('day');
  const [daySlots, setDaySlots] = useState([null, null, null]);
  const [savedDays, setSavedDays] = useState([]);
  const [weekSlots, setWeekSlots] = useState(Array(7).fill(null));

  // Calculer le prix total des recettes du jour
  const calculateDailyTotalPrice = (slots = daySlots) => {
    const validRecipes = slots.filter(slot => slot && slot.price);
    
    const totalPrice = validRecipes.reduce((total, recipe) => {
      // Convertir le prix en nombre, en gérant les virgules et les points
      const price = parseFloat(
        recipe.price.replace(',', '.')
      );
      
      return isNaN(price) ? total : total + price;
    }, 0);

    return totalPrice.toFixed(2);
  };

  const handleSaveDay = () => {
    // Vérifier si le jour a des recettes
    if (daySlots.some(slot => slot !== null)) {
      const newSavedDay = {
        id: Date.now(), // Identifiant unique
        recipes: daySlots,
        totalPrice: calculateDailyTotalPrice(),
        date: new Date().toLocaleDateString()
      };

      setSavedDays(prev => [...prev, newSavedDay]);
      
      // Optionnel : réinitialiser les slots du jour après sauvegarde
      setDaySlots([null, null, null]);
    } else {
      alert('Ajoutez au moins une recette avant de sauvegarder');
    }
  };

  const handleDrop = (item, slotIndex, isWeekView = false) => {
    if (isWeekView) {
      const newWeekSlots = [...weekSlots];
      
      // Si c'est un jour sauvegardé
      if (item.recipes) {
        // Remove the saved day from any existing slot
        const existingSlotIndex = weekSlots.findIndex(slot => slot && slot.id === item.id);
        if (existingSlotIndex !== -1) {
          newWeekSlots[existingSlotIndex] = null;
        }

        // Place the saved day in the new slot
        newWeekSlots[slotIndex] = item;
        setWeekSlots(newWeekSlots);
      } else {
        // Remove the recipe from any existing slot
        const existingSlotIndex = weekSlots.findIndex(slot => slot && slot.id === item.id);
        if (existingSlotIndex !== -1) {
          newWeekSlots[existingSlotIndex] = null;
        }

        // Place the recipe in the new slot
        newWeekSlots[slotIndex] = recipes.find(recipe => recipe.id === item.id);
        setWeekSlots(newWeekSlots);
      }
    } else {
      const newDaySlots = [...daySlots];
      
      // Remove the recipe from any existing slot
      const existingSlotIndex = daySlots.findIndex(slot => slot && slot.id === item.id);
      if (existingSlotIndex !== -1) {
        newDaySlots[existingSlotIndex] = null;
      }

      // Place the recipe in the new slot
      newDaySlots[slotIndex] = recipes.find(recipe => recipe.id === item.id);

      setDaySlots(newDaySlots);
    }
  };

  const handleDeleteSlot = (index, isWeekView = false) => {
    if (isWeekView) {
      const newWeekSlots = [...weekSlots];
      newWeekSlots[index] = null;
      setWeekSlots(newWeekSlots);
    } else {
      const newDaySlots = [...daySlots];
      newDaySlots[index] = null;
      setDaySlots(newDaySlots);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="meal-planning-page">
        {/* Top Navigation */}
        <div className="meal-planning-top-nav">
          <Link to="/" className="homepage-nav-btn">
            Accueil
          </Link>
          <h1>Meal Planning</h1>
          <div className="spacer"></div>
        </div>
        
        {/* View Navigation Pills */}
        <div className="meal-planning-nav">
          <button 
            className={`meal-planning-pill ${activeView === 'day' ? 'active' : ''}`}
            onClick={() => setActiveView('day')}
          >
            Jour
          </button>
          <button 
            className={`meal-planning-pill ${activeView === 'week' ? 'active' : ''}`}
            onClick={() => setActiveView('week')}
          >
            Semaine
          </button>
          <button 
            className={`meal-planning-pill ${activeView === 'month' ? 'active' : ''}`}
            onClick={() => setActiveView('month')}
          >
            Mois
          </button>
        </div>

        {/* Day View */}
        {activeView === 'day' && (
          <div className="day-view">
            <div className="day-card">
              <div className="day-card-header">
                <h2>Aujourd'hui</h2>
                <div className="day-actions">
                  <div className="day-total-price">
                    Prix total : {calculateDailyTotalPrice()} €
                  </div>
                  <button 
                    className="save-day-btn"
                    onClick={handleSaveDay}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
              <div className="day-slots">
                {daySlots.map((slot, index) => (
                  <DroppableSlot 
                    key={index} 
                    slot={slot} 
                    onDrop={(item) => handleDrop(item, index)}
                    onDelete={() => handleDeleteSlot(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Week View */}
        {activeView === 'week' && (
          <div className="week-view">
            <div className="week-card">
              <div className="week-card-header">
                <h2>Planning Semaine</h2>
              </div>
              <div className="week-slots">
                {weekSlots.map((slot, index) => (
                  <DroppableSlot 
                    key={index} 
                    slot={slot} 
                    onDrop={(item) => handleDrop(item, index, true)}
                    onDelete={() => handleDeleteSlot(index, true)}
                    isWeekView={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recipe List */}
        <div className="meal-planning-recipe-list">
          <h2>
            {activeView === 'day' ? 'Toutes les Recettes' : 'Jours Sauvegardés'}
          </h2>
          <div className="recipe-list-container">
            {activeView === 'day' ? (
              recipes.map((recipe, index) => (
                <div key={recipe.id} className="recipe-with-price">
                  <DraggableRecipeCard 
                    recipe={recipe} 
                    index={index} 
                    moveRecipe={() => {}} 
                  />
                  {recipe.price && (
                    <div className="recipe-card-price">
                      {recipe.price} €
                    </div>
                  )}
                </div>
              ))
            ) : (
              savedDays.map((savedDay) => (
                <DraggableSavedDay 
                  key={savedDay.id} 
                  savedDay={savedDay} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default MealPlanningPage; 