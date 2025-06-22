// src/types/webSpeech.d.ts

interface CustomSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

// src/types/webSpeech.d.ts
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult?: (ev: CustomSpeechRecognitionEvent) => void;
  onerror?: (ev: Event) => void;
  onstart?: () => void;
  onend?: () => void;
}

// src/types/webSpeech.d.ts
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
