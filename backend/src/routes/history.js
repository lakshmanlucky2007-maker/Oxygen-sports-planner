const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/history - Get paginated, filtered list of generations
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sport = req.query.sport || '';
    const search = req.query.search || '';
    const sort = req.query.sort || 'newest';

    const offset = (page - 1) * limit;

    let queryParts = [];
    let queryParams = [];
    let paramCount = 1;

    // Base filters
    queryParts.push(`g.is_deleted = ${db.isPostgres ? 'FALSE' : '0'}`);
    
    // Filter by authenticated user's ID
    queryParts.push(`g.user_id = $${paramCount}`);
    queryParams.push(req.user.uid);
    paramCount++;

    if (sport && sport !== 'All') {
      queryParts.push(`g.sport = $${paramCount}`);
      queryParams.push(sport);
      paramCount++;
    }

    if (search) {
      queryParts.push(`(g.coach_name ILIKE $${paramCount} OR g.sport ILIKE $${paramCount} OR g.current_equipment ILIKE $${paramCount})`);
      // For SQLite, ILIKE is case-insensitive by default in LIKE, or we can use LIKE. 
      // Actually, standard SQL is g.coach_name LIKE $param. Let's rewrite ILIKE to LIKE for SQLite or keep ILIKE if Postgres.
      // A safe way: use LOWER(column) LIKE LOWER(param) which is 100% cross-compatible!
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = queryParts.length > 0 ? `WHERE ${queryParts.join(' AND ')}` : '';

    // Count query
    let countSql = `
      SELECT COUNT(*) as count 
      FROM generations g
      ${whereClause}
    `;

    // Rewrite ILIKE to LIKE/LOWER for SQLite if not postgres
    if (!db.isPostgres && search) {
      countSql = countSql.replace(/g\.coach_name ILIKE \$\d+/g, 'LOWER(g.coach_name) LIKE LOWER(?)');
      countSql = countSql.replace(/g\.sport ILIKE \$\d+/g, 'LOWER(g.sport) LIKE LOWER(?)');
      countSql = countSql.replace(/g\.current_equipment ILIKE \$\d+/g, 'LOWER(g.current_equipment) LIKE LOWER(?)');
    }

    const countResult = await db.query(countSql, queryParams);
    const total = parseInt(countResult.rows[0]?.count || 0);

    // Sorting
    let orderBy = 'g.created_at DESC';
    if (sort === 'oldest') {
      orderBy = 'g.created_at ASC';
    } else if (sort === 'highest_rated') {
      // Cross-compatible: null ratings at the bottom
      orderBy = 'CASE WHEN f.rating IS NULL THEN 1 ELSE 0 END, f.rating DESC, g.created_at DESC';
    }

    // Select query
    let selectSql = `
      SELECT 
        g.id, 
        g.sport, 
        g.age, 
        g.player_level as "level", 
        g.coach_name as "coachName", 
        g.current_equipment as "equipmentSummary",
        g.ai_response, 
        g.response_time_ms as "responseTimeMs", 
        g.created_at as "createdAt",
        g.planning_mode as "planningMode",
        g.player_weight as "playerWeight",
        g.player_experience as "playerExperience",
        g.player_name as "playerName",
        f.rating
      FROM generations g
      LEFT JOIN feedback f ON f.generation_id = g.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const selectParams = [...queryParams, limit, offset];

    // For SQLite rewrite parameter indexes and ILIKE
    let finalSelectSql = selectSql;
    if (!db.isPostgres) {
      if (search) {
        finalSelectSql = finalSelectSql.replace(/g\.coach_name ILIKE \$\d+/g, 'LOWER(g.coach_name) LIKE LOWER(?)');
        finalSelectSql = finalSelectSql.replace(/g\.sport ILIKE \$\d+/g, 'LOWER(g.sport) LIKE LOWER(?)');
        finalSelectSql = finalSelectSql.replace(/g\.current_equipment ILIKE \$\d+/g, 'LOWER(g.current_equipment) LIKE LOWER(?)');
      }
    }

    const { rows } = await db.query(finalSelectSql, selectParams);

    const formattedData = rows.map(row => {
      // Parse AI response to generate a preview string
      let outputPreview = "";
      try {
        const responseObj = typeof row.ai_response === 'string' 
          ? JSON.parse(row.ai_response) 
          : row.ai_response;
        
        if (responseObj && responseObj.year1 && responseObj.year1.upgrades && responseObj.year1.upgrades[0]) {
          const upgradeObj = responseObj.year1.upgrades[0];
          outputPreview = `Year 1: Upgrade to ${upgradeObj.recommended || 'recommended gear'}...`;
        } else if (responseObj && responseObj.summary) {
          outputPreview = responseObj.summary;
        } else {
          outputPreview = "No preview available";
        }
      } catch (e) {
        outputPreview = "Equipment roadmap preview...";
      }

      return {
        id: row.id,
        sport: row.sport,
        age: row.age,
        level: row.level,
        coachName: row.coachName || 'Unknown',
        equipmentSummary: row.equipmentSummary,
        outputPreview: outputPreview,
        rating: row.rating ? parseFloat(row.rating) : null,
        responseTimeMs: row.responseTimeMs,
        createdAt: row.createdAt,
        planningMode: row.planningMode || 'Parent',
        playerWeight: row.playerWeight,
        playerExperience: row.playerExperience,
        playerName: row.playerName || ''
      };
    });

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: formattedData
    });

  } catch (err) {
    next(err);
  }
});

// GET /api/history/:id - Get full detail of one generation
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        g.id, 
        g.sport, 
        g.age, 
        g.height,
        g.height_unit as "heightUnit",
        g.player_level as "level", 
        g.current_equipment as "currentEquipment",
        g.budget_min as "budgetMin",
        g.budget_max as "budgetMax",
        g.goals,
        g.coach_name as "coachName", 
        g.ai_response as "aiResponse", 
        g.response_time_ms as "responseTimeMs", 
        g.created_at as "createdAt",
        g.planning_mode as "planningMode",
        g.player_weight as "playerWeight",
        g.player_experience as "playerExperience",
        g.player_name as "playerName",
        f.rating,
        f.thumbs,
        f.comment as "feedbackComment"
      FROM generations g
      LEFT JOIN feedback f ON f.generation_id = g.id
      WHERE g.id = $1 AND g.user_id = $2 AND g.is_deleted = ${db.isPostgres ? 'FALSE' : '0'}
    `;

    const { rows } = await db.query(sql, [id, req.user.uid]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Generation record not found'
      });
    }

    const record = rows[0];
    
    // Parse JSON properties if they are stringified
    let roadmap = record.aiResponse;
    if (typeof roadmap === 'string') {
      try {
        roadmap = JSON.parse(roadmap);
      } catch (e) {
        // use as string if parse fails
      }
    }

    let goals = record.goals;
    if (typeof goals === 'string') {
      try {
        goals = JSON.parse(goals);
      } catch (e) {
        // use as string if parse fails
      }
    }

    res.json({
      success: true,
      data: {
        id: record.id,
        sport: record.sport,
        age: record.age,
        height: record.height,
        heightUnit: record.heightUnit,
        level: record.level,
        currentEquipment: record.currentEquipment,
        budgetMin: record.budgetMin,
        budgetMax: record.budgetMax,
        goals: goals || [],
        coachName: record.coachName,
        roadmap: roadmap,
        planningMode: record.planningMode || 'Parent',
        playerWeight: record.playerWeight,
        playerExperience: record.playerExperience,
        playerName: record.playerName || '',
        rating: record.rating,
        thumbs: record.thumbs,
        feedbackComment: record.feedbackComment,
        responseTimeMs: record.responseTimeMs,
        createdAt: record.createdAt
      }
    });

  } catch (err) {
    next(err);
  }
});

// DELETE /api/history/:id - Soft delete a generation
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE generations 
      SET is_deleted = ${db.isPostgres ? 'TRUE' : '1'} 
      WHERE id = $1 AND user_id = $2
    `;
    const result = await db.query(sql, [id, req.user.uid]);

    res.json({
      success: true,
      message: 'Generation record deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
