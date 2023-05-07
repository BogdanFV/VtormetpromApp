import React, { useState } from "react";
import VtormetpromLogo from '../../assets/vtormeprom_logo';
import {
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import ErrorPopup from "../components/ErrorPopup";
import { addDoc, collection } from "firebase/firestore";
import { FIRESTORE_DB } from "../config/firebase";

const auth = getAuth();

function SignUpScreen<StackScreenProps>({ navigation }: any) {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  const [errorVisible, setErrorVisible] = useState(false);

  async function handleRegister() {
    if (!value.email || !value.password) {
      console.log('Введите email и пароль');
      return;
    }
    try {
      const authResult = await createUserWithEmailAndPassword(auth, value.email, value.password);
      const userDocRef = await addDoc(collection(FIRESTORE_DB, "users"), {
        uid: authResult.user.uid,
        email: authResult.user.email,
        isAdmin: false,
        name: '',
        messages: '',
      });
      console.log("User document created with ID: ", userDocRef.id);
    } catch (error: any) {
      throw new Error("Something went wrong");
    }
  }

  
  const dimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 350,
    },
    icon: {
      padding: 10,
      backgroundColor: 'red',
    },
    input: {
      backgroundColor: '#fff',
      height: 48,
      borderColor: '#ccc',
      borderWidth: 3,
      borderRadius: 5,
      paddingHorizontal: 16,
      marginTop: 16,
      fontSize: 18,
    },
    href: {
      textDecorationLine: "underline",
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
    buttonCover: {
      width: dimensions.width * 0.8,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputCover: {
      height: dimensions.height * 0.4,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

  return (
    <View className="w-full h-full">
      <LinearGradient colors={['#535353', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#535353']} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="mx-4 h-5/6 flex justify-center align-center space-y-6" style={styles.inputCover}>
            <VtormetpromLogo />
            <View className="space-y-6">
              <TextInput
                placeholder="Телефон или адрес эл. почты"
                value={value.email}
                style={styles.input}
                onChangeText={(text) => setValue({ ...value, email: text })}
              />
              <TextInput
                placeholder="Введите пароль"
                value={value.password}
                style={styles.input}
                onChangeText={(text) => setValue({ ...value, password: text })}
                secureTextEntry={true}
              />
              <Pressable className="bg-background border border-white rounded-3xl py-2 px-4 m-4" style={styles.buttonCover}>
                <Text onPress={handleRegister} style={styles.buttonText}>
                  Регистрация
                </Text>
              </Pressable>
              <ErrorPopup visible={errorVisible} onClose={() => setErrorVisible(false)} message={"Необходимо ввести данные"} />
            </View>
            <Text >
              Есть аккаунт?{" "}
              <Text style={styles.href} onPress={() => navigation.navigate("Sign In")}>
                Войти
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </View>
  );
}

export default SignUpScreen;


