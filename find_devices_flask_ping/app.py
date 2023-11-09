from flask import Flask, render_template
from flask_socketio import SocketIO
import subprocess

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Read the list of devices from a file
with open('devices.txt', 'r') as file:
    devices = file.read().splitlines()

# Read the domain from a file
with open('domain.txt', 'r') as file:
    domain = file.readline().strip()

@app.route('/')
def index():
    # Filter out direct entries for display purposes
    display_devices = [device if not device.startswith('direct=') else device.split('direct=')[1] for device in devices]
    return render_template('index.html', devices=display_devices, domain=domain)

def ping_device(device):
    # Check if the device string starts with 'direct='
    if device.startswith('direct='):
        # Use the rest of the string after 'direct=' as the hostname
        hostname = device.split('direct=')[1]
    else:
        # Otherwise, append the domain to the device name
        hostname = f"{device}.{domain}"

    # Execute the ping command
    response = subprocess.run(["ping", "-c", "1", "-s", "1", hostname], stdout=subprocess.PIPE)
    if response.returncode == 0:
        # Emit a successful ping event
        return {'device': hostname, 'status': 'success'}
    else:
        # Emit a failed ping event
        return {'device': hostname, 'status': 'failure'}

def ping_all_devices():
    for device in devices:
        result = ping_device(device)
        socketio.emit('ping_response', result)
    # Schedule the next call
    socketio.start_background_task(ping_all_devices_after_delay)

def ping_all_devices_after_delay():
    socketio.sleep(5)  # Wait asynchronously without blocking
    ping_all_devices()

if __name__ == '__main__':
    socketio.start_background_task(ping_all_devices)  # Start the first ping immediately
    socketio.run(app)
