import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, Modal, Dimensions, Pressable } from 'react-native'

import MapView, { Marker, Polyline } from 'react-native-maps';

import { FIRESTORE_DB } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import AddTodoPopup from '../components/AddTodoPopup';
import TodoList from '../components/TodoList';

import Ionicons from '@expo/vector-icons/Ionicons';

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [titleSort, setTitleSort] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [sourceSort, setSourceSort] = useState('');
  const [destinationSort, setDestinationSort] = useState('');
  const [dateSort, setDateSort] = useState('');
  const [distanceSort, setDistanceSort] = useState('');
  const [massSort, setMassSort] = useState('');

  const [selectedSort, setSelectedSort] = useState('');

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

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  async function filterFunction(callback: any, option: string) {
    try {
      await setSelectedSort(option);
    } catch (error) {
      console.error(error);
    } finally {
      return () => callback(option);
    }
  }

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     console.log('selectedSort: ' + selectedSort);
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [selectedSort]);

  const FilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalContent}>
            <Text style={styles.filterModalTitle}>Выберите фильтр</Text>
            <Button title="Title" onPress={() => filterFunction(() => setTitleSort('title'), 'title')} />
            <Button title="Price" onPress={() => filterFunction(() => setPriceSort('price'), 'price')} />
            <Button title="Source" onPress={() => filterFunction(() => setSourceSort('source'), 'source')} />
            <Button title="Destination" onPress={() => filterFunction(() => setDestinationSort('destination'), 'destination')} />
            <Button title="Date" onPress={() => filterFunction(() => setDateSort('date'), 'date')} />
            <Button title="Distance" onPress={() => filterFunction(() => setDistanceSort('distance'), 'distance')} />
            <Button title="Mass" onPress={() => filterFunction(() => setMassSort('mass'), 'mass')} />
            <View style={styles.closeFilters}>
              <Button title="Закрыть" onPress={() => setFilterModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
            <Text style={styles.modalId}>ID: {todo.id}</Text>
            <Text>Title: {todo.title}</Text>
            <Text>Price: {parseInt(todo.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
            <Text>Source: {todo.source}</Text>
            <Text>Destination: {todo.destination}</Text>
            <Text>Date: {new Date(todo.date.seconds * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'long' })}</Text>
            <Text>Distance: {todo.distance} km</Text>
            <Text>Mass: {todo.mass} t</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 56.751244,
                longitude: 47.618423,
                latitudeDelta: 20,
                longitudeDelta: 20,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 59.9390,
                  longitude: 30.3158,
                }}
                title="Санкт-Петербург"
              />
              <Marker
                coordinate={{
                  latitude: 54.9849,
                  longitude: 73.3670,
                }}
                title="Омск"
              />
            </MapView>
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
      <FilterModal />
      <View style={styles.container}>
        <View style={styles.form}>
          <Button onPress={addTodo} title='Добавить +' color="#383838" />
        </View>
        <Pressable onPress={openFilterModal} style={styles.filterContainer}>
          <Text style={styles.filterText}>Применить фильтр</Text>
          <Ionicons name="filter-outline" size={24} color="white" />
        </Pressable>
        {todos.length > 0 && (
          <TodoList displayDelete={true} filter={selectedSort} todos={todos} onTodoPress={(todo: Todo) => setSelectedTodo(todo)} />
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
    marginTop: 20,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    height: 40,
    backgroundColor: '#838383',
    marginTop: 20,
    marginBottom: 20,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  filterText: {
    color: 'white',
  },
  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    width: Dimensions.get('window').width * 0.7,
  },
  closeFilters: {
    marginTop: 10,
  },
  map: {
    marginVertical: 50,
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width * 0.9,
  },
  modalId: {
    color: 'grey',
  }
})