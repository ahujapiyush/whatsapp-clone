import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Linking,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaskInput from "react-native-mask-input";
import {
  isClerkAPIResponseError,
  useAuth,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";

function Page() {
  const { signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0;

  const openLink = () => {
    Linking.openURL("https://web.whatsapp.com");
  };
  const sendOTP = async () => {
    if (!isSignedIn) {
      setLoading(true);
      try {
        await signUp!.create({
          phoneNumber,
        });
        signUp!.preparePhoneNumberVerification();
        router.push(`/verify/${phoneNumber}`);
      } catch (err) {
        console.log(err);
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code == "form_identifier_exists") {
            console.log("user exists");
            await trySignIn();
          } else {
            setLoading(false);
            Alert.alert("Error", err.errors[0].message);
          }
        }
      }
    } else {
      console.log("check sendOTP on otp.tsx");
    }
  };
  const trySignIn = async () => {
    const { supportedFirstFactors } = await signIn!.create({
      identifier: phoneNumber,
    });
    const firstPhoneFactor: any = supportedFirstFactors.find((factor: any) => {
      return factor.strategy === "phone_code";
    });
    const { phoneNumberId } = firstPhoneFactor;
    await signIn!.prepareFirstFactor({
      strategy: "phone_code",
      phoneNumberId,
    });

    router.push(`/verify/${phoneNumber}?signin=true`);
    setLoading(false);
  };
  const { bottom } = useSafeAreaInsets();

  const IND_Mask = [
    "+",
    "9",
    "1",
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.green} />
            <Text style={{ marginTop: 10, fontSize: 18 }}>
              Sending code ...
            </Text>
          </View>
        )}
        <Text style={styles.description}>
          WhatsApp will need to verify your account. Carrier charges may apply.
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>INDIA</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </View>
          <View style={styles.separator} />
          <MaskInput
            value={phoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            autoFocus
            placeholder="+91 Your Phone Number"
            onChangeText={(masked, unmasked) => {
              setPhoneNumber(masked); // you can use the unmasked value as well

              // assuming you typed "9" all the way:
              console.log(masked); // (99) 99999-9999
              console.log(unmasked); // 99999999999
            }}
            mask={IND_Mask}
          />
        </View>
        <Text>
          You must be{" "}
          <Text style={styles.link} onPress={openLink}>
            at least 16 year old
          </Text>{" "}
          to register. Learn how Whatsapp works with the{" "}
          <Text>Meta Companies</Text>{" "}
        </Text>

        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            phoneNumber?.length > 9 && styles.enabled,
            { marginBottom: bottom },
          ]}
          onPress={sendOTP}
        >
          <Text
            style={[
              styles.buttonText,
              phoneNumber?.length > 9 && styles.enabled,
            ]}
          >
            {" "}
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
    gap: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
  },
  list: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 18,
    color: Colors.primary,
  },
  separator: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
    opacity: 0.3,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  buttonText: {
    color: Colors.gray,
    fontSize: 22,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
    padding: 6,
    marginTop: 10,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Page;
