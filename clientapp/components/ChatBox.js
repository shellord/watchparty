import React, { useState, useRef } from 'react'
import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native'

const ChatBox = ({ messages, onSend }) => {
  const [msg, setmsg] = useState()
  const scrollViewRef = useRef()
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageView}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => (
          <Text key={index} style={styles.messageText}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.textBoxView}>
        <TextInput
          placeholder="message"
          style={styles.messageBox}
          onChangeText={setmsg}
          value={msg}
          onSubmitEditing={() => {
            onSend(msg)
            setmsg()
          }}
        />
      </View>
    </View>
  )
}

export default ChatBox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#b2ebf2',
  },
  messageView: {},
  messageText: {
    fontSize: 16,
    padding: 2,
  },
  textBoxView: {
    height: '10%',
    backgroundColor: '#e0f7fa',
  },
  messageBox: {
    borderWidth: 2,
    borderColor: '#d7ccc8',
    flex: 1,
    paddingLeft: 5,
    fontSize: 18,
  },
})
