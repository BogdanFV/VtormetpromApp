import React from "react";
import { Modal, TouchableOpacity, Text, Pressable, StyleSheet, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";

const auth = getAuth();

function Settings() {
  const [modalVisible, setModalVisible] = React.useState(false);

  const styles = StyleSheet.create({
    exit: {
      marginLeft: 10,
      fontSize: 20,
      color: '#FFFFFF',
    },
    flex: {
      alignItems: 'center',
    }
  });

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <Feather name="menu" color="gray" size={24} />
      </Pressable>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="h-[30%] mt-auto border rounded-t-3xl ">
            <LinearGradient
              colors={['#535353', '#FFFFFF', '#535353']}
              style={{ flex: 1, borderRadius: 20 }}
            >
              <Pressable onPress={() => signOut(auth)}>
                <View style={styles.flex} className="flex flex-row m-4 center">
                  <Feather  name="log-out" color="white" size={20}/>
                  <Text style={styles.exit}>Выйти</Text>
                </View>
              </Pressable>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default Settings;
