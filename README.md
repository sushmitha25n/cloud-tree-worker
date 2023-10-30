# CloudTree Project

This repository contains the code for the CloudTree project, which is composed of several components, including a Python Flask server hosted on a Google instance, Cloudflare serverless workers, and private R2 bucket interaction. The project provides endpoints for various functionalities.

## Directory Structure

hello-world/
├── <files and code for the hello-world worker>
image-worker/
├── <files and code for the image-worker>
server/
├── cloud_tree/
├── <files and code for the Python Flask server>


- `hello-world`: Contains the Cloudflare serverless worker that returns user login details.
- `image-worker`: Contains the Cloudflare serverless worker that interacts with a private R2 bucket and returns image data to the Flask server.
- `server/cloud_tree`: Contains the Python Flask server hosted on a Google instance.

## Endpoints

1. [https://cloudtree.online](https://cloudtree.online): The main entry point for the CloudTree project.

2. [https://tunnel.cloudtree.online](https://tunnel.cloudtree.online): An endpoint for additional functionality.

3. [https://tunnel.cloudtree.online/secure](https://tunnel.cloudtree.online/secure): A secure endpoint for specific operations.

4. [https://tunnel.cloudtree.online/secure/<country>](https://tunnel.cloudtree.online/secure/<country>): A country-specific secure endpoint, where `<country>` can be 'ca' for Canada, 'us' for the USA, 'uk' for the United Kingdom, and so on. The endpoint format is "secure/<country>."

## Usage

To run the CloudTree project, follow the instructions in each component's respective directory. Be sure to configure the necessary API keys, environment variables, and dependencies.

- For the Flask server, navigate to `server/cloud_tree` and follow the server's README for setup instructions.

- For the Cloudflare workers, navigate to the respective worker directories (`hello-world` and `image-worker`) and follow their README files for setup and deployment instructions.

Please ensure that you have the required permissions and credentials to interact with the specified R2 bucket.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

I acknowledge the contributions of the open-source community and thank the project's collaborators for their dedication and support.

