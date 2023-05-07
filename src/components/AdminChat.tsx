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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FIREBASE_AUTH } from '../config/firebase';
import { FIRESTORE_DB } from '../config/firebase';

export interface Message {
    id: string;
    email: string;
}

interface AdminChatProps {
    userId: string;
    email?: string;
    onBackClick: () => void;
}

const AdminChat = ({ userId, email, onBackClick }: AdminChatProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [buttonVisible, setButtonVisible] = useState(true);

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
            if (text) {
                const newMessage = {
                    text,
                    createdAt: serverTimestamp(),
                    user: userId,
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
        <View style={styles.container}>
            <View style={styles.headerDirection}>
                <Pressable onPress={onBackClick} style={styles.backButton}>
                    <Text style={styles.buttonText}>
                        Назад
                    </Text>
                </Pressable>
                <Text style={styles.backText}>
                    {email}
                </Text>
            </View>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.keyboardAwareScrollViewContentContainer}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={-70}
            >
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
                            if (message.user === userId) {
                                return (
                                    <React.Fragment key={message.id}>
                                        <View style={[styles.messageMetaInfo, message.email !== email && styles.metaInfoLine]}>
                                            <Text style={styles.messageName}>{message.email}</Text>
                                        </View>
                                        <View key={message.id} style={[styles.messageContainer, message.email === email ? null : styles.currentUserMessage]}>
                                            <Text>{message.text}</Text><Text style={styles.messageTime}>
                                                {message.createdAt
                                                    ? new Date(message.createdAt.seconds * 1000).toLocaleDateString('ru-RU') + ' ' + new Date(message.createdAt.seconds * 1000).toLocaleTimeString()
                                                    : 'Загрузка...'
                                                }
                                            </Text>
                                            <View style={[styles.messageTail, message.email === email ? null : styles.currentUserMessageTail]} />
                                        </View>
                                    </React.Fragment>
                                );
                            } else {
                                return null;
                            }
                        })}

                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} value={text} onChangeText={(text) => setText(text)} placeholder="Введите сообщение..." placeholderTextColor="#AAA" />
                        <Pressable onPress={sendMessage}>
                            <Text style={styles.buttonText}>Отправить</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#383838',
        justifyContent: 'space-between',
        flex: 1,
    },
    keyboardAwareScrollViewContentContainer: {
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
    },
    backButton: {
        backgroundColor: '#23AD99',
        paddingVertical: 10,
        width: '17%',
        alignItems: 'center',
    },
    headerDirection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backText: {
        paddingRight: 100,
        color: 'white'
    }

});

export default AdminChat;
