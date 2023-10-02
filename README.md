# LLM Chrome Extension with Serverless Backend on AWS

This repository contains a Chrome extension with a serverless backend deployed on AWS using CloudFormation. This README will guide you through the process of setting up and running the project locally.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- AWS CLI (https://aws.amazon.com/cli/) installed and configured with AWS credentials.
- AWS SAM (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed.
- OpenAI API key
- AWS admin account

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Navigate to the project directory:

   ```bash
   cd aissistant
   cd aws-backend
   ```

3. Install the required npm packages for both the Chrome extension and the serverless backend:

   ```bash
   cd client
   npm install
   cd ../serverless
   npm install
   ```
## Serverless Backend (AWS with CloudFormation)

### Deploying the Serverless Backend

1. Ensure you have the [AWS CLI](https://aws.amazon.com/cli/) installed and configured with your AWS credentials.

2. Navigate to the `aws-backend` directory:

   ```bash
   cd aws-backend
   ```
3. Add a samconfig.toml file to set parameter_overrides:

  ```toml
  version = 0.1
  
  [default.deploy]
  [default.deploy.parameters]
  parameter_overrides = "OpenAIOrgID=\"\" OpenAIAPIKey=\"\" Stage=\"dev\""
  ```
   
3. Build the serverless backend using CloudFormation:

   ```bash
   sam build
   ```
4. Deploy the serverless backend using CloudFormation (this will allow you to set deployment configs):

   ```bash
   sam deploy --guided
   ```
5. Follow the prompts to provide necessary parameters and confirm the deployment.
   

### Accessing the Serverless Backend

Once the deployment is successful, you will receive information about the deployed resources, including API endpoints, Lambda functions, and more. Use this information to interact with your serverless backend.

## Chrome Extension

### Running the Chrome Extension

1. Open Google Chrome.

2. Navigate to `chrome://extensions/`.

3. Enable "Developer mode" using the toggle switch in the top right corner.

4. Click the "Load unpacked" button and select the `client` directory within your cloned repository.

5. The Chrome extension should now be installed and active.

### Using the Chrome Extension

The keyboard inputs that the extension is looking for is //gen.

---

