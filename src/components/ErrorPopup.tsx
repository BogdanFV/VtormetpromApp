import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const ErrorPopup: React.FC<Props> = ({ visible, onClose, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.title}>Ошибка</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#FF0000',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: '#FF0000',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default ErrorPopup;
