import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
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

const windowWidth = Dimensions.get('window').width;
const screenWidth = Dimensions.get('screen').width;

export interface Message {
  id: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);

  const currentUId = FIREBASE_AUTH.currentUser?.uid;
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

  const sendMessage = async () => {
    try {
      const newMessage = {
        text,
        createdAt: serverTimestamp(),
        user: currentUId,
      };
      await addDoc(messageRef, newMessage);
      setText('');
      scrollViewRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
      {buttonVisible && (
        <TouchableOpacity style={styles.test}>
          <Ionicons name="arrow-down-outline" size={40} color="blue" onPress={dragChatDown} />
        </TouchableOpacity>
      )}

      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 30 }}
          onScroll={handleScroll}
          onContentSizeChange={handleContentSizeChange}
        >
          {messages.map((message) => {
            return (
              <>
                <View style={styles.messageMetaInfo}>
                  <Text style={styles.messageName}>{message.user}</Text>
                </View>
                <View key={message.id} style={[styles.messageContainer, message.user === currentUId && styles.currentUserMessage]}>
                  <Text>{message.text}</Text>
                  <Text style={styles.messageTime}>{message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : 'Загрузка...'}</Text>
                </View>
              </>
            );
          })}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={text} onChangeText={(text) => setText(text)} placeholder="Введите сообщение..." />
          <Button title="Отправить" color="white" onPress={sendMessage} />
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
    backgroundColor: '#b1b1b1',
  },
  messageContainer: {
    backgroundColor: '#e1e1e1',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  currentUserMessage: {
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    textAlign: 'right',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  messageName: {
    fontSize: 14,
    color: '#010101'
  },
  test: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    height: 50,
    width: 50,
    opacity: 0.5,
    backgroundColor: 'grey',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default Chat;
