import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Video } from 'expo-av'

const WatchScreen = (props) => {
  const { user, socket, videolink } = props.route.params
  const { id, isHost, room } = user
  const [status, setStatus] = useState({})
  const [hoststatus, sethoststatus] = useState({})
  const [videouri, setvideouri] = useState(videolink)
  const [streaming, setstreaming] = useState(false)
  const video = React.useRef(null)

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        socket.emit('leaveRoom', room)
        socket.off('videoLink')
        socket.off('videoStatus')
      }
    }, [props])
  )
  useEffect(() => {
    !videolink
      ? socket.on('videoLink', (link) => {
          setvideouri(link)
        })
      : setvideouri(videolink)
  }, [videolink])

  useEffect(() => {
    !isHost && video.current && !streaming
      ? socket.on('videoStatus', (hoststatus) => {
          setstreaming(true)
          hoststatus.isPlaying
            ? video.current.playAsync()
            : video.current.pauseAsync()
          sethoststatus(hoststatus)
        })
      : null
  }, [videouri])

  useEffect(() => {
    !isHost
      ? Math.abs(hoststatus.positionMillis - status.positionMillis) >= 1000
        ? video.current.setPositionAsync(hoststatus.positionMillis)
        : null
      : null
  }, [hoststatus])

  useEffect(() => {
    isHost ? socket.emit('videoStatus', { room: room, status: status }) : null
  }, [status])
  return (
    <View style={styles.container}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomCode}># {room}</Text>
      </View>
      {videouri ? (
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls={isHost}
          resizeMode="contain"
          isLooping={false}
          onPlaybackStatusUpdate={(status) => setStatus(status)}
        />
      ) : null}
    </View>
  )
}

export default WatchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  roomInfo: {
    margin: 30,
    alignItems: 'flex-start',
  },
  roomCode: {
    fontSize: 18,
    color: '#546e7a',
    fontStyle: 'italic',
  },
  video: {
    width: '100%',
    height: 250,
  },
})
