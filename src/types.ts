import { Id } from "./convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  role: "student" | "teacher";
}

export interface Message {
  _id: Id<"messages">;
  user_id: Id<"users">;
  content: string;
  created_at: number;
  senderName: string;
  senderRole: string;
}

export interface TranslationData {
  hanzi: string;
  pinyin: string;
  translation_fr: string;
  translation_mg: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
