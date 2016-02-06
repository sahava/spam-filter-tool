var clientId = '74898515690-g2k3vcc67b0ntb09shr6akg9o8ecpbb2.apps.googleusercontent.com';
var apiKey = 'AIzaSyAdzlHG0OSBMM_WFfHsjbKg760We3S8R54';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.manage.users.readonly https://www.googleapis.com/auth/analytics.edit';

function handleClientLoad() {
  var initButton = document.getElementById('init');
  initButton.onclick = function() {
    var c_clientId = $("input[name='clientId']").val();
    var c_apiKey = $("input[name='apiKey']").val();
    var filter_piwik = $("input[name='filter_piwik']:checked").length;

    if((c_clientId != "") && (c_apiKey != "")){
      clientId = c_clientId;
      apiKey = c_apiKey;
    }
    gapi.client.setApiKey(apiKey);

    if(filter_piwik == 1){
      updateFilterPiwik();
    }else{
      window.setTimeout(checkAuth, 1);
    }
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

function updateFilterPiwik(callback){
  $(".log").text("Updating filter list ...");
  var url = "https://raw.githubusercontent.com/piwik/referrer-spam-blacklist/master/spammers.txt";
  $.ajax({
    url: url,
    type: "GET",
    data: {
    },
    error: function() {
      $(".log").text("Cannot load filter list from " + url);
    },
    dataType: "text",
    success: function(data) {
      data = data.replace(/^(\r\n|\r|\n)+|(\r\n|\r|\n)+$/g, "");//trim
      data = data.split(/\r\n|\r|\n/);
      // Filters is an Array of spam hosts. Each string must be less than 255 characters.
      var filters = [];
      var line = "";
      var test = "";
      //now for each domain in the array,
      //join them as multiple lines less than 255 characters
      for(var i=0;i<data.length;i++){
        test = line + "|" + data[i];
        if(test.length < 255){
          line = test;
        }else{
          line = line.replace(/^\|/, "");//remove starting "|"
          filters.push(line);
          line = "";
        }
      }
      //overriding
      spamFilter.filters = filters;

      //gapi.auth.authorize will be blocked by popup blocker if called
      //from script, we not let user to trigger it
      $(".log").html("<div>Filter updated.  <a class='manualAuth'>Click HERE</a> to start.</div>");
      $("#init").css("display", "none");
      $(".manualAuth").on("click", function(){
        checkAuth();
      });
    }
  });
}
