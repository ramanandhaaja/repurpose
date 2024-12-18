import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Analysis {
  totalWords: number;
  errorCount: number;
  qualityScore: number;
  issues: string[];
}

const YouTubeTranscriptAnalyzer = () => {
  const [url, setUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Analyze transcript quality
  const analyzeTranscript = (transcript: string): Analysis => {
    const commonErrors = ['[Music]', '[Applause]', '[Inaudible]'];
    const words = transcript.split(/\s+/);
    const errors = commonErrors.reduce((count, error) => 
      count + (transcript.match(new RegExp(error, 'g')) || []).length, 0);
    
    return {
      totalWords: words.length,
      errorCount: errors,
      qualityScore: Math.max(0, 100 - (errors * 5)),
      issues: errors > 0 ? ['Found caption markers indicating potential issues'] : []
    };
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      // Note: In a real implementation, you would need to:
      // 1. Set up a YouTube Data API key
      // 2. Use the captions endpoint to fetch available caption tracks
      // 3. Download and parse the caption track
      // For demo purposes, we'll simulate a response
      // Mock API call - replace with actual API integration
      const mockTranscript = "This is a sample transcript [Music] with some [Inaudible] parts.";
      const result = analyzeTranscript(mockTranscript);
      setAnalysis(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">YouTube Transcript Quality Analyzer</h2>
        
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Analysis Complete</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <p>Quality Score: {analysis.qualityScore}/100</p>
                  <p>Total Words: {analysis.totalWords}</p>
                  <p>Issues Found: {analysis.errorCount}</p>
                  {analysis.issues.map((issue, index) => (
                    <p key={index} className="text-sm text-gray-600">• {issue}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>

            {analysis.qualityScore < 80 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Recommendation</AlertTitle>
                <AlertDescription>
                  The transcript quality might need improvement. Consider:
                  <ul className="list-disc ml-6 mt-2">
                    <li>Checking for manually created captions</li>
                    <li>Using a professional transcription service</li>
                    <li>Manually reviewing and correcting the transcript</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeTranscriptAnalyzer;