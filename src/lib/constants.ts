export const PROJECT_ID = 'farcaster-frames-template';
export const PROJECT_TITLE = "Maschine Capabilities Quiz";
export const PROJECT_DESCRIPTION = "Test your knowledge of what's possible with Maschine frames";
export const QUIZ_QUESTIONS = [
  {
    question: "Can I build a frame for displaying images?",
    answer: true,
    explanation: "✅ Yes! Maschine supports image rendering through SVG and PNG generation"
  },
  {
    question: "Can I create a gallery using only maschine?",
    answer: false,
    explanation: "❌ No - Gallery functionality requires external image storage Maschine doesn't provide"
  },
  {
    question: "Can I interact with the frame using gestures?",
    answer: false,
    explanation: "❌ No - Current frame interactions are limited to button clicks and text input"
  }
];
export const RESULT_MESSAGES = [
  { score: 0, text: "Keep learning! 🧠" },
  { score: 1, text: "Good start! 🌱" },
  { score: 2, text: "Almost there! 💡" },
  { score: 3, text: "Perfect score! 🎯" }
];
