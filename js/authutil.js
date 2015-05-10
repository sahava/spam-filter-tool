var clientId = '613605597963-s97vime5ktrfsav7r2je4te26o6miaeu.apps.googleusercontent.com';
var apiKey = 'AIzaSyCxMNvtEPcRs-1uSxnSLTxsJTlrbfXAI50';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.manage.users.readonly https://www.googleapis.com/auth/analytics.edit';

function handleClientLoad() {
  var initButton = document.getElementById('init');
  initButton.onclick = function() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
  }
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
}

function handleAuthResult(authResult) {
  if (authResult) {
    gapi.client.load('analytics', 'v3', spamFilter.initialize);
  } else {
    spamFilter.showError({
      'reason' : {
        'result' : {
          'error' : {
            'message' : 'Authentication failed.'
          }
        }
      }
    });
  }
}
