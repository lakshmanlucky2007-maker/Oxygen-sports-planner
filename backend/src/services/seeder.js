const db = require('./db');

const sports = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Athletics', 'Basketball'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const names = ['Coach Ravi Sharma', 'Sunita Rao', 'Arjun Singh', 'Ananya Patel', 'Kiran Kumar', 'Srinivas Rao'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generates an approximate date string
function getPastDateString(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // Set random hours and minutes
  date.setHours(getRandomInt(8, 20), getRandomInt(0, 59), getRandomInt(0, 59));
  
  if (db.isPostgres) {
    return date.toISOString();
  } else {
    // SQLite format: YYYY-MM-DD HH:MM:SS
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }
}

async function seedDatabase() {
  try {
    const checkRes = await db.query('SELECT COUNT(*) as count FROM generations');
    const count = parseInt(checkRes.rows[0]?.count || 0);

    if (count > 0) {
      console.log(`Database already has ${count} generation records. Skipping seed.`);
      return;
    }

    console.log('Database is empty. Seeding sample data...');

    // Let's seed 25 records spread across the last 14 days
    for (let i = 0; i < 25; i++) {
      const id = 'seed_' + Math.random().toString(36).substr(2, 9);
      const sport = getRandomElement(sports);
      const age = getRandomInt(6, 22);
      const height = age * 6 + 75 + getRandomInt(-5, 5); // Rough linear correlation
      const heightUnit = 'cm';
      const level = getRandomElement(levels);
      const coachName = getRandomElement(names);
      const budgetMin = getRandomElement([2000, 5000, 10000, 15000]);
      const budgetMax = budgetMin + getRandomElement([5000, 10000, 20000]);
      const responseTimeMs = getRandomInt(2500, 4200);
      const daysAgo = getRandomInt(0, 14);
      const createdAt = getPastDateString(daysAgo);

      // Define some goals
      let goals = ['General Improvement'];
      if (level === 'Beginner') {
        goals = ['Comfort & Fit', 'Better Control'];
      } else if (level === 'Intermediate') {
        goals = ['Improve Power', 'School Team'];
      } else {
        goals = ['Tournament Ready', 'Academy Level', 'Improve Power'];
      }

      // Generate a mock roadmap JSON
      const nextAge = age + 1;
      const finalAge = age + 2;
      const roadmap = {
        summary: `Equipment roadmap for ${age}-year-old ${level} ${sport} player`,
        year1: {
          period: `Now → 12 months (Age ${age}→${nextAge})`,
          ageNote: `Expected physical growth of 5-7cm and increase in forearm strength at age ${age} to ${nextAge}`,
          upgrades: [
            {
              equipment: "Primary Gear",
              current: "Basic starter gear",
              recommended: `Intermediate Standard ${sport} Gear`,
              reason: `Correct sizing is crucial as player experiences standard bone growth and weight changes. Helps avoid shoulder fatigue.`,
              priceRangeBudget: `₹${(budgetMin * 0.4).toFixed(0)} - ₹${(budgetMin * 0.7).toFixed(0)}`,
              priceRangePremium: `₹${(budgetMin * 0.9).toFixed(0)} - ₹${(budgetMin * 1.5).toFixed(0)}`,
              buyTiming: "Before season start",
              fitIndicator: "Fingertip or hip level clearance."
            }
          ],
          milestones: ["Ensure proper hand grasp posture and finger flexibility"],
          keepCurrentItems: ["Cones, agility bands"]
        },
        year2: {
          period: `12 → 24 months (Age ${nextAge}→${finalAge})`,
          ageNote: `Growth and strength expectations for age ${nextAge} to ${finalAge}`,
          upgrades: [
            {
              equipment: "Advanced Performance Gear",
              current: `Intermediate Standard ${sport} Gear`,
              recommended: `Advanced Custom Composite ${sport} Gear`,
              reason: `At age ${nextAge}-${finalAge}, skill progress demands higher shock absorption and grip friction controls.`,
              priceRangeBudget: `₹${(budgetMax * 0.4).toFixed(0)} - ₹${(budgetMax * 0.7).toFixed(0)}`,
              priceRangePremium: `₹${(budgetMax * 0.9).toFixed(0)} - ₹${(budgetMax * 1.5).toFixed(0)}`,
              buyTiming: "Summer/Winter break camps",
              fitIndicator: "Comfortable hold without joint strain."
            }
          ],
          milestones: ["Verify shoes studs wear pattern to correct stride alignments"],
          keepCurrentItems: ["Protective bags and covers"]
        },
        coachNotes: "Ensure regular muscle stretching routines. Inspect gear wear weekly. Choose accessories wisely.",
        totalBudgetEstimate: `₹${budgetMin} - ₹${budgetMax} over 2 years`,
        nextReviewAge: `${finalAge} years`
      };

      const genSql = `
        INSERT INTO generations (
          id, sport, age, height, height_unit, player_level, current_equipment,
          budget_min, budget_max, goals, coach_name, prompt_version, ai_response, response_time_ms, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `;

      const genParams = [
        id,
        sport,
        age,
        height,
        heightUnit,
        level,
        `Regular generic brand ${sport} kit, standard sneakers`,
        budgetMin,
        budgetMax,
        goals,
        coachName,
        'v4',
        roadmap,
        responseTimeMs,
        createdAt
      ];

      await db.query(genSql, genParams);

      // Seed feedback for ~80% of generations
      if (Math.random() < 0.8) {
        const rating = getRandomElement([4, 5, 5, 4, 3, 5]); // High satisfaction curve
        const thumbs = rating >= 4 ? 'up' : (rating === 3 ? 'down' : null);
        const comments = [
          "Perfect advice! My student loved it.",
          "Very accurate sizing indices.",
          "Budget estimates align well with local prices in Hyderabad.",
          "Good recommendations, though minor adjustments needed.",
          "Helped our parent-coaching sessions a lot!",
          "Great roadmap, highly recommended."
        ];
        const comment = rating >= 4 ? getRandomElement(comments) : "It's decent but budget margins are slightly tight.";

        const feedbackSql = `
          INSERT INTO feedback (generation_id, rating, thumbs, comment, created_at)
          VALUES ($1, $2, $3, $4, $5)
        `;
        await db.query(feedbackSql, [id, rating, thumbs, comment, createdAt]);
      }
    }

    console.log('Database seeded successfully.');

  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

module.exports = {
  seedDatabase
};
