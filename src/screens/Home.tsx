import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { FIRESTORE_DB } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';

export interface Todo {
  titler: string;
  done: boolean;
  id: string;
}

export default function HomeScreen() {

  const [todos, setTodos] = useState<any[]>([]);
  const [todo, setTodo] = useState('');
  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, 'todos');
    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        console.log('UPDATED');

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
    const doc = await addDoc(collection(FIRESTORE_DB, 'todos'), { title: todo, done: false });
    setTodo('');
  };

  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

    const toggleDone = async () => {
      updateDoc(ref, { done: !item.done });
    }

    const deleteItem = async () => {
      deleteDoc(ref);
    }

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done && <Ionicons name="md-checkmark-circle" size={32} color="green" />}
          {!item.done && <Entypo name="circle" size={32} color="black" />}

          <Text style={styles.todoText}>{item.title}</Text>
        </TouchableOpacity>
        <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
      </View>
    );
  };

  return (
    <View className="w-full h-full">
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder='Add new todo' onChangeText={(text: string) => setTodo(text)} value={todo}></TextInput>
          <Button onPress={addTodo} title='Добавить' disabled={todo === ''} color="#000000" />
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