const mqtt = require('mqtt')  
var url = 'mqtt://m11.cloudmqtt.com';



var options = {
  port: 11767,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: "juvirrdk",
  password: "WdjUTTnHGzSw",
};
const client = mqtt.connect(url,options);

/**
 * The state of the garage, defaults to closed
 * Possible states : closed, opening, open, closing
 */


client.on('connect', () => {  
  client.subscribe('dispositivos/#');
  

  // Inform controllers that garage is connected
  client.publish('dispositivo/connect',
  '{  "Lugar": "-", "Dispositivo": "-","Sensor": "-", "Valor": 0, "Unidad": "-","status": "Desconectado"}')
  
})

client.on('message', (topic, message) => {  
   var dispositivo = JSON.parse(message);

})

function sendStateUpdate () {  
  console.log('sending state %s', state)
  client.publish('garage/state', state)
}

function handleOpenRequest (message) {  
  if (state !== 'open' && state !== 'opening') {
    console.log('opening garage door')
    state = 'opening'
    sendStateUpdate()

    // simulate door open after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'open'
      sendStateUpdate()
    }, 5000)
  }
}

function handleCloseRequest (message) {  
  if (state !== 'closed' && state !== 'closing') {
    state = 'closing'
    sendStateUpdate()

    // simulate door closed after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'closed'
      sendStateUpdate()
    }, 5000)
  }
}

/**
 * Want to notify controller that garage is disconnected before shutting down
 */
function handleAppExit (options, err) {  
  if (err) {
    console.log(err.stack)
  }

  if (options.cleanup) {
    client.publish('garage/connected', 'false')
  }

  if (options.exit) {
    process.exit()
  }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {  
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {  
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {  
  exit: true
}))