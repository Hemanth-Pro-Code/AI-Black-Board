"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionResultLike {
  transcript: string;
}

interface SpeechRecognitionResultListLike {
  [index: number]: SpeechRecognitionResultLike[];
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export default function VoiceInput({
  onTranscript,
}: VoiceInputProps) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <button
      onClick={toggleListening}
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: listening ? "#dc2626" : "#16a34a",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {listening ? <MicOff size={22} /> : <Mic size={22} />}
    </button>
  );
}
