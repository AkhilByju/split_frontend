import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { joinSession } from '../src/api'

const JoinBill = () => {
  const [code, setCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await joinSession({ code, displayName, isHost: false });

      console.log("Joined session:", result);

      // On success, navigate to the bill screen


    } catch (error) {
      console.log(error);
      setError("An error occurred while joining the bill.");
    } finally {
      setLoading(false);
    }
  };

  return (
<View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
        Join a bill
      </Text>

      <Text>Join code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="AB12CD"
        autoCapitalize="characters"
        style={styles.codeInput}
      />

      <Text>Your name</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Akhil"
        autoCapitalize="words"
        style={styles.nameInput}
      />

      {error && (
        <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
      )}

      <Pressable
        onPress={handleJoin}
        disabled={loading}
        style={{
          borderRadius: 999,
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: loading ? '#999' : '#000',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            Join bill
          </Text>
        )}
      </Pressable>
    </View>
  )
}

export default JoinBill;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",     
      justifyContent: "flex-start", 
      paddingTop: 20,      
      backgroundColor: "#fff",  
    },
    codeInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 12,
    },
    nameInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 12,
    },
});