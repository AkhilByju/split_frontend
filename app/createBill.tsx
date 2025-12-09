import { View, Text, StyleSheet } from "react-native";

const CreateBill = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>createBill</Text>
    </View>
  )
}

export default CreateBill;

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