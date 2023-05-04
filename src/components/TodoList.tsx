import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Todo } from '../screens/AdminHome';
import { FIRESTORE_DB } from '../config/firebase';

interface TodoListProps {
  todos: Todo[];
  onTodoPress: (todo: Todo) => void;
  displayDelete: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onTodoPress, displayDelete }) => {

  const renderTodo = ({ item }: { item: Todo }) => {
    const ref = doc(FIRESTORE_DB, `todos/${item.id}`);
  
    const deleteItem = async () => {
      deleteDoc(ref);
    }
    const openTodoDetails = () => {
      onTodoPress(item);
    }

    return (
      <View style={styles.todoContainer} key={item.id}>
        <TouchableOpacity style={styles.todo} onPress={openTodoDetails}>
          <View style={styles.firstLine}>
            <Text style={styles.todoId}>ID: {item.id}</Text>
            {displayDelete && <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem}/>}
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

  return (
    <View>
      <FlatList
        data={todos}
        renderItem={(item) => renderTodo(item)}
        keyExtractor={(todo: Todo) => todo.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
  })

export default TodoList;
