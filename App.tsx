import React from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {styles} = useStyle();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.startPageContainer}>
          <View style={styles.loginFieldContainer}>
            <Text style={styles.title}>Введите данные</Text>
            <SafeAreaView>
              <TextInput style={styles.input} placeholder="login" />
              <TextInput
                style={styles.input}
                placeholder="password"
                keyboardType="numeric"
              />
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Отправить</Text>
              </Pressable>
            </SafeAreaView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyle = () => {
  const dimensions = useWindowDimensions();
  console.log('Logging dimensions', dimensions);

  const styles = StyleSheet.create({
    startPageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#171717',
      height: dimensions.height,
      width: dimensions.width,
    },
    loginFieldContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 24,
      paddingVertical: 8,
      borderWidth: 4,
      borderColor: '#20232a',
      borderRadius: 6,
      backgroundColor: '#888888',
      color: '#20232a',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      height: dimensions.height / 2,
      width: dimensions.width / 1.2,
    },
    title: {
      fontSize: 30,
      color: '#20232a',
    },
    input: {
      height: 50,
      fontSize: 20,
      width: dimensions.width / 1.7,
      marginTop: 12,
      marginBottom: 12,
      borderWidth: 1,
      padding: 10,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimensions.width / 1.7,
      backgroundColor: '#131313',
      marginTop: 12,
      marginBottom: 12,
      height: 50,
      cursor: 'pointer',
    },
    buttonText: {
      color: '#FFFFFF',
    },
  });

  return {styles};
};

export default App;
