import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import messagesData from "@/assets/data/messages.json";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import ChatMessageBox from "@/components/ChatMessageBox";
import ReplyMessageBar from "@/components/ReplyMessageBar";

const Page = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const swipeableRowRef = useRef<Swipeable | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      )
        swipeableRowRef.current = ref;
    },
    [replyMessage]
  );

  useEffect(() => {
    setMessages([
      ...messagesData.map((message) => {
        return {
          _id: message.id,
          text: message.msg,
          createdAt: new Date(message.date),
          user: {
            _id: message.from,
            name: message.from ? "You" : "Bob",
          },
        };
      }),
      {
        _id: "0",
        system: true,
        text: "Chat is protected by us",
        createdAt: new Date(),
        user: {
          _id: "0",
          name: "Bot",
        },
      },
    ]);
  }, []);
  const onSend = useCallback((messages: IMessage[]) => {
    setReplyMessage(null);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);
  return (
    <ImageBackground
      source={require("@/assets/images/pattern.png")}
      style={{
        flex: 1,
        marginBottom: insets.bottom,
        backgroundColor: Colors.background,
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        onInputTextChanged={setText}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: "#000",
                },
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.lightGreen,
                },
              }}
            />
          );
        }}
        renderSend={(props) => (
          <View style={style.sendIcons}>
            {text.length > 0 && (
              <Send {...props} containerStyle={{ justifyContent: "center" }}>
                <Ionicons name="send" color={Colors.primary} size={28} />
              </Send>
            )}
            {text.length === 0 && (
              <>
                <Ionicons
                  name="camera-outline"
                  color={Colors.primary}
                  size={28}
                />
                <Ionicons name="mic-outline" color={Colors.primary} size={28} />
              </>
            )}
          </View>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{ backgroundColor: Colors.background }}
            renderActions={() => (
              <View
                style={{
                  height: 44,
                  justifyContent: "center",
                  alignItems: "center",
                  left: 6,
                }}
              >
                <Ionicons name="add" color={Colors.primary} size={28} />
              </View>
            )}
          ></InputToolbar>
        )}
        textInputProps={style.composer}
        renderMessage={(props) => (
          <ChatMessageBox
            {...props}
            updateRowRef={updateRowRef}
            setReplyOnSwipeOpen={setReplyMessage}
          />
        )}
        renderFooter={() => (
          <ReplyMessageBar
            clearReply={() => setReplyMessage(null)}
            message={replyMessage}
          />
        )}
      />
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  composer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    fontSize: 16,
    marginVertical: 4,
    paddingTop: 8,
  },
  sendIcons: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 14,
  },
});
export default Page;
