import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Keyboard,
    Image,
    ActivityIndicator,
} from 'react-native';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FIREBASE_AUTH } from '../config/firebase';
import { FIRESTORE_DB } from '../config/firebase';
import { FIREBASE_STORAGE } from '../config/firebase';
import Feather from 'react-native-vector-icons/Feather';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Message {
    id: string;
    email: string;
    image: string;
}

interface ChatProps {
    isAdmin: boolean;
    userId: string;
    userEmail?: string;
    onBackClick?: () => void;
}

const Chat = ({ isAdmin, userId, userEmail, onBackClick }: ChatProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [buttonVisible, setButtonVisible] = useState(true);

    const currentUId = userId;
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
            if (text || selectedImage) {
                const newMessage = {
                    text,
                    createdAt: serverTimestamp(),
                    user: currentUId,
                    email: currentEmail,
                    image: '',
                };
                if (selectedImage) {
                    const response = await fetch(selectedImage);
                    const blob = await response.blob();
                    const storageRef = ref(FIREBASE_STORAGE, `images/${Math.random().toString(36).substring(7)}`);
                    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
                    const downloadURL = await getDownloadURL(storageRef);
                    newMessage.image = downloadURL;
                }
                await addDoc(messageRef, newMessage);
                setText('');
                setSelectedImage(null);
                scrollViewRef.current?.scrollToEnd();
            }
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    };

    const openGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setSelectedImage(result.uri);
            setImageLoaded(false);
        }
    };

    return (
        <View style={styles.container}>
            {isAdmin && (
                <View style={styles.headerDirection}>
                    <Pressable onPress={onBackClick} style={styles.backButton}>
                        <Text style={styles.buttonText}>
                            Назад
                        </Text>
                    </Pressable>
                    <Text style={styles.backText}>
                        {userEmail}
                    </Text>
                </View>
            )}
            <KeyboardAwareScrollView
                contentContainerStyle={styles.keyboardAwareScrollViewContentContainer}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={-70}
            >
                {buttonVisible && (
                    <TouchableOpacity style={styles.scrollButton} onPress={dragChatDown}>
                        <Feather
                            name="chevrons-down"
                            color={"#6154C8"}
                            size={40}
                        />
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
                                        {isAdmin
                                            ? <>
                                                <View style={[styles.messageMetaInfo, message.email !== userEmail && styles.metaInfoLine]}>
                                                    <Text style={styles.messageName}>{message.email}</Text>
                                                </View>
                                                <View key={message.id} style={[styles.messageContainer, message.email === userEmail ? null : styles.currentUserMessage]}>
                                                    {message.text ? <Text>{message.text}</Text> : null}
                                                    {message.image ? (
                                                    <View style={styles.messageImageContainer}>
                                                        <Image
                                                            source={{ uri: message.image }}
                                                            style={styles.messageImage}
                                                            resizeMode="cover"
                                                            onLoad={() => setImageLoaded(true)}
                                                        />
                                                    </View>
                                                    ) : null}

                                                    <Text style={styles.messageTime}>
                                                        {message.createdAt
                                                            ? new Date(message.createdAt.seconds * 1000).toLocaleDateString('ru-RU') + ' ' + new Date(message.createdAt.seconds * 1000).toLocaleTimeString()
                                                            : 'Загрузка...'
                                                        }
                                                    </Text>
                                                    <View style={[styles.messageTail, message.email === userEmail ? null : styles.currentUserMessageTail]} />
                                                </View>
                                            </>
                                            : <>
                                            <View style={[styles.messageMetaInfo, message.email === userEmail && styles.metaInfoLine]}>
                                                <Text style={styles.messageName}>{message.email}</Text>
                                            </View>
                                            <View key={message.id} style={[styles.messageContainer, message.email !== userEmail ? null : styles.currentUserMessage]}>
                                                {message.text ? <Text>{message.text}</Text> : null}
                                                {message.image ? (
                                                <View style={styles.messageImageContainer}>
                                                    <Image
                                                        source={{ uri: message.image }}
                                                        style={styles.messageImage}
                                                        resizeMode="cover"
                                                        onLoad={() => setImageLoaded(true)}
                                                    />
                                                </View>
                                                ) : null}

                                                <Text style={styles.messageTime}>
                                                    {message.createdAt
                                                        ? new Date(message.createdAt.seconds * 1000).toLocaleDateString('ru-RU') + ' ' + new Date(message.createdAt.seconds * 1000).toLocaleTimeString()
                                                        : 'Загрузка...'
                                                    }
                                                </Text>
                                                <View style={[styles.messageTail, message.email !== userEmail ? null : styles.currentUserMessageTail]} />
                                            </View>
                                        </>
                                        }
                                    </React.Fragment>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <Pressable style={styles.paperclip} onPress={openGallery}>
                            <Feather
                                name="paperclip"
                                color={"white"}
                                size={24}
                            />
                        </Pressable>
                        <TextInput style={styles.input} value={text} onChangeText={(text) => setText(text)} placeholder="Введите сообщение..." placeholderTextColor="#AAA" />
                        <Pressable style={styles.sendButton} onPress={sendMessage}>
                            <Feather
                                name="send"
                                color={"white"}
                                size={24}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.selectedImageContainer}>
                        {selectedImage && (
                            <View style={styles.selectedImageWrapper}>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={styles.selectedImage}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => setSelectedImage(null)}
                                >
                                    <Feather name="x" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
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
        color: 'white',
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
        backgroundColor: '#6154C8',
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
    },
    paperclip: {
        marginLeft: 5,
        marginRight: 10,
    },
    sendButton: {
        marginRight: 5,
    },
    messageImageContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    messageImage: {
        width: 250,
        height: 250,
        borderRadius: 10,
    },
    selectedImageContainer: {
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "center",
      },
      selectedImageWrapper: {
        position: "relative",
        marginRight: 10,
      },
      selectedImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
      },
      removeImageButton: {
        position: "absolute",
        top: -10,
        right: -10,
        backgroundColor: "#ff3b3b",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
      },
});

export default Chat;
