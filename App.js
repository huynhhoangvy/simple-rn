/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

<script src="http://localhost:8097"></script>
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home';
import Main from './components/Main';
import FlashSaleList from './components/FlashSaleList';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen component={Main} name='Main' />
                <Stack.Screen name='Home'>
                    {props => <Home {...props} extraData={'some data'} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}



export default App;
