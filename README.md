# Spam Filter Insertion Tool

The **Spam Filter Insertion Tool** allows you to automatically add and link a number of spam filters to the user's existing Google Analytics profiles.

The tool is built with Bootstrap and the Google Analytics JavaScript API. Because it's the JS API, it's a hallmark of functional, asynchronous chaining which, at some point, will hopefully be obsolete once the calls can be run synchronously.

To get it up and running, you will need to create a new Google API Project under https://code.google.com/apis/console/.

Make sure you've selected the Analytics API for the project.

You will need to create a "Client ID for web application" (set JavaScript Origins to your site and Redirect URIs to empty) as well as a public API key.

In js/authutil.js, modify the clientId and apiKey variables accordingly.
