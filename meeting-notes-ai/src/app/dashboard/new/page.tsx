'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Mic, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/meeting/FileUploader';
import { AudioRecorder } from '@/components/meeting/AudioRecorder';

export default function NewMeetingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'upload'>('details');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'record' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const handleCreateMeeting = async () => {
    if (!title) {
      alert('Please enter a meeting title');
      return;
    }
    setStep('upload');
  };

  const handleProcessMeeting = async () => {
    if (!selectedFile && !recordedBlob) {
      alert('Please upload a file or record audio');
      return;
    }

    setLoading(true);
    setProgress('Creating meeting...');

    try {
      // Create meeting record
      const createResponse = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          meeting_date: new Date().toISOString(),
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(error.message || 'Failed to create meeting');
      }

      const { meeting } = await createResponse.json();

      // Upload and transcribe
      setProgress('Uploading and transcribing...');
      const formData = new FormData();

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (recordedBlob) {
        formData.append('file', recordedBlob, 'recording.webm');
      }

      formData.append('meetingId', meeting.id);

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { transcription } = await transcribeResponse.json();

      // Analyze transcription
      setProgress('Analyzing meeting...');
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: meeting.id,
          transcription,
          title,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze transcription');
      }

      // Redirect to meeting page
      router.push(`/meeting/${meeting.id}`);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to process meeting');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {step === 'details' ? (
          <Card>
            <CardHeader>
              <CardTitle>Create New Meeting</CardTitle>
              <CardDescription>Enter the details of your meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meeting Title *</label>
                <Input
                  type="text"
                  placeholder="e.g., Weekly Team Sync"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="What was this meeting about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateMeeting} className="w-full">
                Continue to Upload
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Choose how to add your meeting audio</CardDescription>
              </CardHeader>
              <CardContent>
                {!uploadMethod ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setUploadMethod('file')}
                      className="p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors text-center"
                    >
                      <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">Upload File</p>
                      <p className="text-sm text-gray-500">Audio or video</p>
                    </button>
                    <button
                      onClick={() => setUploadMethod('record')}
                      className="p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors text-center"
                    >
                      <Mic className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">Record Audio</p>
                      <p className="text-sm text-gray-500">Record directly</p>
                    </button>
                  </div>
                ) : uploadMethod === 'file' ? (
                  <div className="space-y-4">
                    <FileUploader onFileSelect={setSelectedFile} />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setUploadMethod(null)} className="flex-1">
                        Change Method
                      </Button>
                      <Button
                        onClick={handleProcessMeeting}
                        disabled={!selectedFile || loading}
                        className="flex-1"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {progress}
                          </>
                        ) : (
                          'Process Meeting'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AudioRecorder
                      onRecordingComplete={(blob) => {
                        setRecordedBlob(blob);
                      }}
                    />
                    {recordedBlob && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRecordedBlob(null);
                            setUploadMethod(null);
                          }}
                          className="flex-1"
                        >
                          Record Again
                        </Button>
                        <Button onClick={handleProcessMeeting} disabled={loading} className="flex-1">
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {progress}
                            </>
                          ) : (
                            'Process Meeting'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {loading && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="py-6">
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">{progress}</p>
                      <p className="text-sm text-blue-700">
                        This may take a few minutes depending on the length of your meeting
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
