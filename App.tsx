import React, {useState} from 'react';
import {
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

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {styles} = useStyle();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginChange = (value: string) => {
    setLogin(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = () => {
    console.log(`Login: ${login}, Password: ${password}`);
    setLogin('');
    setPassword('');
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View style={styles.loginFieldContainer}>
          <Text style={styles.title}>Введите данные</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              value={login}
              onChangeText={handleLoginChange}
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
            />
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Отправить</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyle = () => {
  const dimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
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
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: '#f5f5f5',
      height: dimensions.height / 2,
      width: dimensions.width / 1.2,
    },
    title: {
      fontSize: 30,
      color: '#333',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    inputContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 50,
      fontSize: 20,
      width: dimensions.width / 1.7,
      marginTop: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderRadius: 6,
      padding: 10,
      backgroundColor: '#fff',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: dimensions.width / 1.7,
      backgroundColor: '#333',
      marginTop: 12,
      marginBottom: 12,
      height: 50,
      borderRadius: 6,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });

  return {styles};
};

export default App;
