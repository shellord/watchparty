import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import JoinRoomModal from '../components/JoinRoomModal'
import CreateRoomModal from '../components/CreateRoomModal'
import { io } from 'socket.io-client'

const HomeScreen = ({ navigation }) => {
  const [toggleModal1, settoggleModal1] = useState(false)
  const [toggleModal2, settoggleModal2] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const socket = io('http://192.168.1.9:3000')

    socket.on('connect', () => {
      socket.emit('msg', 'hello')
    })
    socket.on('disconnect', () => {
      console.log(socket.id)
    })
    socket.on('error', (msg) => {
      console.log(msg)
    })
    ref.current = socket
    return () => socket.disconnect()
  }, [])

  const closeModal = () => {
    settoggleModal1(false)
    settoggleModal2(false)
  }
  const joinRoom = (room, videolink) => {
    let isHost = true
    room ? ((isHost = false), (videolink = null)) : null
    !room ? (room = Math.floor(Math.random() * 90000) + 10000) : null
    let user = {
      id: ref.current.id,
      room: room,
      isHost: isHost,
      videoLink: videolink,
    }
    ref.current.emit('joinRoom', user)
    closeModal()
    let socket = ref.current
    navigation.navigate('WatchScreen', { user, socket, videolink })
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => settoggleModal2(!toggleModal2)}
      >
        <Text style={styles.text}>Create a Room</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          settoggleModal1(!toggleModal1)
        }}
      >
        <Text style={styles.text}>Join Room</Text>
      </TouchableOpacity>

      <CreateRoomModal
        visible={toggleModal2}
        closeModal={closeModal}
        onCreate={joinRoom}
      />
      <JoinRoomModal
        visible={toggleModal1}
        closeModal={closeModal}
        onJoin={joinRoom}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6ec6ff',
    width: 200,
    padding: 10,
    marginTop: 30,
  },
  text: {
    color: '#002f6c',
    fontWeight: 'bold',
  },
})

export default HomeScreen
