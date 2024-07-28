import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import contacts from "@/assets/data/contacts.json";
import { AlphabetList } from "react-native-section-alphabet-list";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const Page = () => {
  const data = contacts.map((contact, index) => ({
    value: `${contact.first_name} ${contact.last_name}`,
    name: `${contact.first_name} ${contact.last_name}`,
    img: contact.img,
    desc: contact.desc,
    key: `${contact.first_name} ${contact.last_name}-${index}`,
  }));
  return (
    <View style={{ paddingTop: 110, backgroundColor: Colors.background }}>
      <AlphabetList
        data={data}
        stickySectionHeadersEnabled
        indexLetterStyle={{
          color: Colors.primary,
          fontSize: 12,
          fontWeight: "bold",
        }}
        indexContainerStyle={{
          width: 24,
          backgroundColor: Colors.background,
        }}
        style={{ marginLeft: 14 }}
        renderCustomSectionHeader={(section) => (
          <View style={styles.sectionHeaderContainer}>
            <Text>{section.title}</Text>
          </View>
        )}
        renderCustomItem={(item: any) => (
          <>
            <View style={styles.listItemContainer}>
              <Image
                source={{ uri: item.img }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
              <View>
                <Text style={{ color: "#000", fontSize: 14 }}>{item.name}</Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {item.desc.length > 40
                    ? item.desc.substring(0, 40) + "..."
                    : item.desc}
                </Text>
              </View>
            </View>
            <View style={[defaultStyles.separator, { marginLeft: 64 }]} />
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 6,
  },
  sectionHeaderContainer: {
    height: 30,
    backgroundColor: Colors.background,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});

export default Page;
