const express = require('express');
const router = express.Router();

// Preset template player configurations
const presetTemplates = [
  {
    id: "t1",
    label: "8yr Beginner Cricketer",
    emoji: "🏏",
    color: "green",
    data: {
      sport: "Cricket",
      age: 8,
      height: 120,
      heightUnit: "cm",
      level: "Beginner",
      currentEquipment: "Plastic training bat 1kg, cheap cotton gloves, canvas shoes size 3",
      budgetMin: 3000,
      budgetMax: 10000,
      goals: ["School Team", "Improve Power"],
      coachName: ""
    }
  },
  {
    id: "t2",
    label: "12yr Football Forward",
    emoji: "⚽",
    color: "blue",
    data: {
      sport: "Football",
      age: 12,
      height: 148,
      heightUnit: "cm",
      level: "Intermediate",
      currentEquipment: "Decathlon rubber studs, synthetic shinguards, standard size 4 ball",
      budgetMin: 5000,
      budgetMax: 15000,
      goals: ["Better Control", "Academy Level"],
      coachName: ""
    }
  },
  {
    id: "t3",
    label: "10yr Badminton Student",
    emoji: "🏸",
    color: "orange",
    data: {
      sport: "Badminton",
      age: 10,
      height: 135,
      heightUnit: "cm",
      level: "Beginner",
      currentEquipment: "Alloy steel racket, plastic Yonex shuttlecocks, regular running shoes",
      budgetMin: 4000,
      budgetMax: 12000,
      goals: ["Better Control", "Comfort & Fit"],
      coachName: ""
    }
  },
  {
    id: "t4",
    label: "15yr Track Athlete",
    emoji: "🏃",
    color: "purple",
    data: {
      sport: "Athletics",
      age: 15,
      height: 165,
      heightUnit: "cm",
      level: "Advanced",
      currentEquipment: "Normal trainers without spikes, worn out running shorts",
      budgetMin: 10000,
      budgetMax: 30000,
      goals: ["Tournament Ready", "Improve Power"],
      coachName: ""
    }
  },
  {
    id: "t5",
    label: "14yr Tennis Competitor",
    emoji: "🎾",
    color: "teal",
    data: {
      sport: "Tennis",
      age: 14,
      height: 160,
      heightUnit: "cm",
      level: "Advanced",
      currentEquipment: "Junior 26-inch aluminium racket, worn out grip wrap, tennis ball pack of 3",
      budgetMin: 15000,
      budgetMax: 40000,
      goals: ["Tournament Ready", "Improve Power", "Better Control"],
      coachName: ""
    }
  }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    templates: presetTemplates
  });
});

module.exports = router;
