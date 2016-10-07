# Watson Simple Parrot in Node.js

This app is built using the [express application generator](http://expressjs.com/en/starter/generator.html) .
It creates a simple form where the user can enter some text. After submitting
the text, the app displays it back to the user. The app is designed to be
extended by adding the Watson Language Translation API service to perform
actions like identifying the language of the input text, or to translate it
to a different language. All views are rendered using the EJS template language.

## Run the app on Bluemix

You can deploy this application to your Bluemix environment by clicking on
this button. It will create a Bluemix DevOps Services project, copy this
repository into the project and deploy it.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ibmecod/watson-parrot-nodejs)

Once you have tried the application, use the Bluemix dashboard
or Cloud Foundry cli to add the Watson Language Translation service to the
app. The app will automatically detect this and display the language of the
message entered into the app.


## Run the app locally

1. [Install Node.js][]
2. Download and extract the starter code from the Bluemix UI
3. cd into the app directory
4. Run `npm install` to install the app's dependencies
5. Run `npm start` to start the app
6. Access the running app in a browser at the port shown on startup

When running locally, the code will not detect the language used in the input
text. To enable language detection, create a Watson Language Translation service
in Bluemix and bind it to an application. Export the VCAP_SERVICES envrionment
variable and define it to your environment before invoking `npm start`

[Install Node.js]: https://nodejs.org/en/download/

# Privacy Notice

Sample web applications that include this package may be configured to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling Deployment Tracking

To disable deployment tracking, edit the app.js file and comment line 9 containing:
   ```
   require("cf-deployment-tracker-client").track();
   ```
