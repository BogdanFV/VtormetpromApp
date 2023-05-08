import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Chat from '../components/Chat';
import { FIREBASE_AUTH } from '../config/firebase';

const UserCall = () => {
  const [currentUId, setCurrentUId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        await FIREBASE_AUTH.currentUser?.reload();
        const currentUser = FIREBASE_AUTH.currentUser;
        setCurrentUId(currentUser?.uid as string);
        setCurrentEmail(currentUser?.email as string);
      } catch (error) {
        console.log('Error getting current user: ', error);
        setCurrentUId(null);
        setCurrentEmail(null);
      }
    }

    if (!currentUId || !currentEmail) {
      fetchCurrentUser();
    }
  }, [currentUId, currentEmail]);

  return (
    <View style={styles.chatContainer}>
      {currentUId && currentEmail && (
        <Chat
          isAdmin={false}
          userId={currentUId}
          userEmail={currentEmail}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#838383',
    paddingTop: 50,
    justifyContent: 'center',
  },
});

export default UserCall;
