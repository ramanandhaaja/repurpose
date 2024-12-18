import { useState } from 'react';
import OpenAI from 'openai';
import { createOriginalContent, createRepurposedContent } from '../lib/services/content.server';

const useContentRepurposing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    instagram?: string;
    twitter?: string[];
    linkedin?: string;
  }>();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const repurposeContent = async (file: File, input: string, tone: string, outputTypes: string[], inputType: string, url: string, useDummyData: boolean) => {
    setIsProcessing(true);

    try {
      const platformInstructions = outputTypes.map(type => {
        if (type === 'twitter') {
          return "- For Twitter: Create a thread of 3 tweets (each starting with a number). Keep each tweet under 280 characters.";
        } else if (type === 'instagram') {
          return "- For Instagram: Create a caption with emojis and relevant hashtags.";
        } else {
          return "- For LinkedIn: Create a professional post that's engaging and informative.";
        }
      }).join('\n');

      const systemPrompt = `You are a content repurposing expert. Analyze the ${inputType} and convert it into multiple formats with a ${tone} tone.
Please provide content for each requested platform, clearly separated by platform headers:
${platformInstructions}

Format your response like this:
[INSTAGRAM]
(Instagram content here)

[TWITTER]
1. (First tweet)
2. (Second tweet)
3. (Third tweet)

[LINKEDIN]
(LinkedIn content here)`;

      console.log('Input type:', inputType);
      console.log('System Prompt:', systemPrompt);

      let content: string;
      if (!useDummyData) {
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: "user",
              content: [
                {
                  "type": "image_url",
                  "image_url": {
                    "url": input,
                  },
                },
              ],
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });
        console.log('Response:', response);
        content = response.choices[0]?.message?.content?.trim() || '';
      } else {

        //DUMMY
        const response = `[INSTAGRAM]
📸 Check out this amazing content! Perfect for your feed. #ContentCreation #SocialMedia

[TWITTER]
1. 🚀 Exciting new content alert! Here's what you need to know...
2. 💡 Pro tip: Repurpose your content across platforms for maximum reach
3. 🎯 Want to learn more? Check out our full guide!

[LINKEDIN]
🔍 Professional insight: Content repurposing is key to maximizing your digital presence. Here's how we can help you achieve better engagement across all platforms...`.trim();

        console.log('Response:', response);
        content = response.trim();
        //DUMMY
      }
      if (content) {
        const newContent: { [key: string]: string | string[] } = {};
        let originalContentId: string;

        //create orginal content

        try {
          console.log('Attempting to create original content...');

          // Create a serializable file data object
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size
          };

          const result = await createOriginalContent(fileData, input, inputType, url);
          console.log('Result:', result);
          if (!result.success) {
            throw new Error(result.error);
          }
          originalContentId = result.data.id;
          console.log('Original content saved:', result.data);
        } catch (error) {
          console.error('Error creating content:', error);
          throw error;
        }

        // Parse the content for each platform
        for (const type of outputTypes) {
          const platformRegex = new RegExp(`\\[${type.toUpperCase()}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
          const match = content.match(platformRegex);
          if (match && match[1]) {
            const platformContent = match[1].trim();
            if (type === 'twitter') {
              // Split Twitter content into an array of tweets, removing empty lines
              newContent[type] = platformContent
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('['));
            } else {
              newContent[type] = platformContent;
            }

            //create repurposed content result
            try {
              const result = await createRepurposedContent(originalContentId,
                type,
                tone,
                platformContent,
                0);
              if (!result.success) {
                throw new Error(result.error);
              }
              console.log('Repurposed content saved:', result.data);
            } catch (error) {
              console.error('Error creating content:', error);
              throw error;
            }
          }
        }

        setGeneratedContent(prev => ({
          ...prev,
          ...newContent
        }));
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, generatedContent, repurposeContent };
};

export default useContentRepurposing;
