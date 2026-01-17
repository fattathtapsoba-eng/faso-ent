import jsPDF from 'jspdf';
import type { BulletinData, SchoolInfo } from '../types';

/**
 * Generate a professional PDF bulletin (report card) for a student
 */
export async function generateBulletin(
    bulletinData: BulletinData,
    schoolInfo: SchoolInfo
): Promise<void> {
    const { student, trimester, schoolYear, grades, stats, observations } = bulletinData;

    // Create PDF document (A4 format)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    // ===== HEADER =====
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(schoolInfo.name, pageWidth / 2, yPos, { align: 'center' });

    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (schoolInfo.address) {
        doc.text(schoolInfo.address, pageWidth / 2, yPos, { align: 'center' });
        yPos += 5;
    }
    if (schoolInfo.phone) {
        doc.text(`Tél: ${schoolInfo.phone}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 5;
    }

    yPos += 5;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });

    yPos += 7;
    doc.setFontSize(12);
    doc.text(`Trimestre ${trimester} - ${schoolYear}`, pageWidth / 2, yPos, { align: 'center' });

    // Separator line
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // ===== STUDENT INFO =====
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Élève: ${student.first_name} ${student.name}`, margin, yPos);
    doc.text(`Classe: ${student.class_name}`, pageWidth - margin - 40, yPos);

    // ===== GRADES TABLE =====
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);

    // Table header
    const colWidths = [70, 70, 30];
    const startX = margin;

    doc.text('MATIÈRE', startX, yPos);
    doc.text('NOTES', startX + colWidths[0], yPos);
    doc.text('MOYENNE', startX + colWidths[0] + colWidths[1], yPos);

    yPos += 2;
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Group grades by subject
    const gradesBySubject: { [key: string]: number[] } = {};
    grades.forEach(grade => {
        if (!gradesBySubject[grade.subject]) {
            gradesBySubject[grade.subject] = [];
        }
        gradesBySubject[grade.subject].push(grade.score);
    });

    // Table rows
    yPos += 7;
    doc.setFont('helvetica', 'normal');

    stats.subject_averages.forEach(subj => {
        const subjectGrades = gradesBySubject[subj.subject] || [];
        const gradesText = subjectGrades.join(', ');

        doc.text(subj.subject, startX, yPos);
        doc.text(gradesText, startX + colWidths[0], yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(subj.average.toFixed(2), startX + colWidths[0] + colWidths[1], yPos);
        doc.setFont('helvetica', 'normal');

        yPos += 7;
    });

    // Separator
    yPos += 2;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // ===== OVERALL AVERAGE =====
    yPos += 10;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');

    const avgColor = stats.overall_average >= 12 ? [34, 197, 94] :
        stats.overall_average >= 10 ? [249, 115, 22] :
            [239, 68, 68];
    doc.setTextColor(avgColor[0], avgColor[1], avgColor[2]);
    doc.text(`MOYENNE GÉNÉRALE: ${stats.overall_average.toFixed(2)} / 20`, margin, yPos);

    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    if (stats.rank && stats.total_students) {
        doc.text(`Rang: ${stats.rank}${getRankSuffix(stats.rank)} sur ${stats.total_students} élèves`, margin, yPos);
    }

    // ===== OBSERVATIONS =====
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('OBSERVATIONS:', margin, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const observationText = observations || getDefaultObservation(stats.overall_average);
    const splitObservations = doc.splitTextToSize(observationText, pageWidth - 2 * margin);
    doc.text(splitObservations, margin, yPos);

    // ===== FOOTER =====
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, footerY);
    doc.text('Signature:', pageWidth - margin - 30, footerY);

    // Save PDF
    const fileName = `Bulletin_${student.first_name}_${student.name}_T${trimester}.pdf`;
    doc.save(fileName);
}

/**
 * Get rank suffix for French (1er, 2ème, 3ème, etc.)
 */
function getRankSuffix(rank: number): string {
    return rank === 1 ? 'er' : 'ème';
}

/**
 * Generate default observation based on average
 */
function getDefaultObservation(average: number): string {
    if (average >= 16) {
        return 'Excellent travail ! Résultats remarquables. Continuez sur cette voie.';
    } else if (average >= 14) {
        return 'Très bon travail. Résultats très satisfaisants. Encouragements.';
    } else if (average >= 12) {
        return 'Bon travail. Résultats satisfaisants. Peut mieux faire.';
    } else if (average >= 10) {
        return 'Travail acceptable. Doit fournir plus d\'efforts pour progresser.';
    } else {
        return 'Résultats insuffisants. Travail sérieux et régulier indispensable.';
    }
}
