import { jsPDF } from 'jspdf';

export function exportPDF(data) {
  const { sport, age, level, roadmap, playerName } = data;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2); // 170mm for A4

  let yPos = 20;

  // Helper to add page break if needed
  function checkPageBreak(heightNeeded) {
    if (yPos + heightNeeded > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      drawHeaderFooter();
    }
  }

  // Header and Footer decoration
  function drawHeaderFooter() {
    // Green accent top bar
    doc.setFillColor(22, 163, 74); // #16A34A
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Bottom margin text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // #9CA3AF
    doc.text('Oxygen Sports SportAI Equipment Planner • Hyderabad, India', margin, pageHeight - 10);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 10, pageHeight - 10);
  }

  drawHeaderFooter();

  // Branded Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39); // #111827
  doc.text('OXYGEN SPORTS', margin, yPos + 8);
  
  doc.setFontSize(10);
  doc.setTextColor(22, 163, 74); // #16A34A
  doc.text('AI-POWERED PLAYER EQUIPMENT GROWTH PLANNER', margin, yPos + 13);
  yPos += 20;

  // Metadata Box
  doc.setFillColor(248, 250, 255); // #F8FAFF
  doc.setDrawColor(229, 231, 235); // #E5E7EB
  doc.roundedRect(margin, yPos, contentWidth, 26, 4, 4, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('PLAYER PROFILE SUMMARY', margin + 6, yPos + 6);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99); // #4B5563
  if (playerName) {
    doc.text(`Player Name: ${playerName} (${age}yo)`, margin + 6, yPos + 13);
  } else {
    doc.text(`Age: ${age} Years Old`, margin + 6, yPos + 13);
  }
  doc.text(`Sport: ${sport}`, margin + 6, yPos + 18);
  doc.text(`Height: ${data.height} ${data.heightUnit}`, margin + 70, yPos + 13);
  doc.text(`Playing Level: ${level}`, margin + 70, yPos + 18);
  
  if (data.coachName) {
    doc.text(`Requested By: ${data.coachName}`, margin + 120, yPos + 13);
  }
  doc.text(`Date Generated: ${new Date(data.createdAt || Date.now()).toLocaleDateString()}`, margin + 120, yPos + 18);

  yPos += 34;

  // Summary Statement
  if (roadmap.summary) {
    checkPageBreak(15);
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    
    const summaryLines = doc.splitTextToSize(`"${roadmap.summary}"`, contentWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += (summaryLines.length * 5) + 6;
  }

  // Draw Year 1 and Year 2 sections
  function drawYearSection(yearData, title, accentColor) {
    if (!yearData) return;

    checkPageBreak(12);
    // Draw Section Header
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(margin, yPos, 4, 6, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text(title, margin + 6, yPos + 5);
    yPos += 10;

    checkPageBreak(10);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Period: ${yearData.period || '12 Months'}`, margin, yPos);
    yPos += 6;

    if (yearData.ageNote) {
      checkPageBreak(10);
      doc.setFont('Helvetica', 'oblique');
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128); // #6B7280
      const noteLines = doc.splitTextToSize(`Growth Note: ${yearData.ageNote}`, contentWidth);
      doc.text(noteLines, margin, yPos);
      yPos += (noteLines.length * 4) + 6;
    }

    // Upgrades
    if (yearData.upgrades && yearData.upgrades.length > 0) {
      yearData.upgrades.forEach((upgrade, index) => {
        // Upgrade box height estimation
        let textSpace = 30; // base size
        const reasonLines = doc.splitTextToSize(`Reason: ${upgrade.reason || ''}`, contentWidth - 10);
        const fitLines = doc.splitTextToSize(`Fit Indicator: ${upgrade.fitIndicator || ''}`, contentWidth - 10);
        textSpace += (reasonLines.length * 4.5) + (fitLines.length * 4.5);
        
        checkPageBreak(textSpace);

        // White card background
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin, yPos, contentWidth, textSpace - 4, 3, 3, 'FD');

        // Draw item title
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(22, 163, 74);
        doc.text(`${index + 1}. ${upgrade.equipment || 'Equipment Item'}`, margin + 5, yPos + 6);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text('Current:', margin + 5, yPos + 12);
        doc.setTextColor(17, 24, 39);
        doc.text(upgrade.current || 'Basic', margin + 22, yPos + 12);

        doc.setTextColor(107, 114, 128);
        doc.text('Upgrade:', margin + 5, yPos + 17);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(37, 99, 235); // Blue #2563EB
        doc.text(upgrade.recommended || 'Recommended', margin + 22, yPos + 17);

        let linesY = yPos + 22;

        // Reason text
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(reasonLines, margin + 5, linesY);
        linesY += (reasonLines.length * 4.5);

        // Fit Indicator
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(fitLines, margin + 5, linesY);
        linesY += (fitLines.length * 4.5) + 1;

        // Price & Timing row
        doc.setFillColor(243, 244, 246); // #F3F4F6
        doc.rect(margin + 1, yPos + textSpace - 11, contentWidth - 2, 7, 'F');

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(75, 85, 99);
        doc.text(`Budget Est: ${upgrade.priceRangeBudget || 'N/A'}  |  Premium Est: ${upgrade.priceRangePremium || 'N/A'}`, margin + 5, yPos + textSpace - 6);
        doc.text(`Best Time to Buy: ${upgrade.buyTiming || 'Anytime'}`, margin + 105, yPos + textSpace - 6);

        yPos += textSpace + 2;
      });
    }

    // Milestones
    if (yearData.milestones && yearData.milestones.length > 0) {
      checkPageBreak(12 + (yearData.milestones.length * 5));
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(249, 115, 22); // Orange #F97316
      doc.text('Key Growth Milestones:', margin, yPos + 4);
      yPos += 8;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      yearData.milestones.forEach(m => {
        const lines = doc.splitTextToSize(`• ${m}`, contentWidth - 4);
        doc.text(lines, margin + 2, yPos);
        yPos += (lines.length * 4.5);
      });
      yPos += 4;
    }
  }

  // Draw Year 1 (Blue accent [37, 99, 235])
  drawYearSection(roadmap.year1, 'YEAR 1 ROADMAP TIMELINE', [37, 99, 235]);

  // Draw Year 2 (Green accent [22, 163, 74])
  drawYearSection(roadmap.year2, 'YEAR 2 ROADMAP TIMELINE', [22, 163, 74]);

  // Coach Notes Card
  if (roadmap.coachNotes) {
    const notesStr = typeof roadmap.coachNotes === 'string' 
      ? roadmap.coachNotes 
      : roadmap.coachNotes.join('\n');
      
    const notesLines = doc.splitTextToSize(notesStr, contentWidth - 10);
    const boxHeight = (notesLines.length * 4.5) + 12;

    checkPageBreak(boxHeight + 10);

    doc.setFillColor(253, 244, 255); // Purple tint #FDF4FF
    doc.setDrawColor(240, 218, 250); // Light purple border
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 3, 3, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(124, 58, 237); // Purple #7C3AED
    doc.text('COACH & PARENT ADVISORY NOTES', margin + 5, yPos + 6);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(notesLines, margin + 5, yPos + 12);
    yPos += boxHeight + 6;
  }

  // Budget & Review Summary Row
  checkPageBreak(20);
  doc.setFillColor(240, 253, 250); // Teal tint
  doc.setDrawColor(204, 251, 241);
  doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136); // Teal #0D9488
  doc.text(`Total 2-Year Budget Estimate: ${roadmap.totalBudgetEstimate || 'N/A'}`, margin + 5, yPos + 9);
  doc.text(`Recommended Next Sizing Review: Age ${roadmap.nextReviewAge || 'N/A'}`, margin + 100, yPos + 9);

  // Save the PDF
  const filename = `${sport.toLowerCase()}_roadmap_${age}yo_${level.toLowerCase()}.pdf`;
  doc.save(filename);
}
