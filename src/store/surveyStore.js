import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the store structure
const useSurveyStore = create((set, get) => ({
  // State
  surveyData: null,
  templateFormData: null,
  mode: 'create',
  initialData: null,
  isDirty: false,
  
  // Actions
  setSurveyData: (surveyData) => {
    set({ surveyData, isDirty: true });
    // Auto-save to AsyncStorage
    AsyncStorage.setItem('@survey_data', JSON.stringify(surveyData)).catch(console.error);
  },
  
  setTemplateFormData: (templateFormData) => {
    set({ templateFormData, isDirty: true });
    AsyncStorage.setItem('@template_form_data', JSON.stringify(templateFormData)).catch(console.error);
  },
  
  setMode: (mode) => {
    set({ mode });
    AsyncStorage.setItem('@mode', mode).catch(console.error);
  },
  
  setInitialData: (initialData) => {
    set({ initialData });
    AsyncStorage.setItem('@initial_data', JSON.stringify(initialData)).catch(console.error);
  },
  
  // Initialize from storage
  initializeFromStorage: async () => {
    try {
      const [surveyData, templateFormData, mode, initialData] = await Promise.all([
        AsyncStorage.getItem('@survey_data'),
        AsyncStorage.getItem('@template_form_data'),
        AsyncStorage.getItem('@mode'),
        AsyncStorage.getItem('@initial_data'),
      ]);
      
      set({
        surveyData: surveyData ? JSON.parse(surveyData) : null,
        templateFormData: templateFormData ? JSON.parse(templateFormData) : null,
        mode: mode || 'create',
        initialData: initialData ? JSON.parse(initialData) : null,
        isDirty: false,
      });
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },
  
  // Clear all data
  clearStore: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('@survey_data'),
        AsyncStorage.removeItem('@template_form_data'),
        AsyncStorage.removeItem('@mode'),
        AsyncStorage.removeItem('@initial_data'),
      ]);
      
      set({
        surveyData: null,
        templateFormData: null,
        mode: 'create',
        initialData: null,
        isDirty: false,
      });
    } catch (error) {
      console.error('Error clearing store:', error);
    }
  },
  
  // Save all at once
  saveAll: async ({ surveyData, templateFormData, mode = 'create', initialData = null }) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('@survey_data', JSON.stringify(surveyData)),
        AsyncStorage.setItem('@template_form_data', JSON.stringify(templateFormData)),
        AsyncStorage.setItem('@mode', mode),
        AsyncStorage.setItem('@initial_data', JSON.stringify(initialData)),
      ]);
      
      set({
        surveyData,
        templateFormData,
        mode,
        initialData,
        isDirty: false,
      });
    } catch (error) {
      console.error('Error saving all data:', error);
    }
  },
  
  // Check if has unsaved changes
  hasUnsavedChanges: () => {
    return get().isDirty;
  },
  
  // Get combined state
  getState: () => get(),
}));

export default useSurveyStore;