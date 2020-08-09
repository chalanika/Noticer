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

class AddWorkplace extends Component {
  state = {
    workplaceName: "",
    name: "",
    email: "",
    password: "",
    // workplaceId: "",
    ref: "",
  };
  componentDidMount() {
    do {
      this.setRef();
    } while (this.checkForSimillarRef());
  }

  checkForSimillarRef() {
    firebase
      .firestore()
      .collection("workplaces")
      .where("ref", "==", this.state.ref)
      .get()
      .then((snapshot) => {
        if (snapshot.size == 0) {
          return false;
        }
        return true;
      });
  }

  setRef() {
    const ref = "WP" + Math.random().toString(36).substring(2, 8).toUpperCase();
    this.setState({ ref });
  }

  onCreate = async () => {
    if (this.state.workplaceName === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter the workplace name",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
    if (this.state.name === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter your full name",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
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
        "Please enter a password",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
    this.createWorkplace();
  };

  createWorkplace() {
    firebase
      .firestore()
      .collection("workplaces")
      .add({
        workplaceName: this.state.workplaceName,
        ref: this.state.ref,
        notices: [],
      })
      .then((data) => {
        this.createAdmin(data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createAdmin(workplaceId) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(async (userData) => {
        if (userData) {
          let userRef = await firebase
            .firestore()
            .collection("users")
            .doc(userData.user.uid);
          userRef.set({
            name: this.state.name,
            email: this.state.email,
            type: "admin",
            workplaceId: workplaceId,
          });
          this.props.navigation.navigate("Notices");
        }
      })
      .catch((err) => {
        ToastAndroid.showWithGravityAndOffset(
          err.code === "auth/email-already-in-use"
            ? "Email already in use."
            : err.code === "auth/invalid-email"
            ? "The email address is invalid"
            : err.code === "auth/weak-password"
            ? "Password must contain at least 6 charactors"
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
              <View style={styles.content}>
                <Text>Workplace</Text>
                <Input
                  borderless
                  bgColor="#dbdbdb"
                  color="#2e2e2e"
                  placeholder="Workplace Name"
                  rounded
                  onChangeText={(text) => {
                    this.setState({ workplaceName: text });
                  }}
                />
              </View>
              <View style={[styles.content, { marginTop: 50 }]}>
                <Text>Admin</Text>
                <Input
                  borderless
                  bgColor="#dbdbdb"
                  color="#2e2e2e"
                  placeholder="Full Name"
                  rounded
                  onChangeText={(text) => {
                    this.setState({ name: text });
                  }}
                />
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
                  rounded
                  password
                  viewPass
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                />
                <Button
                  round
                  size="small"
                  color="#ce2039"
                  onPress={() => this.onCreate()}
                >
                  Create
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

  return <AddWorkplace {...props} navigation={navigation} />;
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
    marginTop: 40,
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
