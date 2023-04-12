import React from 'react';
import {ScrollView, StyleSheet, useWindowDimensions} from 'react-native';

import Layout from './components/Layout';
import LoginForm from './components/LoginForm';

const App = () => {
  const {styles} = useStyle();

  const handleSubmit = (username: string, password: string) => {
    console.log(
      `Submitting login form with username: ${username} and password: ${password}`,
    );
  };

  return (
    <Layout>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <LoginForm onSubmit={handleSubmit} />
      </ScrollView>
    </Layout>
  );
};

const useStyle = () => {
  const dimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#171717',
      height: dimensions.height,
      width: dimensions.width,
      paddingTop: '45%',
      paddingBottom: '45%',
    },
  });

  return {styles};
};

export default App;
