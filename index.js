const config = require('config')
const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')

const PORT = process.env.PORT || config.get('serverPort')

app.use(cors())
app.use(express.json())

app.ws('/websocket', (ws, req) => {
	ws.on('message', function (message) {
		message = JSON.parse(message)
		switch (message.event) {
			case 'message':
				broadcastMessage(message)
				break
			case 'connection':
				broadcastMessage(message)
				break
		}
	})
})

function broadcastMessage(message) {
	aWss.clients.forEach(client => {
		client.send(JSON.stringify(message))
	})
}

const start = async () => {
	try {
		app.listen(PORT, () => {
			console.log('Server listening on port: ', PORT)
		})
	} catch (err) {
		console.log(err)
	}
}

start()
