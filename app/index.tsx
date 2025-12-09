import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
// import { useState } from "react";
// import axios from "axios";
// import Constants from 'expo-constants';

// const apiURL = Constants.expoConfig?.extra?.apiURL || "";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text className="text-4xl font-bold text-center" style={styles.title}>
        Split
      </Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
            <Link href="/joinBill" style={styles.button}>Join Bill</Link>
        </View>

        <View style={styles.buttonWrapper}>
            <Link href="/createBill" style={styles.button}>Create Bill</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",     
    justifyContent: "flex-start", 
    paddingTop: 100,      
    backgroundColor: "#fff",  
  },
  title: {
    marginBottom: 40,
    fontSize: 32, 
  },
  buttonRow: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
