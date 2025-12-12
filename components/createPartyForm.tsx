import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator} from "react-native";
import { useState } from "react";

type SubmitPayload = {
  displayName: string;
  merchant: string;
  subtotal: number;
  tax: number;
  tip: number;
};

type Props = {
  onSubmit: (data: SubmitPayload) => void;
  loading?: boolean;
  error?: string | null;          // <-- THIS fixes it
  initialMerchant?: string;
  initialSubtotal?: string;
  initialTax?: string;
  initialTip?: string;
  initialDisplayName?: string;
};

const CreateSessionForm = ({
    onSubmit,
    loading = false, 
    error = null,
    initialMerchant = "",
    initialSubtotal = "",
    initialTax = "",
    initialTip = "",
    initialDisplayName = "",
}: Props) => {
    const [displayName, setDisplayName] = useState(initialDisplayName);
    const [merchant, setMerchant] = useState(initialMerchant);
    const [subtotal, setSubtotal] = useState(initialSubtotal);
    const [tax, setTax] = useState(initialTax);
    const [tip, setTip] = useState(initialTip);
    const [localError, setLocalError] = useState("");

    const handlePress = () => {
        if (!merchant.trim()){
            setLocalError("Merchant name is required.");
            return;
        }

        if (!displayName.trim()){
            setLocalError("Your display name is required.");
            return;
        }

        setLocalError("");
        onSubmit({
            merchant: merchant.trim(),
            subtotal: parseFloat(subtotal) || 0,
            tax: parseFloat(tax) || 0,
            tip: parseFloat(tip) || 0,
            displayName: displayName.trim(),
        });
    }

  return (
    <View style={{ gap: 12 }}>
      {/* Your name */}
      <View>
        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
          Your name
        </Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Akhil"
          autoCapitalize="words"
          style={styles.nameInput}
        />
      </View>

      {/* Merchant */}
      <View>
        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
          Restaurant / Merchant
        </Text>
        <TextInput
          value={merchant}
          onChangeText={setMerchant}
          placeholder="Chipotle"
          autoCapitalize="words"
          style={styles.merchantInput}
        />
      </View>

      {/* Subtotal */}
      <View>
        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
          Subtotal
        </Text>
        <TextInput
          value={subtotal}
          onChangeText={setSubtotal}
          placeholder="30.00"
          keyboardType="decimal-pad"
          style={styles.subtotalInput}
        />
      </View>

      {/* Tax */}
      <View>
        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
          Tax
        </Text>
        <TextInput
          value={tax}
          onChangeText={setTax}
          placeholder="2.50"
          keyboardType="decimal-pad"
          style={styles.taxInput}
        />
      </View>

      {/* Tip */}
      <View>
        <Text style={{ fontWeight: '500', marginBottom: 4 }}>
          Tip
        </Text>
        <TextInput
          value={tip}
          onChangeText={setTip}
          placeholder="5.00"
          keyboardType="decimal-pad"
          style={styles.tipInput}
        />
      </View>

      {/* Errors */}
      {(localError || error) && (
        <Text style={{ color: 'red' }}>
          {localError || error}
        </Text>
      )}

      {/* Submit button */}
      <Pressable
        onPress={handlePress}
        disabled={loading}
        style={{
          marginTop: 4,
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
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            Create bill
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default CreateSessionForm;

const styles = StyleSheet.create({
  nameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  merchantInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  subtotalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  taxInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tipInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});