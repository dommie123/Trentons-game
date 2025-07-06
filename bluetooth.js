async function bluetooth() {
  try {
    // Request a Bluetooth device
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information']
    });

    console.log('Selected device:', device.name);
    console.log('Device ID:', device.id);

    // Connect to the device
    await connection(device);

  } catch (error) {
    console.error('Bluetooth request failed:', error);
  }
}

async function connection(device) {
  try {
    // Connect to the GATT server
    const server = await device.gatt.connect();
    console.log('Connected to GATT server');

    // Call the connected callback
    whenConnected(device, server);

    // Handle disconnection
    device.addEventListener('gattserverdisconnected', onDisconnected);

    return server;

  } catch (error) {
    console.error('Connection failed:', error);
  }
}

function whenConnected(device, server) {
  console.log("Bluetooth connected to:", device.name);

  // Example: Read battery level if available
  readBatteryLevel(server);
}

async function readBatteryLevel(server) {
  try {
    const service = await server.getPrimaryService('battery_service');
    const characteristic = await service.getCharacteristic('battery_level');
    const value = await characteristic.readValue();
    const batteryLevel = value.getUint8(0);
    console.log('Battery level:', batteryLevel + '%');
  } catch (error) {
    console.log('Battery service not available');
  }
}

function onDisconnected(event) {
  const device = event.target;
  console.log('Device disconnected:', device.name);
}

// Check if Web Bluetooth is supported
function checkBluetoothSupport() {
  if (!navigator.bluetooth) {
    console.error('Web Bluetooth API is not supported in this browser');
    return false;
  }
  return true;
}

// Initialize Bluetooth support check
if (checkBluetoothSupport()) {
  console.log('Web Bluetooth API is supported');
}
