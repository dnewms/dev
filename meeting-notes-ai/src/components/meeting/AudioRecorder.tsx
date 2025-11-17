'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start audio level animation
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="w-full">
      <div className="border-2 border-dashed rounded-lg p-12 text-center">
        {!isRecording ? (
          <>
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Mic className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-medium mb-2">Record Audio</p>
            <p className="text-sm text-gray-500 mb-6">Click the button below to start recording</p>
            <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1 bg-red-600 rounded-full transition-all duration-100',
                      isPaused ? 'h-4' : 'h-4'
                    )}
                    style={{
                      height: isPaused ? '16px' : `${16 + audioLevel * 40 * (Math.random() * 0.5 + 0.5)}px`,
                    }}
                  />
                ))}
              </div>
              <p className="text-3xl font-mono font-bold text-red-600">{formatDuration(recordingTime)}</p>
              <p className="text-sm text-gray-500 mt-2">
                {isPaused ? 'Recording paused' : 'Recording in progress...'}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" onClick={pauseRecording}>
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
              <Button variant="destructive" onClick={stopRecording}>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
