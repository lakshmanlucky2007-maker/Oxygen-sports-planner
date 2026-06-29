const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { generateRoadmap } = require('../services/aiService');

router.post('/', async (req, res, next) => {
  const {
    sport,
    age,
    height,
    heightUnit = 'cm',
    level,
    currentEquipment,
    budgetMin,
    budgetMax,
    goals = [],
    coachName,
    planningMode = 'Parent',
    weight,
    experience,
    playerName
  } = req.body;

  // Validation
  if (!playerName || typeof playerName !== 'string' || !playerName.trim()) {
    return next(new Error('VALIDATION: Player name is required'));
  }

  if (!sport) {
    return next(new Error('VALIDATION: Sport is required'));
  }
  
  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 6 || parsedAge > 25) {
    return next(new Error('VALIDATION: Age must be between 6 and 25 years'));
  }

  const parsedHeight = parseFloat(height);
  if (isNaN(parsedHeight) || parsedHeight < 60 || parsedHeight > 250) {
    return next(new Error('VALIDATION: Height must be between 60 and 250 cm'));
  }

  const parsedWeight = weight ? parseFloat(weight) : null;
  if (weight !== undefined && weight !== '' && (isNaN(parsedWeight) || parsedWeight < 10 || parsedWeight > 150)) {
    return next(new Error('VALIDATION: Weight must be between 10 and 150 kg'));
  }

  if (!level || !['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
    return next(new Error('VALIDATION: Level must be Beginner, Intermediate, or Advanced'));
  }

  if (!currentEquipment || currentEquipment.length < 10) {
    return next(new Error('VALIDATION: Current equipment description must be at least 10 characters long'));
  }

  if (currentEquipment.length > 500) {
    return next(new Error('VALIDATION: Current equipment description must be at most 500 characters long'));
  }

  if (budgetMin !== undefined && budgetMax !== undefined) {
    if (parseInt(budgetMin) > parseInt(budgetMax)) {
      return next(new Error('VALIDATION: Minimum budget cannot exceed maximum budget'));
    }
  }

  try {
    const inputs = {
      sport,
      age: parsedAge,
      height: parsedHeight,
      heightUnit,
      level,
      currentEquipment,
      budgetMin: budgetMin ? parseInt(budgetMin) : null,
      budgetMax: budgetMax ? parseInt(budgetMax) : null,
      goals,
      coachName: coachName || '',
      planningMode,
      weight: parsedWeight,
      experience: experience || '',
      playerName: playerName.trim()
    };

    console.log(`Generating roadmap for ${inputs.age}yo ${inputs.level} ${inputs.sport} [Mode: ${inputs.planningMode}]...`);
    
    // Call AI Service
    const aiResult = await generateRoadmap(inputs);
    
    const generationId = aiResult.generationId || 'gen_' + Math.random().toString(36).substr(2, 9);
    
    // Insert into DB
    const sql = `
      INSERT INTO generations (
        id, sport, age, height, height_unit, player_level, current_equipment,
        budget_min, budget_max, goals, coach_name, prompt_version, ai_response, response_time_ms,
        planning_mode, player_weight, player_experience, player_name, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `;

    const params = [
      generationId,
      inputs.sport,
      inputs.age,
      inputs.height,
      inputs.heightUnit,
      inputs.level,
      inputs.currentEquipment,
      inputs.budgetMin,
      inputs.budgetMax,
      inputs.goals,
      inputs.coachName,
      aiResult.promptVersion || 'v4',
      aiResult.roadmap,
      aiResult.responseTimeMs,
      inputs.planningMode,
      inputs.weight,
      inputs.experience,
      inputs.playerName,
      req.user.uid
    ];

    await db.query(sql, params);

    res.json({
      success: true,
      generationId,
      roadmap: aiResult.roadmap,
      responseTimeMs: aiResult.responseTimeMs,
      promptVersion: aiResult.promptVersion || 'v4'
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
