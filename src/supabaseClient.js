import { createClient } from '@supabase/supabase-js';

// Remplacez ces valeurs par vos propres clés Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction utilitaire pour gérer les erreurs
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  // Vous pouvez ajouter ici une logique de gestion d'erreur plus avancée
};

// Fonction de test de connexion
export const testSupabaseConnection = async () => {
  try {
    console.log('Tentative de connexion à Supabase...');
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }

    console.log('Connexion réussie !', data);
    return true;
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return false;
  }
}; 