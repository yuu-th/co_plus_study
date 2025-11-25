// ChatPage - 相談チャットページ Phase 実装
import { useState } from 'react';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import ChatInput from '../../components/chat/ChatInput/ChatInput';
import MessageList from '../../components/chat/MessageList/MessageList';
import { mockMessages } from '../../mockData/chats';
import type { Message } from '../../types';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const mentorName = '高専 花子';
  const studentName = '田中太郎';

  const handleSend = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>相談</h1>
      <ChatHeader mentorName={mentorName} studentName={studentName} />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPage;
