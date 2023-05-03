import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from 'react-native';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FIREBASE_AUTH } from '../config/firebase';
import { FIRESTORE_DB } from '../config/firebase';


export interface Message {
  id: string;
  email: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);

  const currentUId = FIREBASE_AUTH.currentUser?.uid;
  const currentEmail = FIREBASE_AUTH.currentUser?.email;
  const messageRef = collection(FIRESTORE_DB, 'messages');
  const messageQuery = query(collection(FIRESTORE_DB, 'messages'), orderBy('createdAt'));
  const scrollViewRef = useRef<ScrollView>(null);

  const dragChatDown = () => {
    scrollViewRef.current?.scrollToEnd();
    setButtonVisible(false);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height;
    setButtonVisible(!isAtBottom);
  };

  const handleContentSizeChange = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  useEffect(() => {
    const subscriber = onSnapshot(messageQuery, {
      next: (snapshot) => {
        const messages: any[] = [];
        snapshot.docs.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          } as Message);
        });
        setMessages(messages);
      },
    });
    return () => subscriber();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleContentSizeChange);

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    try {
      if(text){
        const newMessage = {
          text,
          createdAt: serverTimestamp(),
          user: currentUId,
          email: currentEmail,
        };
        await addDoc(messageRef, newMessage);
        setText('');
        scrollViewRef.current?.scrollToEnd();
      }
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
      {buttonVisible && (
        <TouchableOpacity style={styles.scrollButton}>
          <Ionicons name="arrow-down-outline" size={40} color="blue" onPress={dragChatDown} />
        </TouchableOpacity>
      )}

      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 30 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
        >
          {messages.map((message) => {
            return (
              <>
                <View style={[styles.messageMetaInfo, message.user === currentUId && styles.metaInfoLine]}>
                  <Text style={styles.messageName}>{message.email}</Text>
                </View>
                <View key={message.id} style={[styles.messageContainer, message.user === currentUId ? styles.currentUserMessage : null]}>
                  <Text>{message.text}</Text>
                  <Text style={styles.messageTime}>{message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : 'Загрузка...'}</Text>
                  <View style={[styles.messageTail, message.user === currentUId ? styles.currentUserMessageTail : null]} />
                </View>
              </>
            );
          })}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={text} onChangeText={(text) => setText(text)} placeholder="Введите сообщение..." placeholderTextColor="#AAA" />
          <Pressable onPress={sendMessage}>
            <Text style={styles.buttonText}>Отправить</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#383838',
    justifyContent: 'space-between',
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    backgroundColor: '#c1c1c1',
  },
  messageContainer: {
    backgroundColor: '#a1a1a1',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 30,
  },
  currentUserMessage: {
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight: 30,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#931313',
    textAlign: 'right',
  },
  messageTail: {
    position: 'absolute',
    left: 'auto',
    right: 5,
    bottom: -10,
    borderTopWidth: 10,
    borderTopColor: '#a1a1a1',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
  },
  currentUserMessageTail: {
    left: 10,
    right: 'auto',
    borderRightWidth: 10,
    borderLeftWidth: 0,
    borderTopColor: 'white',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 8,
    color: 'white'
  },
  messageMetaInfo: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  metaInfoLine: {
    flexDirection: 'row',
  },
  messageName: {
    fontSize: 14,
    color: '#010101'
  },
  scrollButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    height: 50,
    width: 50,
    opacity: 0.8,
    backgroundColor: 'grey',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white'
  }

});

export default Chat;
