'use client';
import React, { useState } from 'react';
import { Upload, FileType, Settings2, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUpload } from '@/app/hooks/useUploads';
import { useCharacterCount } from '@/app/hooks/useCharacterCount';
import useContentRepurposing from '@/app/hooks/useContentRepurposing';
import type { OutputType } from '@/app/hooks/useCharacterCount';
import { ContentProcessor } from '@/components/content-processor';
import { useSearchParams } from 'next/navigation';

const ContentRepurposer = () => {
  const searchParams = useSearchParams();
  const [selectedOutputTypes, setSelectedOutputTypes] = useState<OutputType[]>(['instagram']);
  const [inputMediaType, setInputMediaType] = useState<string>(searchParams.get('type') || '');
  const [tone, setTone] = useState('');
  const [url, setUrl] = useState('');
  const [showProcessor, setShowProcessor] = useState(false);
  const [useDummyData, setUseDummyData] = useState(true);

  const { isProcessing, generatedContent, repurposeContent } = useContentRepurposing();

  const {
    files,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
  } = useUpload();

  const {
    characterCount,
    isOverLimit,
    maxCharacters,
  } = useCharacterCount(selectedOutputTypes[0]);

  const handleUrlInput = (value: string) => {
    setUrl(value);
  };

  
  const handleRepurpose = async () => {
    setShowProcessor(true);
    if (files.length > 0) {
      if (inputMediaType === 'image') {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target?.result as string;
          await repurposeContent(file, fileContent, tone, selectedOutputTypes, inputMediaType, url, useDummyData);
        };
        reader.readAsDataURL(file);
      } else {
        const file = files[0];
        const fileContent = files[0].name;
        await repurposeContent(file, fileContent, tone, selectedOutputTypes, inputMediaType, url, useDummyData);
      }
    }
  };

  const handleRegenerate = async (platform: string) => {
    const file = files[0];
    const fileContent = files[0].name;
    await repurposeContent(file, fileContent, tone, [platform], inputMediaType, url, useDummyData);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {!showProcessor ? (
          <>
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Content {inputMediaType.charAt(0).toUpperCase() + inputMediaType.slice(1)}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dummy-mode"
                      checked={useDummyData}
                      onCheckedChange={setUseDummyData}
                    />
                    <Label htmlFor="dummy-mode" className="text-sm text-muted-foreground">
                      {useDummyData ? 'Using Dummy Data' : 'Using Real API'}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <FileType className="w-12 h-12 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">
                        Upload your content
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag files here
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                      {inputMediaType === 'article' && (
                        <div className="flex-1">
                          <input
                            type="url"
                            placeholder="Paste URL here"
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            onChange={(e) => handleUrlInput(e.target.value)}
                          />
                        </div>
                      )}
                      {inputMediaType !== 'article' && (
                        <div className="flex-1 justify-center">
                          <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            multiple
                          />
                          <label htmlFor="file-upload">
                            <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                              Choose File
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Uploaded Files:</h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileType className="w-4 h-4" />
                            {file.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  Output Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Output Type</label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOutputTypes.includes('instagram')}
                        onChange={() => setSelectedOutputTypes(prev => prev.includes('instagram') ? prev.filter(type => type !== 'instagram') : [...prev, 'instagram'])}
                      />
                      <span className="ml-2">Instagram Captions</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOutputTypes.includes('twitter')}
                        onChange={() => setSelectedOutputTypes(prev => prev.includes('twitter') ? prev.filter(type => type !== 'twitter') : [...prev, 'twitter'])}
                      />
                      <span className="ml-2">Twitter Posts</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOutputTypes.includes('linkedin')}
                        onChange={() => setSelectedOutputTypes(prev => prev.includes('linkedin') ? prev.filter(type => type !== 'linkedin') : [...prev, 'linkedin'])}
                      />
                      <span className="ml-2">Linkedin</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone/Style</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="anak gaul jakarta selatan">Anak Gaul Jaksel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                  Character count: {characterCount}/{maxCharacters}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button 
              className="w-full" 
              size="lg"
              disabled={files.length === 0 || selectedOutputTypes.length === 0 || !tone}
              onClick={handleRepurpose}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Repurpose Content
            </Button>
          </>
        ) : (
          <ContentProcessor
            isProcessing={isProcessing}
            generatedContent={generatedContent}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>
    </div>
  );
};

export default ContentRepurposer;