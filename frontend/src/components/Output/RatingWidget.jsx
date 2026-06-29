import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';

export default function RatingWidget({ generationId }) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [thumbs, setThumbs] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStars === 0) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await api.submitFeedback({
        generationId,
        rating: selectedStars,
        thumbs: thumbs,
        comment
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-brand-primaryLight border border-brand-primary/20 rounded-card p-6 text-center animate-fade-in-up">
        <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-primary/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-brand-primary text-base">
          Feedback Submitted!
        </h3>
        <p className="text-text-secondary text-sm mt-1">
          Thank you! Your feedback helps us improve 🌟
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-card border border-border-default rounded-card p-6 shadow-card transition-all duration-200">
      <h3 className="font-display font-bold text-text-primary text-base mb-1">
        Rate this roadmap
      </h3>
      <p className="text-text-secondary text-xs mb-4">
        Tell us how accurate and helpful these recommendations are
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating & Thumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Star click */}
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStars(star)}
                onMouseLeave={() => setHoveredStars(0)}
                onClick={() => setSelectedStars(star)}
                className="focus:outline-none transition-transform star-icon"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredStars || selectedStars)
                      ? 'text-warning fill-warning'
                      : 'text-border-default'
                  }`}
                />
              </button>
            ))}
            <span className="text-text-secondary font-mono text-sm ml-2 font-bold">
              {selectedStars > 0 ? `${selectedStars} / 5` : ''}
            </span>
          </div>

          {/* Thumbs selection */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setThumbs(thumbs === 'up' ? null : 'up')}
              className={`p-2 rounded-lg border flex items-center justify-center transition-all btn-active-feedback ${
                thumbs === 'up'
                  ? 'bg-brand-primaryLight border-brand-primary text-brand-primary'
                  : 'bg-background-primary border-border-default text-text-secondary hover:text-brand-primary hover:border-brand-primary'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => setThumbs(thumbs === 'down' ? null : 'down')}
              className={`p-2 rounded-lg border flex items-center justify-center transition-all btn-active-feedback ${
                thumbs === 'down'
                  ? 'bg-error/10 border-error text-error'
                  : 'bg-background-primary border-border-default text-text-secondary hover:text-error hover:border-error'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comment section (slides open after stars selected) */}
        {selectedStars > 0 && (
          <div className="space-y-3 pt-3 border-t border-border-light animate-fade-in-up">
            <label htmlFor="feedbackComment" className="block text-xs font-semibold text-text-secondary">
              Add feedback for our team (Optional)
            </label>
            <textarea
              id="feedbackComment"
              rows={2}
              placeholder="e.g. Bat recommendations are perfect! What about wicket keeping gloves?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full px-3 py-2 text-text-primary bg-background-primary border border-border-default rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary placeholder:text-text-muted transition-all"
            />
            
            {error && (
              <p className="text-xs text-error font-semibold">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm rounded-btn transition-colors duration-150 btn-active-feedback disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
