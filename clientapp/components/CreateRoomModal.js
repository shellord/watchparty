import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native'

const CreateRoomModal = ({ visible, closeModal, onCreate }) => {
  const [videolink, setvideolink] = useState('')
  const [modalshow, setmodalshow] = useState(visible)

  useEffect(() => {
    setmodalshow(visible)
  }, [visible])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalshow}
      onRequestClose={() => {
        setmodalshow(!modalshow)
      }}
    >
      <View style={styles.modalView}>
        <View style={styles.modalStyle}>
          <TextInput
            onChangeText={setvideolink}
            value={videolink}
            style={styles.textInput}
            placeholder="Video Link"
            placeholderTextColor="black"
          />
          <View style={styles.modalButtonContainer}>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.buttonClose,
                  { backgroundColor: '#f44336' },
                ]}
                onPress={() => {
                  setmodalshow(false)
                  closeModal()
                }}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => onCreate(null, videolink)}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CreateRoomModal
const styles = StyleSheet.create({
  modalButton: {
    borderRadius: 20,
    width: 100,
    padding: 10,
    marginTop: 40,
    marginRight: 10,
    alignItems: 'center',
  },

  buttonClose: {
    backgroundColor: '#29b6f6',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStyle: {
    marginTop: 22,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 65,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  textInput: {
    backgroundColor: '#e8f5e9',
    width: 200,
    borderRadius: 20,
    height: 45,
    padding: 15,
    alignContent: 'center',
    color: '#1565c0',
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
})
