import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../config/firebase';
import AdminChat from '../components/AdminChat';

interface User {
    id: string;
    email: string;
    isAdmin: boolean;
}
const AdminChangeUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserEmail, setSelectedUserEmail] = useState<string>();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
    useEffect(() => {
      const getUsers = async () => {
        const usersCollection = collection(FIRESTORE_DB, 'users');
        const usersQuery = query(usersCollection);
        const usersSnapshot = await getDocs(usersQuery);
        const users: User[] = [];
        usersSnapshot.forEach((userDoc) => {
          users.push({ id: userDoc.data().uid, email: userDoc.data().email } as User);
        });
        setUsers(users);
      };
  
      getUsers();
    }, []);
  
    const handleBackClick = () => {
      setSelectedUserId(null);
    };
  
    return (
      <View style={styles.conteiner}>
        {selectedUserId ? (
          <AdminChat userId={selectedUserId} email={selectedUserEmail} onBackClick={handleBackClick} />
        ) : (
          <View style={styles.chooseUserCover} className="border-black">
            <View className="w-full items-center mb-3 bg-grey ">
              <Text className="text-slate-50 text-base" >Выберите пользователя</Text>
            </View>
            {users.map((user) => (
              <Pressable
                key={user.id}
                style={styles.userField}
                className="bg-white border border-black drop-shadow-sm"
                onPress={() => {
                  setSelectedUserId(user.id);
                  setSelectedUserEmail(user.email);
                }}
              >
                <Text>{user.email}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };
  
const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        marginTop: 100,
    },
    chooseUserContainer: {
        marginVertical: 120,
        marginHorizontal: 12,
        backgroundColor: 'red',
    },
    chooseUserCover: {
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    userField: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontSize: 12,
    },
    header: {
        fontFamily: 'Helvetica',
        marginBottom: 10,
    }
});

export default AdminChangeUser;
