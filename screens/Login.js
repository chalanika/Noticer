import React, { Component } from "react";
import firebase from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "galio-framework";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { color } from "react-native-reanimated";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };
  componentDidMount() {}

  onLogin() {
    if (this.state.email === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter your email address",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
    if (this.state.password === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter your password",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async (res) => {
        this.props.navigation.navigate("Notices");
      })
      .catch((err) => {
        ToastAndroid.showWithGravityAndOffset(
          err.code === "auth/user-not-found"
            ? "Not a registered email address. Please register first."
            : err.code === "auth/invalid-email"
            ? "Please enter a valid email address"
            : err.code === "auth/wrong-password"
            ? "The email address and password does't match."
            : err.code === "auth/too-many-requests"
            ? "Too many attempts. Please try again later."
            : "Something is wrong! Please try again.",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          300
        );
      });
  }

  render() {
    const { navigation } = this.props;
    return (
      <ImageBackground
        source={require("../assets/bg.jpg")}
        style={styles.image}
      >
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.innerContainer}>
              <View style={[styles.content, { marginTop: 50 }]}>
                <Text>Enter Credentials</Text>
                <Input
                  borderless
                  bgColor="#dbdbdb"
                  color="#2e2e2e"
                  placeholder="Email Address"
                  rounded
                  onChangeText={(text) => {
                    this.setState({ email: text });
                  }}
                />
                <Input
                  borderless
                  bgColor="#dbdbdb"
                  color="#2e2e2e"
                  placeholder="Password"
                  password
                  viewPass
                  rounded
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                />
                <Button
                  round
                  size="small"
                  color="#ce2039"
                  onPress={() => this.onLogin()}
                >
                  Login
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <Login {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    width: "90%",
    height: "90%",
    // alignItems: "center",
    // justifyContent: "space-evenly",
    borderRadius: 20,
    paddingVertical: 20,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  image: {
    // flex: 1,
    width: "100%",
    height: "100%",
    // resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "80%",
    // marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});
