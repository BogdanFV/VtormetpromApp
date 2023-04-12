import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

interface Props {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm = ({onSubmit}: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = () => {
    onSubmit(username, password);
    setUsername('');
    setPassword('');
  };
  const dimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: dimensions.width / 1.2,
      height: dimensions.height / 2.5,
      borderRadius: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 46,
    },
    inputContainer: {
      width: '80%',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      height: 48,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 6,
      paddingLeft: 16,
      paddingRight: 16,
      marginBottom: 16,
      fontSize: 18,
    },
    button: {
      width: '100%',
      height: 48,
      backgroundColor: '#131313',
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войдите, чтобы начать</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={handleUsernameChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
