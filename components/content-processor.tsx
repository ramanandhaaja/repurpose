import React from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContentProcessorProps {
  isProcessing: boolean;
  generatedContent?: {
    instagram?: string;
    twitter?: string[];
    linkedin?: string;
  };
  onRegenerate?: (platform: string) => void;
}

export function ContentProcessor({
  isProcessing,
  generatedContent,
  onRegenerate,
}: ContentProcessorProps) {
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <div className="text-lg font-medium">Repurposing Content...</div>
        <div className="text-sm text-muted-foreground">This may take a few moments</div>
        <div className="w-full max-w-xs bg-secondary rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!generatedContent) return null;

  return (
    <Tabs defaultValue="instagram" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="instagram">Instagram</TabsTrigger>
        <TabsTrigger value="twitter">Twitter</TabsTrigger>
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
      </TabsList>

      <TabsContent value="instagram">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <textarea
              className="w-full min-h-[200px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue={generatedContent.instagram}
            />
            <Button 
              onClick={() => onRegenerate?.('instagram')}
              className="w-full"
            >
              Regenerate
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="twitter">
        <Card>
          <CardContent className="space-y-4 pt-6">
            {generatedContent.twitter?.map((tweet, index) => (
              <div key={index} className="space-y-2">
                <textarea
                  className="w-full min-h-[100px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={tweet}
                />
              </div>
            ))}
            <Button 
              onClick={() => onRegenerate?.('twitter')}
              className="w-full"
            >
              Regenerate Thread
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="linkedin">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <textarea
              className="w-full min-h-[200px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue={generatedContent.linkedin}
            />
            <Button 
              onClick={() => onRegenerate?.('linkedin')}
              className="w-full"
            >
              Regenerate
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
