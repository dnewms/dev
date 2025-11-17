import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TranscriptionResult {
  text: string;
  duration: number;
  language?: string;
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    task: string;
    assignee?: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  keyDecisions: Array<{
    decision: string;
    context: string;
  }>;
  speakers?: Array<{
    label: string;
    segments: number;
  }>;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<TranscriptionResult> {
  try {
    // Create a File-like object from the buffer
    const file = new File([audioBuffer], filename, {
      type: 'audio/mpeg',
    });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word', 'segment'],
    });

    return {
      text: transcription.text,
      duration: (transcription as any).duration || 0,
      language: (transcription as any).language,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function analyzeTranscription(
  transcription: string,
  meetingTitle: string
): Promise<AnalysisResult> {
  try {
    const prompt = `You are an AI assistant analyzing a meeting transcript. Please provide a comprehensive analysis of the following meeting titled "${meetingTitle}".

Transcript:
${transcription}

Please provide your analysis in the following JSON format:
{
  "summary": "A concise 2-3 paragraph summary of the meeting",
  "keyPoints": ["Array of 5-10 key points discussed in the meeting"],
  "actionItems": [
    {
      "task": "Description of the action item",
      "assignee": "Person responsible (if mentioned, otherwise null)",
      "priority": "high|medium|low"
    }
  ],
  "keyDecisions": [
    {
      "decision": "The decision that was made",
      "context": "Brief context or reasoning"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing meeting transcripts and extracting key information. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze transcription');
  }
}

export async function identifySpeakers(transcription: string): Promise<any> {
  // Note: OpenAI Whisper doesn't natively support speaker diarization
  // You would need to use a service like AssemblyAI or Deepgram for this
  // This is a placeholder implementation

  try {
    const prompt = `Analyze this transcript and identify distinct speakers based on context, conversation flow, and speaking patterns. Assign labels like "Speaker 1", "Speaker 2", etc.

Transcript:
${transcription}

Return a JSON object with speaker segments:
{
  "speakers": [
    {
      "label": "Speaker 1",
      "segments": [
        {
          "text": "What they said",
          "estimatedStart": 0,
          "estimatedEnd": 10
        }
      ]
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing conversations and identifying different speakers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Speaker identification error:', error);
    return { speakers: [] };
  }
}
