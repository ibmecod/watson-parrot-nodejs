# Watson Simple Parrot in Node.js

[![](https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg)](https://bluemix.net)

This app is built using the [express application generator](http://expressjs.com/en/starter/generator.html). It creates a simple form where the user can enter some text. After submitting the text, the app displays it back to the user. The app is designed to be extended by adding the Watson Language Translation API service to perform actions like identifying the language of the input text, or to translate it to a different language. All views are rendered using the EJS template language.

## Run the app on IBM Cloud Foundry

You can deploy this application to your IBM Cloud Foundry environment by clicking on this button. It will create a IBM Cloud Continous Delivery toolchain, copy this repository into a new repository and deploy it.

[![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ibmecod/watson-parrot-nodejs.git)

Once you have tried the application, use the IBM Cloud dashboard or Cloud Foundry cli to add the Watson Language Translation service to the app. Restage the app when prompted. The app will use this service to display the language of the message entered into the app.

## Run the app locally

1. [Install Node.js](https://nodejs.org/en/download/)
2. Clone this repository to a directory `git clone https://github.com/ibmecod/watson-parrot-nodejs.git`
3. cd into the app directory
4. Run `npm install` to install the app's dependencies
5. Run `npm start` to start the app
6. Access the running app in a browser at the port shown on startup

When running locally, the code will not detect the language used in the input text. To enable language detection, create a Watson Language Translator service on IBM Cloud and bind it to an application copy in Cloud Foundry. Export the VCAP_SERVICES envrionment variable and define it to your environment before invoking `npm start`

## Run the app as a local container

1. [Install Docker CE](https://www.docker.com/community-edition)
2. Build a container image with the application using the Dockerfile

  ```bash
  docker image build -t smart-parrot .
  ```

3. Create a container from the image and run in a terminal

  ```bash
  docker container run -it -p 6001:6001 smart-parrot
  ```

4. Access the application locally at `http://localhost:6001/`

When running locally as a container the application will not use the Watson Language Translator service and will just repeat what is typed into the form. But you can make it smarter by deploying on IBM Cloud Container Service with Kubernetes.

## Run the application using Kubernetes on IBM Cloud Container Service

1. Follow the [Kubernetes Cluster Tutorial](https://github.com/IBM/container-journey-template) to create your own cluster on IBM Cloud.
2. Install the IBM Cloud container registry cli and log in to the container registry service.

  ```bash
  bx plugin install container-registry -r Bluemix
  bx cr login
  ```
3. Tag the docker image that was built locally using your IBM Cloud container registry namespace.
> you can list your namespaces with `bx cr namespaces`

  ```bash
  docker image tag smart-parrot registry.ng.bluemix.net/<your-namespace>/smart-parrot
  ```
4. Push the image to the IBM Cloud container registry.

  ```bash
  docker image push registry.ng.bluemix.net/<your-namespace>/smart-parrot
  ```
5. Add a copy of the Watson Language Translator service to your organization and space using the IBM Cloud catalog or the command-line using the instance name shown (to minimize edits in the deployment file).

  ```bash
  bx service create language_translator lite mylanguagetranslator
  ```

6. Bind the service to the cluster which will inject the service credentials as a Kubernetes secret.
> you can list your cluster name(s) with `bx cs clusters`

  ```bash
  bx cs cluster-service-bind <your-cluster-name> default mylanguagetranslator
  ```

7. Edit the `smart-parrot-deployment.yaml` file and update the `<your-namespace>` field in the image url to your namespace. Deploy the application using the deployment file.

  ```bash
  kubectl create -f smart-parrot-deployment.yaml
  ```
8. Get your worker IP address(es) for the cluster.

  ```bash
  bx cs workers <your-cluster-name>
  ```
9. Access the application at `http://<worker-ip>:30801/` . With the Language Translator service bound to the cluster and associated with the pod for the deployment, the app is able to determine the language used in the message.
