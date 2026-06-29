import { useState } from 'react';
import { api } from '../utils/api';

export default function useGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [generationId, setGenerationId] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [error, setError] = useState(null);

  const generate = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.generateRoadmap(formData);
      
      if (result.success) {
        setRoadmap(result.roadmap);
        setGenerationId(result.generationId);
        setPlayerProfile({
          playerName: formData.playerName || '',
          sport: formData.sport,
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          heightUnit: formData.heightUnit,
          level: formData.level,
          coachName: formData.coachName || ''
        });
        
        // Scroll down to the output section on mobile/tablet after generation
        setTimeout(() => {
          const outputEl = document.getElementById('roadmap-output-section');
          if (outputEl) {
            outputEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

        return result;
      } else {
        throw new Error(result.message || 'Failed to generate roadmap');
      }
    } catch (err) {
      console.error('Generation hook error:', err);
      setError(err.message || 'An error occurred during roadmap generation. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setRoadmap(null);
    setGenerationId(null);
    setPlayerProfile(null);
    setError(null);
  };

  return {
    isLoading,
    roadmap,
    generationId,
    playerProfile,
    error,
    generate,
    reset
  };
}
