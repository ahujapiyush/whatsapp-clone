import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
        }}
      >
        <Tabs.Screen
          name="updates"
          options={{
            title: "Updates",
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="update" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calls"
          options={{
            title: "Calls",
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="phone-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: "Communities",
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="chatbubbles" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
