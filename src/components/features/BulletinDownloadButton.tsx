import { useState } from 'react';
import { Button } from '../ui/button';
import { getBulletinData, getSchoolInfo } from '../../services/api/mockApi';
import { generateBulletin } from '../../utils/pdfGenerator';
import { FileDown, Loader2 } from 'lucide-react';

interface BulletinDownloadButtonProps {
    studentId: string;
    trimester: number;
    buttonText?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
}

export function BulletinDownloadButton({
    studentId,
    trimester,
    buttonText = 'Télécharger Bulletin',
    variant = 'default',
    size = 'default',
    className = '',
}: BulletinDownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDownload() {
        setIsGenerating(true);
        setError(null);

        try {
            // Fetch bulletin data and school info
            const [bulletinData, schoolInfo] = await Promise.all([
                getBulletinData(studentId, trimester),
                getSchoolInfo(),
            ]);

            // Generate and download PDF
            await generateBulletin(bulletinData, schoolInfo);
        } catch (err) {
            console.error('Error generating bulletin:', err);
            setError('Erreur lors de la génération du bulletin');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div>
            <Button
                onClick={handleDownload}
                disabled={isGenerating}
                variant={variant}
                size={size}
                className={className}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Génération...
                    </>
                ) : (
                    <>
                        <FileDown className="h-4 w-4 mr-2" />
                        {buttonText}
                    </>
                )}
            </Button>

            {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
        </div>
    );
}
