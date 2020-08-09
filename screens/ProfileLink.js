import React from "react";
import { View } from "react-native";
import { Text } from "galio-framework";
import { useNavigation } from "@react-navigation/native";

export default function ProfileLink({ user }) {
  const navigation = useNavigation();
  return (
    <View styles={{ paddingRight: 10 }}>
      <Text color="#ce2039" onPress={() => navigation.navigate("Profile")}>
        {user.name}
      </Text>
    </View>
  );
}
