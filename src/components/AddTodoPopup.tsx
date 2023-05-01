import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { cities } from '../../assets/cities/cities';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FIRESTORE_DB } from '../config/firebase';

interface Props {
    visible: boolean,
    onClose: () => void,
}

const AddTodoPopup: React.FC<Props> = ({ visible, onClose }) => {

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [number, setNumber] = useState('');
    const [mass, setMass] = useState('');
    const [distance, setDistance] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState(new Date());

    const [showSourcePicker, setSourcePicker] = useState(false);
    const [showDestinationPicker, setDestinationPicker] = useState(false);

    const handlePriceChange = (text: string) => {
        const formattedText = text.replace(/[^0-9.,]/g, '');
        setPrice(formattedText);
    }

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setDate(selectedDate || date);
    };


    const toggleSourcePicker = () => {
        setDestinationPicker(false);
        setSourcePicker(!showSourcePicker);
    };

    const toggleDestinationPicker = () => {
        setSourcePicker(false);
        setDestinationPicker(!showDestinationPicker);
    };


    const onSourceCityChange = (city: string) => {
        setSource(city);
        toggleSourcePicker();
    };

    const onDestinationCityChange = (city: string) => {
        setDestination(city);
        toggleDestinationPicker();
    };


    const addTodo = async () => {
        const doc = await addDoc(collection(FIRESTORE_DB, 'todos'),
            {
                done: false,
                title,
                number,
                price,
                mass,
                distance,
                source,
                destination,
                date,
            }
        );
        const closeModal = () => {
            setTitle('');
            setPrice('');
            setNumber('');
            setMass('');
            setDistance('');
            setSource('');
            setDestination('');
            setDate(date);
            onClose();
        };
        closeModal();

    };
    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Название</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Название"
                            placeholderTextColor="#BBB"
                            onChangeText={(text: string) => setTitle(text)}
                            value={title}
                        />
                        <Text style={styles.label}>Цена</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Цена"
                            placeholderTextColor="#BBB"
                            onChangeText={handlePriceChange}
                            keyboardType="numeric"
                            value={price}
                        />
                        <Text style={styles.label}>Масса</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Масса"
                            placeholderTextColor="#BBB"
                            onChangeText={(mass: string) => setMass(mass)}
                            value={mass}
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Расстояние</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Расстояние"
                            placeholderTextColor="#BBB"
                            onChangeText={(distance: string) => setDistance(distance)}
                            value={distance}
                            keyboardType="numeric"
                        />
                        <View style={styles.cityCover}>
                            <Text style={styles.label}>Отбытие:</Text>
                            <TouchableOpacity style={styles.pickerButton} onPress={toggleSourcePicker}>
                                <Text style={styles.selectedCity}>{source || 'Выберите город'}</Text>
                            </TouchableOpacity>
                            {showSourcePicker && (
                                <Picker
                                    style={styles.picker}
                                    selectedValue={source}
                                    onValueChange={onSourceCityChange}
                                >
                                    {cities.map((city) => (
                                        <Picker.Item key={city.value} label={city.label} value={city.value} />
                                    ))}
                                </Picker>
                            )}
                        </View>
                        <View style={styles.cityCover}>
                            <Text style={styles.label}>Прибытие:</Text>
                            <TouchableOpacity style={styles.pickerButton} onPress={toggleDestinationPicker}>
                                <Text style={styles.selectedCity}>{destination || 'Выберите город'}</Text>
                            </TouchableOpacity>
                            {showDestinationPicker && (
                                <Picker
                                    style={styles.picker}
                                    selectedValue={destination}
                                    onValueChange={onDestinationCityChange}
                                >
                                    {cities.map((city) => (
                                        <Picker.Item key={city.value} label={city.label} value={city.value} />
                                    ))}
                                </Picker>
                            )}
                        </View>

                        <View style={styles.dateCover}>
                            <Text style={styles.label}>Дата отгрузки: </Text>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDate}
                                style={styles.timePicker}
                            />
                        </View>
                        <View style={styles.buttonBlock}>
                            <Pressable
                                style={[styles.buttonCover, (title === '' || price === '' || mass === '' || distance === '') && styles.disabledButton]}
                                onPress={addTodo}
                                disabled={title === '' || price === '' || mass === '' || distance === ''}
                            >
                                <Text style={styles.buttonText}>Добавить</Text>
                            </Pressable>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#F13" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        borderWidth: 1,
        backgroundColor: '#999999',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: 300,
    },
    input: {
        borderWidth: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        marginBottom: 5,
        height: 40,
        color: 'black',
        zIndex: 0,
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 10,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
    },
    label: {
        fontSize: 12,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonBlock: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCover: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40,
        backgroundColor: '#FFF',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    buttonText: {
        fontFamily: 'Helvetica',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.3,
    },
    cityCover: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    pickerButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 2,
        paddingVertical: 2,
        height: 25,
        marginLeft: 5,
    },
    picker: {
        position: 'absolute',
        top: -220,
        left: 50,
        backgroundColor: '#ddd',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: 200,
    },
    selectedCity: {
        fontSize: 16,
    },
    dateCover: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timePicker: {
        height: 50,
        width: 100,
    }
});

export default AddTodoPopup;