import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native'
import { FIRESTORE_DB } from '../config/firebase';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';

import AddTodoPopup from '../components/AddTodoPopup';

export interface Todo {
  distance: String;
  mass: String;
  destination: String;
  date: any;
  price: string;
  source: String;
  title: String;
  id: string;
}

export default function AdminHomeScreen() {

  const [todos, setTodos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

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


  const addTodo = async () => {
    setModalVisible(true);
  };

  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

    const deleteItem = async () => {
      deleteDoc(ref);
    }
    const openTodoDetails = () => {
      setSelectedTodo(item);
    }

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity style={styles.todo} onPress={openTodoDetails}>
          {/* {item.done && <Ionicons name="md-checkmark-circle" size={32} color="green" />}
          {!item.done && <Entypo name="circle" size={32} color="black" />} */}
          <View style={styles.firstLine}>
            <Text style={styles.todoId}>ID: {item.id}</Text>
            <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
          </View>
          <Text style={styles.todoTitle}>{item.title}</Text>
          <Text style={styles.todoPrice}>{parseInt(item.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
          <View style={styles.todoCities}>
            <Text style={styles.todoSource}>{item.source}</Text>
            <View style={styles.arrowCover} >
              <Ionicons name="arrow-forward-outline" size={24} color="red" />
            </View>
            <Text style={styles.todoDestination}>{item.destination}</Text>
          </View>
          <View style={styles.optionsCover}>
            <Text style={styles.optionsText}>Погрузка</Text>
            <Text>{new Date(item.date.seconds * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'long' })}</Text>
          </View>
          <View style={styles.optionsCover}>
            <Text style={styles.optionsText}>Расстояние</Text>
            <Text>{item.distance} км</Text>
          </View>
          <View style={styles.optionsCover}>
            <Text style={styles.optionsText}>Объем</Text>
            <Text>{item.mass} т</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
        <View style={styles.form}>
          <Button onPress={addTodo} title='Добавить +' color="#000000" />
        </View>
        {todos.length > 0 && (
          <View>
            <FlatList
              data={todos}
              renderItem={(item) => renderTodo(item)}
              keyExtractor={(todo: Todo) => todo.id}
            />
          </View>
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
  todoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
  },
  todo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  firstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  todoId: {
    flex: 1,
  },
  todoTitle: {
    flex: 1,
    fontSize: 16,
  },
  todoPrice: {
    fontSize: 25,
    marginVertical: 10,
  },
  todoCities: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  todoSource: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Verdana',
  },
  todoDestination: {
    fontSize: 15,
    fontFamily: 'Verdana',
  },
  arrowCover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsCover: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionsText: {
    fontSize: 13,
    flex: 1,
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
  }
})