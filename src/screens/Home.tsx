import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, Modal, Dimensions } from 'react-native'

// import MapView, { Marker, Polyline } from 'react-native-maps';

import { FIRESTORE_DB } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import AddTodoPopup from '../components/AddTodoPopup';
import TodoList from '../components/TodoList';


export interface Todo {
  distance: string;
  mass: string;
  destination: string;
  date: any;
  price: string;
  source: string;
  title: string;
  id: string;
}

export function AdminHomeScreen() {

  const [todos, setTodos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);


  const coordinates = [
    { latitude: 56.8389, longitude: 60.6057 }, // Начальная точка маршрута
    { latitude: 58.0104, longitude: 56.2343 },   // Конечная точка маршрута
  ];

  const [markerCoordinates, setMarkerCoordinates] = useState(coordinates);
  const [polylineCoordinates, setPolylineCoordinates] = useState(coordinates);

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, 'todos');
    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {

        const todos: any[] = [];
        snapshot.docs.forEach(doc => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
        });
        setTodos(todos);
      }
    });
    return () => subscriber();
  }, []);



  const TodoDetailsModal = ({ visible, onClose, todo }: any) => {
    if (!todo) {
      return null;
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>ID: {todo.id}</Text>
            <Text>Title: {todo.title}</Text>
            <Text>Price: {parseInt(todo.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
            <Text>Source: {todo.source}</Text>
            <Text>Destination: {todo.destination}</Text>
            <Text>Date: {new Date(todo.date.seconds * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'long' })}</Text>
            <Text>Distance: {todo.distance} km</Text>
            <Text>Mass: {todo.mass} t</Text>
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View className="w-full h-full">
      <AddTodoPopup visible={modalVisible} onClose={() => setModalVisible(false)} />
      <TodoDetailsModal visible={selectedTodo !== null} onClose={() => setSelectedTodo(null)} todo={selectedTodo} />
      <View style={styles.container}>
        {todos.length > 0 && (
          <TodoList displayDelete={true} todos={todos} onTodoPress={(todo: Todo) => setSelectedTodo(todo)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#636363',
    height: '100%',
  },
  form: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#636363',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    fontFamily: 'Gotu-Regular',
  },
  test: {
    height: Dimensions.get('window').height / 2,
  }
})