import {StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';

export class MainHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Todos Application </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    marginBottom: 30,
    textAlign: 'center',
    color: 'black',
  },
  container: {
    margin: 5,
    padding: 10,
  },
});

export default MainHeader;
