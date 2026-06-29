const { OpenAI } = require('openai');
const { buildSystemPrompt, buildUserPrompt } = require('./promptBuilder');

function getMockRoadmap(inputs) {
  const sport = inputs.sport || 'Cricket';
  const age = parseInt(inputs.age) || 8;
  const nextAge = age + 1;
  const finalAge = age + 2;
  const level = inputs.level || 'Beginner';
  const heightStr = `${inputs.height}${inputs.heightUnit}`;
  const goalsStr = inputs.goals ? inputs.goals.join(', ') : 'General Growth';

  // Sport specific templates
  const recommendations = {
    Cricket: {
      y1Upgrades: [
        {
          equipment: "Cricket Bat",
          current: inputs.currentEquipment || "Plastic training bat",
          recommended: "Kashmir Willow Size 4 (approx. 1.1kg - 1.2kg)",
          reason: "As the player moves into the 8-9 age bracket, transitioning from plastic to Kashmir Willow provides realistic ball bounce and helps build correct wrist alignment and muscle memory.",
          priceRangeBudget: "₹1,200 - ₹2,000",
          priceRangePremium: "₹2,500 - ₹4,000",
          buyTiming: "March (start of summer camps)",
          fitIndicator: "Bat handle should touch hip height when standing vertically."
        },
        {
          equipment: "Gloves & Protection",
          current: "None or basic cotton gloves",
          recommended: "Moulded Junior Batting Gloves & Leg Guards",
          reason: "Entering regular coaching requires protection against leather balls. Padded gloves prevent finger bruising as hand speed increases.",
          priceRangeBudget: "₹800 - ₹1,500",
          priceRangePremium: "₹2,000 - ₹3,500",
          buyTiming: "March",
          fitIndicator: "Gloves should have 1cm space at finger tips when hands are clenched."
        }
      ],
      y1Milestones: [
        "Expect height growth of 5-6cm; check bat handle hip alignment",
        "Target wrist stability exercises to handle Kashmir Willow weight (approx 1.2kg)"
      ],
      y2Upgrades: [
        {
          equipment: "Cricket Bat",
          current: "Kashmir Willow Size 4",
          recommended: "English Willow Size 5 (Lightweight, approx. 1.25kg)",
          reason: "At age 9-10, the player develops higher swing speeds. English willow offers superior stroke play, better sweet spot compression, and improved power transfer.",
          priceRangeBudget: "₹3,500 - ₹5,500",
          priceRangePremium: "₹7,000 - ₹12,000",
          buyTiming: "October (prior to winter league)",
          fitIndicator: "Player should be able to hold the bat horizontally in one hand for 10 seconds without shaking."
        },
        {
          equipment: "Spiked Shoes",
          current: "Canvas running shoes",
          recommended: "Rubber-studded Cricket spikes (soft turf grips)",
          reason: "Improved running between wickets and landing stability. Studs prevent slipping on dry and grassy Hyderabad outfields.",
          priceRangeBudget: "₹1,500 - ₹2,500",
          priceRangePremium: "₹3,000 - ₹5,000",
          buyTiming: "October",
          fitIndicator: "Shoes must allow 1 thumb-width of space in the toe box for growth."
        }
      ],
      y2Milestones: [
        "Transition to larger size 5 bat as player height reaches 135cm-142cm",
        "Introduce abdominal guard and full helmet as leather ball speeds exceed 60 km/h"
      ],
      coachNotes: [
        "Do not buy a bat that is too heavy, as it ruins the player's backlift technique and posture.",
        "Ensure the helmet is dual-certified and fits snugly without shifting during run-up.",
        "Grip diameter can be customized with 1 or 2 rubber wraps to match growing palm sizes."
      ],
      totalBudget: "₹7,000 - ₹15,000 (Budget) / ₹14,500 - ₹24,500 (Premium)"
    },
    Football: {
      y1Upgrades: [
        {
          equipment: "Football Boots",
          current: inputs.currentEquipment || "Basic running shoes",
          recommended: "Firm Ground (FG) Studs with synthetic upper",
          reason: `Appropriate ankle support and stud distribution for junior grass pitches. Improves traction and decreases risk of slipping during quick turns.`,
          priceRangeBudget: "₹1,200 - ₹2,200",
          priceRangePremium: "₹3,500 - ₹6,000",
          buyTiming: "June (Monsoon season startup)",
          fitIndicator: "No heel slippage when jogging, but toes shouldn't touch the front."
        },
        {
          equipment: "Shin Guards",
          current: "None",
          recommended: "Ankle-sleeve integrated Shin Guards",
          reason: "Protects both the shin bone and the vulnerable ankle joints from stray kicks during training sessions.",
          priceRangeBudget: "₹300 - ₹700",
          priceRangePremium: "₹900 - ₹1,800",
          buyTiming: "June",
          fitIndicator: "Guard should cover from 2 inches above the ankle to 2 inches below the knee."
        }
      ],
      y1Milestones: [
        "Transition from size 3 to size 4 ball as age approaches 9 years",
        "Monitor foot size changes quarterly to prevent blister formation"
      ],
      y2Upgrades: [
        {
          equipment: "Training Football",
          current: "Size 3 ball",
          recommended: "Hybrid-stitched Size 4 Football (low water uptake)",
          reason: "Standard training size for ages 9-11. Hybrid stitching holds form better on rough Hyderabad grounds.",
          priceRangeBudget: "₹800 - ₹1,500",
          priceRangePremium: "₹1,800 - ₹3,000",
          buyTiming: "December (Winter camps)",
          fitIndicator: "Ball pressure should be 8-9 PSI for optimal bounce and safety."
        },
        {
          equipment: "Performance Cleats",
          current: "FG Studs synthetic",
          recommended: "K-Leather or High-Grade Textured Synthetic Cleats",
          reason: "Provides superior touch, control, and ball spin execution. Ideal as player progresses to competitive school tournaments.",
          priceRangeBudget: "₹2,500 - ₹4,500",
          priceRangePremium: "₹6,000 - ₹10,000",
          buyTiming: "June (Next season)",
          fitIndicator: "Cleat upper should feel like a second skin without squeezing the sides."
        }
      ],
      y2Milestones: [
        "Transition to larger size 4 football completely",
        "Foot bone structure hardens; shift to firm ground spikes"
      ],
      coachNotes: [
        "Wash mud off boots immediately after play to maintain synthetic flexibility.",
        "Always dry leather boots naturally, never put them in direct sun or high heat.",
        "Ensure shin guards are worn at every training session, not just tournament matches."
      ],
      totalBudget: "₹3,800 - ₹8,900 (Budget) / ₹12,200 - ₹20,800 (Premium)"
    },
    Badminton: {
      y1Upgrades: [
        {
          equipment: "Badminton Racket",
          current: inputs.currentEquipment || "Heavy steel racket",
          recommended: "Full Carbon Graphite Racket (approx. 80-84g, 4U)",
          reason: "Reduces shoulder and elbow strain dramatically compared to heavy steel frames. Allows quick head acceleration for smash and drop shots.",
          priceRangeBudget: "₹1,800 - ₹3,000",
          priceRangePremium: "₹4,500 - ₹7,500",
          buyTiming: "May (Summer vacation start)",
          fitIndicator: "Player should be able to swing with wrist movement without shoulder rotation."
        },
        {
          equipment: "Court Shoes",
          current: "Running sneakers",
          recommended: "Gum-rubber Non-marking court shoes",
          reason: "Mandatory for wooden/synthetic courts. Provides high friction on lateral jumps and prevents heel injuries.",
          priceRangeBudget: "₹1,500 - ₹2,800",
          priceRangePremium: "₹4,000 - ₹8,000",
          buyTiming: "May",
          fitIndicator: "Heel counter must feel snug, preventing lateral ankle twists."
        }
      ],
      y1Milestones: [
        "Racket frame change from heavy jointed alloy to one-piece carbon graphite",
        "Develop wrist flex strength to hit baseline clears easily"
      ],
      y2Upgrades: [
        {
          equipment: "Performance Racket",
          current: "Carbon Graphite 4U Racket",
          recommended: "High-modulus Graphite Racket (3U/4U with Custom Tension at 24 lbs)",
          reason: "Allows players to generate greater control and power. Higher tension improves precision on tight net shots.",
          priceRangeBudget: "₹3,500 - ₹6,000",
          priceRangePremium: "₹9,000 - ₹16,000",
          buyTiming: "November (Winter season championships)",
          fitIndicator: "Ability to play backhand clears to the opposite double line."
        },
        {
          equipment: "Kitbag & Accessories",
          current: "Basic cover",
          recommended: "Thermal-lined Double Compartment Racket bag + Grip wraps",
          reason: "Thermal lining protects graphite rackets and string tension from Hyderabad's extreme summer heat.",
          priceRangeBudget: "₹1,000 - ₹2,000",
          priceRangePremium: "₹2,500 - ₹5,000",
          buyTiming: "November",
          fitIndicator: "Bag should comfortably hold at least 3 rackets and spare apparel."
        }
      ],
      y2Milestones: [
        "String tension upgrade from 20-22 lbs to 24-26 lbs for control",
        "Incorporate wrist weight bands during workouts to improve smashing speeds"
      ],
      coachNotes: [
        "Replace racket strings every 2-3 months as they lose elasticity and shock absorption.",
        "Sweat ruins racket grips quickly. Change polyurethane grips every 4 weeks to maintain solid holding traction.",
        "Never run on outdoor concrete courts with gum-rubber shoes; it rubs off the grip pattern instantly."
      ],
      totalBudget: "₹6,100 - ₹13,800 (Budget) / ₹20,000 - ₹36,500 (Premium)"
    }
  };

  // Fallback default (used for other sports like Basketball, Tennis, etc. or generic)
  const defaultRec = {
    y1Upgrades: [
      {
        equipment: `${sport} Primary Equipment`,
        current: inputs.currentEquipment || "Basic entry-level kit",
        recommended: `Semi-professional standard equipment for ${sport} (Size adapted for ${heightStr})`,
        reason: `Designed to accommodate growth and skill improvement during the ${age} to ${nextAge} milestone. Ensures proper biomechanics and joint protection.`,
        priceRangeBudget: "₹1,500 - ₹3,000",
        priceRangePremium: "₹4,000 - ₹8,000",
        buyTiming: "Start of school term",
        fitIndicator: `Proper proportional alignment to the player's height (${heightStr}).`
      },
      {
        equipment: "Performance Footwear",
        current: "Regular athletic shoes",
        recommended: `Sport-specific trainers (gum-rubber or spiked depending on surface)`,
        reason: `Ensures stability and safety on court/field surfaces, lowering load on knee joints.`,
        priceRangeBudget: "₹1,800 - ₹3,000",
        priceRangePremium: "₹4,500 - ₹7,000",
        buyTiming: "Start of school term",
        fitIndicator: "1cm spacing in toe box to accommodate growing feet."
      }
    ],
    y1Milestones: [
      `Height check at ${nextAge} years to review equipment size compatibility`,
      "Work on core muscle strength to match increased equipment momentum"
    ],
    y2Upgrades: [
      {
        equipment: `Advanced ${sport} Equipment`,
        current: `Semi-professional ${sport} gear`,
        recommended: `High-performance composite equipment (Optimized for ${level} level)`,
        reason: `At age ${nextAge}-${finalAge}, players benefit from lighter materials and higher responsiveness, improving speed and agility.`,
        priceRangeBudget: "₹3,000 - ₹6,000",
        priceRangePremium: "₹8,000 - ₹15,000",
        buyTiming: "Mid-year holiday camps",
        fitIndicator: "Feels natural, does not feel heavy during prolonged practice sessions."
      },
      {
        equipment: "Protective Gear / Carry Case",
        current: "Basic bags",
        recommended: "Premium compartmentalized team bag with moisture management",
        reason: "Keeps professional gear dry and prevents rust or structural degradation.",
        priceRangeBudget: "₹1,000 - ₹2,000",
        priceRangePremium: "₹2,500 - ₹5,000",
        buyTiming: "Mid-year holiday camps",
        fitIndicator: "Holds all essentials with specific slots for protective gear."
      }
    ],
    y2Milestones: [
      `Reach key motor control milestones matching age ${finalAge} development`,
      "Review grip sizing as hand length increases by approx 0.8cm"
    ],
    coachNotes: [
      "Keep gear clean and dry to maximize shelf life.",
      "Check equipment integrity (cracks, loose strings, sole separating) monthly.",
      "Select accessories that support goals: " + goalsStr
    ],
    totalBudget: "₹7,300 - ₹14,000 (Budget) / ₹19,000 - ₹35,000 (Premium)"
  };

  const selectedSport = recommendations[sport] || defaultRec;

  // Helper to dynamically inject Budget, Midrange, and Premium options into mock upgrades
  const addMockOptions = (upg) => {
    const budgetRange = upg.priceRangeBudget || "₹1,500 - ₹3,500";
    const premiumRange = upg.priceRangePremium || "₹4,000 - ₹8,000";
    
    const budgetPrice = budgetRange.split('-')[0].trim();
    const premiumPrice = premiumRange.split('-')[1] ? premiumRange.split('-')[1].trim() : premiumRange;
    
    // Calculate a mid-point price for the midrange option
    const cleanB = parseInt(budgetPrice.replace(/[^0-9]/g, '')) || 2000;
    const cleanP = parseInt(premiumPrice.replace(/[^0-9]/g, '')) || 6000;
    const midVal = Math.round((cleanB + cleanP) / 2);
    const midPrice = "₹" + midVal.toLocaleString('en-IN');

    // Specific product branding helpers
    let budgetBrand = "Domyos / Decathlon Value";
    let midBrand = "Nivia / Kipsta Classic";
    let premiumBrand = "Puma / Adidas Pro";

    const eqName = upg.equipment.toLowerCase();
    if (eqName.includes('bat') || eqName.includes('willow')) {
      budgetBrand = "SG VS 319 Spark Kashmir";
      midBrand = "SS Ranger Classic Kashmir";
      premiumBrand = "DSC Intense English Willow";
    } else if (eqName.includes('shoe') || eqName.includes('boot') || eqName.includes('spike')) {
      budgetBrand = "Decathlon Kipsta studs";
      midBrand = "Nivia Spider Cleats";
      premiumBrand = "Adidas Predator spikes";
    } else if (eqName.includes('racket') || eqName.includes('racquet')) {
      budgetBrand = "Li-Ning XP-90 Carbon";
      midBrand = "Yonex Muscle Power 29";
      premiumBrand = "Yonex Astrox 88 Play";
    } else if (eqName.includes('glove') || eqName.includes('guard') || eqName.includes('protect')) {
      budgetBrand = "SG Test Protector";
      midBrand = "SS Ranji Thigh Guard";
      premiumBrand = "Kookaburra Pace Guard";
    } else if (eqName.includes('ball')) {
      budgetBrand = "Nivia Trainer Leather";
      midBrand = "Vicky Match Red Leather";
      premiumBrand = "Kookaburra Turf County";
    }

    return {
      ...upg,
      options: {
        budget: { name: budgetBrand, price: budgetPrice },
        midrange: { name: midBrand, price: midPrice },
        premium: { name: premiumBrand, price: premiumPrice }
      }
    };
  };

  const y1UpgradesMapped = selectedSport.y1Upgrades.map(addMockOptions);
  const y2UpgradesMapped = selectedSport.y2Upgrades.map(addMockOptions);

  return {
    success: true,
    generationId: "mock_" + Math.random().toString(36).substr(2, 9),
    roadmap: {
      summary: `Equipment roadmap for ${age}-year-old ${level} ${sport} player`,
      year1: {
        period: `Now → 12 months (Age ${age}→${nextAge})`,
        ageNote: `Growth expectations for age ${age} to ${nextAge} in ${sport}`,
        upgrades: y1UpgradesMapped,
        milestones: selectedSport.y1Milestones,
        keepCurrentItems: ["Basic protective guards - still usable for size limits"]
      },
      year2: {
        period: `12 → 24 months (Age ${nextAge}→${finalAge})`,
        ageNote: `Expected physical growth of 5-7cm and increase in forearm strength at age ${nextAge} to ${finalAge}`,
        upgrades: y2UpgradesMapped,
        milestones: selectedSport.y2Milestones,
        keepCurrentItems: ["Warm up training cones and lightweight agility ladders"]
      },
      coachNotes: selectedSport.coachNotes.join('\n'),
      totalBudgetEstimate: selectedSport.totalBudget,
      nextReviewAge: `${finalAge} years`
    },
    responseTimeMs: 800,
    promptVersion: "v4-mock"
  };
}

async function generateRoadmap(inputs) {
  const apiKey = process.env.OPENAI_API_KEY;
  const startTime = Date.now();
  
  if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.trim() === '') {
    console.log('OpenAI key not set, using mock fallback');
    const mockRes = getMockRoadmap(inputs);
    mockRes.responseTimeMs = Date.now() - startTime;
    return mockRes;
  }

  const openai = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(inputs);

  const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS) || 30000;

  try {
    const apiCall = openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
    );

    const response = await Promise.race([apiCall, timeoutPromise]);
    const responseTimeMs = Date.now() - startTime;
    
    const jsonText = response.choices[0].message.content;
    const roadmap = JSON.parse(jsonText);

    return {
      success: true,
      generationId: "gen_" + Math.random().toString(36).substr(2, 9),
      roadmap,
      responseTimeMs,
      promptVersion: 'v4'
    };

  } catch (err) {
    console.error('AI Service Error:', err);
    if (err.message === 'TIMEOUT') {
      throw new Error('TIMEOUT');
    }
    
    // Attempt fallback
    console.log('Falling back to high quality mock data due to API error');
    const mockRes = getMockRoadmap(inputs);
    mockRes.responseTimeMs = Date.now() - startTime;
    return mockRes;
  }
}

module.exports = {
  generateRoadmap
};
