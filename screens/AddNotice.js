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

class AddNotice extends Component {
  state = {
    title: "",
    content: "",
    workplaceId: "",
  };
  componentDidMount() {
    const { workplaceId } = this.props.route.params;
    this.setState({ workplaceId });
  }

  onSend = async () => {
    if (this.state.title === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter the notice title",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
    if (this.state.content === "") {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter the notice content",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        300
      );
      return;
    }
    await firebase
      .firestore()
      .collection("workplaces")
      .doc(this.state.workplaceId)
      .update({
        notices: firebase.firestore.FieldValue.arrayUnion({
          title: this.state.title,
          content: this.state.content,
          createdAt: Date.now(),
        }),
      })
      .then((data) => {
        this.props.navigation.push("Notices");
      })
      .catch((err) => {
        ToastAndroid.showWithGravityAndOffset(
          "Something is wrong! Please try again.",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          300
        );
      });
  };

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
                <Input
                  borderless
                  bgColor="#dbdbdb"
                  color="#2e2e2e"
                  placeholder="Title"
                  rounded
                  onChangeText={(text) => {
                    this.setState({ title: text });
                  }}
                />
                <Input
                  borderless
                  bgColor="#dbdbdb"
                  color="#2e2e2e"
                  placeholder="Content"
                  rounded
                  onChangeText={(text) => {
                    this.setState({ content: text });
                  }}
                />
                <Button
                  round
                  size="small"
                  color="#ce2039"
                  onPress={() => this.onSend()}
                >
                  Send
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

  return <AddNotice {...props} navigation={navigation} />;
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
