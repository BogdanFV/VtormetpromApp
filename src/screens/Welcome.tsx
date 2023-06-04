import React from 'react';
import { Text, Pressable, StyleSheet, Image, View, useWindowDimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import VtormetpromLogo from '../../assets/vtormeprom_logo';

function WelcomeScreen<StackScreenProps>({ navigation }: any) {

  const dimensions = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      height: dimensions.height * 0.4,
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      minHeight: 350,
    },
    buttonCover: {
      width: dimensions.width * 0.8,
    },
    button: {
      height: 48,
      backgroundColor: '#111111',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    logoCover: {
      height: 96,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    logoName: {
      marginLeft: 10,
      fontSize: 28,
    }
  });


  return (
    <View className="w-full h-full">
      <LinearGradient colors={['#535353', '#BBBBBB', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#BBBBBB', '#535353']} style={styles.container}>
        <View style={styles.logoCover}>
          <VtormetpromLogo />
          <Text style={styles.logoName}>ИНТЕРЛОГИСТИКА</Text>
        </View>
        <View className="flex justify-center align-center">
          <View style={styles.buttonCover}>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Sign In')} className="bg-white rounded-3xl py-2 px-4 m-4" >
              <Text style={styles.buttonText}>Войти</Text>
            </Pressable>
            <Pressable style={styles.button} className="bg-white rounded-3xl py-2 px-4 m-4" >
              <Text style={styles.buttonText} onPress={() => navigation.navigate('Sign Up')}>Регистрация</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default WelcomeScreen;





