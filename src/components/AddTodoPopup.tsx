import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
    const [destination, setDestination] = useState('');
    const [source, setSource] = useState('');
    const [date, setDate] = useState('');

    const addTodo = async () => {
        console.log(visible);
        const doc = await addDoc(collection(FIRESTORE_DB, 'todos'),
            {
                title,
                done: false,
                number,
                price,
                mass,
                distance,
                destination,
                source,
                date,
            }
        );
        const closeModal = () => {
            setTitle('');
            setPrice('');
            setNumber('');
            setMass('');
            setDistance('');
            setDestination('');
            setSource('');
            setDate('');
            onClose();
        };
        closeModal();
        
    };
    return (
        <Modal visible={visible} style={styles.test} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Название"
                            onChangeText={(text: string) => setTitle(text)}
                            value={title}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Цена"
                            onChangeText={(price: string) => setPrice(price)}
                            value={price}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Номер"
                            onChangeText={(number: string) => setNumber(number)}
                            value={number}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Масса"
                            onChangeText={(mass: string) => setMass(mass)}
                            value={mass}
                        />
                        <Button
                            onPress={addTodo}
                            title="Добавить"
                            disabled={title === '' && price === ''}
                            color='red'
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>x</Text>
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
        backgroundColor: '#A8A8A8',
        height: 200,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: 300,
    },
    input: {
        backgroundColor: '#777777',
        paddingLeft: 10,
        height: 40,
        marginTop: 10,
        color: 'white',
    },
    test: {
        width: 200,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    }
});

export default AddTodoPopup;