
import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserChat from '../components/UserChat';

const UserCall = () => {
  return (
    <View style={styles.chatContainer} >
      <UserChat></UserChat>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#838383',
    paddingTop: 50,
    justifyContent: 'center',
  },
});

export default UserCall;
