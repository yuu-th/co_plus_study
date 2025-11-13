// チャット関連の型定義

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'mentor';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  studentId: string;
  mentorId: string;
  messages: Message[];
  lastMessageAt: string;
}
