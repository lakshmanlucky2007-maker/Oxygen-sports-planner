const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /api/feedback - Save rating and comments for a roadmap
router.post('/', async (req, res, next) => {
  const { generationId, rating, thumbs, comment } = req.body;

  if (!generationId) {
    return next(new Error('VALIDATION: Generation ID is required'));
  }

  const parsedRating = parseInt(rating);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return next(new Error('VALIDATION: Rating must be an integer between 1 and 5'));
  }

  if (thumbs && !['up', 'down'].includes(thumbs)) {
    return next(new Error('VALIDATION: Thumbs must be "up" or "down"'));
  }

  try {
    // Check if generation exists and belongs to the user first
    const genCheck = await db.query('SELECT id FROM generations WHERE id = $1 AND user_id = $2', [generationId, req.user.uid]);
    if (genCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Generation record not found or access denied'
      });
    }

    // Check if feedback already exists for this generation
    const feedbackCheck = await db.query('SELECT id FROM feedback WHERE generation_id = $1', [generationId]);
    
    if (feedbackCheck.rows.length > 0) {
      // Update existing feedback
      const updateSql = `
        UPDATE feedback 
        SET rating = $1, thumbs = $2, comment = $3, created_at = CURRENT_TIMESTAMP
        WHERE generation_id = $4
      `;
      await db.query(updateSql, [parsedRating, thumbs || null, comment || '', generationId]);
      console.log(`Feedback updated for generation ${generationId}`);
    } else {
      // Insert new feedback
      const insertSql = `
        INSERT INTO feedback (generation_id, rating, thumbs, comment)
        VALUES ($1, $2, $3, $4)
      `;
      await db.query(insertSql, [generationId, parsedRating, thumbs || null, comment || '']);
      console.log(`Feedback created for generation ${generationId}`);
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
