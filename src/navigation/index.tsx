import React from 'react';
import { useAuth } from '../hooks/useAuth';
import UserStack from './userStack';
import AuthStack from './authStack';
import AdminStack from './adminStack';

export default function RootNavigation() {
  const { user } = useAuth();
  const isAdmin = user?.uid === 'hXjxbO7ANndyuFdB7iVWWaMCDW43';

  if(user) {
    if(isAdmin){
      return <AdminStack />
    } else {
      return <UserStack />
    }
  } else {
    return <AuthStack />
  }
}
