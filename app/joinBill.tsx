import { View, Text, StyleSheet } from "react-native";

const JoinBill = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>joinBill</Text>
    </View>
  )
}

export default JoinBill;

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
});