// In App.js in a new project

import React, { Component } from "react";
import firebase from "./firebase";
import {
  View,
  YellowBox,
  ImageBackground,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import AddWorkplace from "./screens/AddWorkplace";
import Notices from "./screens/Notices";
import { Button, Text, Input } from "galio-framework";
import Login from "./screens/Login";
import ProfileLink from "./screens/ProfileLink";
import Profile from "./screens/Profile";
import Join from "./screens/Join";
import AddNotice from "./screens/AddNotice";

const Stack = createStackNavigator();

class App extends Component {
  state = {
    user: {},
  };
  componentDidMount() {
    YellowBox.ignoreWarnings(["Setting a timer"]);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("firebase", user.uid);
        this.getUser(user?.uid);
      }
    });
  }

  async checkUser() {
    const value = await AsyncStorage.getItem("uid");
    if (value !== null) {
      return true;
    } else {
      return false;
    }
  }

  getUser(uid) {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const user = snapshot.data();
          user.id = snapshot.id;
          this.setState({ user });
        }
      });
  }

  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={false ? "Notices" : "Home"}
          >
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Add Workplace" component={AddWorkplace} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen
              name="Profile"
              component={this.state.user ? Profile : Home}
            />
            <Stack.Screen name="Join" component={Join} />

            <Stack.Screen
              name="Notices"
              component={this.state.user ? Notices : Home}
              options={{
                headerLeft: null,
                headerRight: () => <ProfileLink user={this.state.user} />,
                headerRightContainerStyle: {
                  paddingRight: 15,
                },
              }}
            />
            <Stack.Screen
              name="Add Notice"
              component={this.state.user.type === "admin" ? AddNotice : Home}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    // flex: 1,
    width: "100%",
    height: "100%",
    // resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
