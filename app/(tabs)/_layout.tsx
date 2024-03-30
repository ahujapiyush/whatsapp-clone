import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs></Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
