import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  deleteDoc, 
  doc 
} from "firebase/firestore";

export interface FlashcardData {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PodcastTurn {
  speaker: "Host 1" | "Host 2";
  text: string;
}

export interface StudySession {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  flashcards: FlashcardData[];
  quizQuestions: QuizQuestion[];
  podcastScript: PodcastTurn[];
  documentContext: string;
  stats?: {
    mastered: number;
    score: number;
  };
}

export const saveSession = async (
  userId: string, 
  sessionData: Omit<StudySession, "id" | "userId" | "createdAt">
): Promise<StudySession> => {
  const newSession = {
    ...sessionData,
    userId,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, "sessions"), newSession);
  
  return {
    ...newSession,
    id: docRef.id
  };
};

export const getUserSessions = async (userId: string, maxResults = 10): Promise<StudySession[]> => {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as StudySession));
};

export const deleteSession = async (sessionId: string) => {
  await deleteDoc(doc(db, "sessions", sessionId));
};
