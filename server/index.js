import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

const users = []
function userJoin(id, room, isHost, videoLink) {
  const user = { id, room, isHost, videoLink }
  users.push(user)
  return user
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room == room)
}
function getVideoLink(room) {
  return users.filter((user) => user.room == room && user.isHost == true)[0]
    .videoLink
}

io.on('connection', (socket) => {
  console.log(socket.id + ' connected')
  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected')
  })

  socket.on('msg', (msg) => {
    console.log(msg)
  })

  socket.on('joinRoom', ({ id, room, isHost, videoLink }) => {
    room = parseInt(room)
    if (!isHost && getRoomUsers(room).length == 0) {
      return socket.emit('error', "Room doesn't exist!")
    }
    socket.join(room)
    userJoin(id, room, isHost, videoLink)
    console.log(id + ':' + room + ':' + isHost + ' has joined')
    console.log(users)
    io.to(room).emit('videoLink', getVideoLink(room))
  })

  socket.on('leaveRoom', (room) => {
    socket.leave(room)
    userLeave(socket.id)
    console.log(socket.id + ' has left the room ' + room)
  })

  socket.on('videoStatus', (data) => {
    socket.to(data.room).emit('videoStatus', data.status)
  })
})

httpServer.listen(3000, () => console.log('Server is running at port 3000'))
