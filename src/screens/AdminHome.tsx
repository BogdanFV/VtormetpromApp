import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native'
import { FIRESTORE_DB } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';
import AddTodoPopup from '../components/AddTodoPopup';

export interface Todo {
  id: string;
}

export default function AdminHomeScreen() {

  const [todos, setTodos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

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

    const toggleDone = async () => {
      updateDoc(ref, { done: !item.done });
    }

    const deleteItem = async () => {
      deleteDoc(ref);
    }

    const testFunc = async () => {
      console.log('test: ', item.price, item.title);
    }

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity style={styles.todo} onPress={testFunc}>
          {item.done && <Ionicons name="md-checkmark-circle" size={32} color="green" />}
          {!item.done && <Entypo name="circle" size={32} color="black" />}
          <Text style={styles.todoText}>{item.title}</Text>
          <Text style={styles.todoText}>{parseInt(item.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
        </TouchableOpacity>
        <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
      </View>
    );
  };

  return (
    <View className="w-full h-full">
      <AddTodoPopup visible={modalVisible} onClose={() => setModalVisible(false)} />
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
    backgroundColor: '#838383',
    height: '100%',
  },
  form: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 4,
  },
  todo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
})