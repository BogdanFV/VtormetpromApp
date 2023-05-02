
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chat from '../components/Chat';
function Call() {
  return (
    <View style={styles.chatContainer} >
      <Chat></Chat>
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

export default Call;
