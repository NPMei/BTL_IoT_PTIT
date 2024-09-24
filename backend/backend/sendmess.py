from app.routing import send_message

room_name = '1'
message_content = 'Hello, this is a message from the server!'
send_message(room_name, message_content)