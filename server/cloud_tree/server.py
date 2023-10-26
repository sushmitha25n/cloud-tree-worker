import jwt  # Import the jwt module
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string, render_template
import json
import requests
# import base64

app = Flask(__name__)

# Existing route for the root URL ("/")
@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        # Include all HTTP request headers in the response
        headers = {key: value for key, value in request.headers}
        return jsonify({'Method': 'Get', 'acceptance': 'Success', 'is_data': 'no', 'headers': headers})
    elif request.method == 'POST':
        data = request.get_json()
        if data:
            # Include all HTTP request headers in the response
            headers = {key: value for key, value in request.headers}
            return jsonify({'Method': 'Post', 'acceptance': 'Success', 'is_data': 'yes', 'data': data, 'headers': headers})
        else:
            # Include all HTTP request headers in the response
            headers = {key: value for key, value in request.headers}
            return jsonify({'Method': 'Post', 'acceptance': 'Success', 'is_data': 'no', 'headers': headers})

# New route to handle "/secure





@app.route('/secure/<country>')
def secure_country(country):
    # You can use the 'country' parameter to fetch data or perform any other logic
    # For example, you can retrieve data from a database, generate an image, etc.
    
    # Here, we're returning a simple response with the country name
    # return f"Welcome to the secure API for {country}!"
            # Make an HTTP POST request to the Cloudflare Worker
    worker_url = "https://image-worker.sushmitha25n.workers.dev"
    image_url = f'{worker_url}/{country}.png'
    response = requests.get(image_url)
    print(response)
    if response is not None:
        return render_template('country_image.html', image_data=response)
    else:
        return "Image not found", 404


@app.route('/secure')
def secure_route():
    # Extract the JWT token from the request headers
    jwt_token = request.headers.get('Cf-Access-Jwt-Assertion')

    if jwt_token:
        try:
            # Decode the JWT token
            decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

            # Access the 'iat' claim and convert it to a human-readable format
            iat_timestamp = decoded_token.get('iat')
            iat_date = datetime.utcfromtimestamp(iat_timestamp).strftime('%Y-%m-%d %H:%M:%S')
            email = request.headers.get('Cf-Access-Authenticated-User-Email')
            country = request.headers.get('Cf-Ipcountry').lower()

            data_to_pass = {
                'email': email,
                'iat': iat_date,
                'country': country
            }

            # Make an HTTP POST request to the Cloudflare Worker
            worker_url = "https://hello-world.sushmitha25n.workers.dev"
            response = requests.post(worker_url, json=data_to_pass)

            # Get the response from the worker
            worker_response = response.text

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Return the worker response as a JSON response from your Flask endpoint
                return render_template_string(worker_response), 200, {'Content-Type': 'text/html'}
                # return jsonify({'worker_response': worker_response}), 200
            else:
                # Handle the case where the worker request was not successful
                return jsonify({'message': f"Worker Request failed with status code {response.status_code}"}), 500

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'JWT token has expired'}, 401)
        except jwt.DecodeError:
            return jsonify({'error': 'Invalid JWT token'}, 400)
    else:
        return jsonify({'error': 'JWT token not found in headers'}, 400)



if __name__ == '__main__':
    # Run the Flask app locally on port 8080
    app.run(host="0.0.0.0", port=8082)
