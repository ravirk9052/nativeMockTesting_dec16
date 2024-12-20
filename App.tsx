import { SafeAreaView, Text, View } from 'react-native'
import React, { Component } from 'react'
import MainHeader from './src/Screens/MainHeader'
import TodoApp from './src/Screens/TodoApp'

export class App extends Component {
  render() {
    return (
      <SafeAreaView>
          <MainHeader />
          <TodoApp />
      </SafeAreaView>
    )
  }
}

export default App