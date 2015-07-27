/** Google Analytics Spam Filter Insertion Tool
 **
 ** Created by: Simo Ahava (simo.s.ahava@gmail.com)
 **
 ** Remember to modify your Google API settings in authutil.js!
 **
***/
var spamFilter = (function () {
  // Filters is an Array of spam hosts. Each string must be less than 255 characters.
  // Use the Loan Goat resource to get the strings:
  // http://lonegoatuk.tumblr.com/post/107307494431/google-analytics-referral-spambot-list
  var filters = [
    'buttons-for-website.com|darodar.com|econom.co|ilovevitaly.co|kambasoft.com|lumb.co|7makemoneyonline.com|ranksonic.info|savetubevideo.info|see-your-website-here.com|semalt.com|priceg.com|srecorder.com|descargar-musica-gratis.net|54.186.60.77|lomb.co',
    'medispainstitute|sq01|alienpayday|artobox|axisalternativementalhealthsharebutton.net|torontoplumbinggroup.com|tasteidea.com|paparazzistudios.com.au|76brighton.co.uk|powitania.pl|ilovevitaly.ru|ilovevitaly.com|blackhatworth.com|hulfingtonpost.com',
    'cenoval.ru|bestwebsitesawards.com|website-errors-scanner.com|adviceforum.info|baixar-musicas-gratis.com|buy-forum.ru|fbdownloader.com|savetubevideo.com|smailik.org|simple-share-buttons.com|social-buttons.com|4webmasters.org|adcash.com|amanda-porn.ga',
    'best-seo-offer.com|best-seo-solution.com|buttons-for-your-website.com|buy-cheap-online.info|cenoval.ru|cityadspix.com|depositfiles-porn.ga|forum69.info|generalporn.org|get-free-traffic-now.com|gobongo.info|googlsucks.com|humanorightswatch.org',
    'inboxdollars.com|iskalko.ru|lombia.co|lombia.com|luxup.ru|meendo-free-traffic.ga|mpftpupload.com|o-o-6-o-o.com|o-o-8-o-o.com|prlog.ru|rapidgator-porn.ga|resellerclub|superiends.org|theguardlan.com|torture.ml|youporn-forum.ga|guardlink.org',
    'event-tracking.com|anal-acrobats.hol.es|100dollars-seo.com|floating-share-buttons.com|trafficmonetizer.org|success-seo.com|videos-for-your-business.com|e-buyeasy.com'
  ];

  // Declare utility variables
  var info = document.getElementById('info');
  var progress = document.getElementById('progress');
  var action = document.getElementById('action');
  var profiles = document.getElementById('profiles');
  var accounts = document.getElementById('accounts');
  var linksToSkip, filtersToUpdate, filtersToCreate, filterResource, gaLinks, actionBtn, lab, sel, def, aid, count, counter, aid, pid, vid, vname, i, j, len, jlen, items, found, propId, temp;

  var googleObj = {
    accounts : {},
    links : {}
  };

  // Run initialize() when the button is clicked
  var initialize = function() {
    progress.innerHTML = 'Fetching accounts...';
    gapi.client.analytics.management.accounts.list().then(queryAccounts, showError);
  };

  // Creates the googleObj['accounts'] hierarchy for each account you have EDIT access to
  var queryAccounts = function(resp) {
    items = resp.result.items;
    found = false;
    if (resp.result && items && items.length) {
      for (i = 0, len = items.length; i < len; i += 1) {
        if (items[i].permissions.effective.indexOf('EDIT') > -1) {
          googleObj['accounts'][items[i].id] = {
            'name' : items[i].name
          };
          found = true;
        }
      }
    }
    if (!found) {
      showError({
        'reason' : {
          'result' : {
            'error' : {
              'message' : 'You do not have EDIT access to any Google Analytics accounts.'
            }
          }
        }
      });
    } else {
      buildAccountsMenu();
    }
  };

  // Builds the accounts selector menu based on the googleObj['accounts'] hierarchy
  var buildAccountsMenu = function(msg) {
    lab = document.createElement('label');
    lab.setAttribute('for', 'gaAccounts');
    lab.innerHTML = 'Choose a Google Analytics account';
    sel = document.createElement('select');
    sel.setAttribute('class', 'form-control');
    sel.setAttribute('id', 'gaAccounts');
    def = document.createElement('option');
    def.value = 'default';
    def.innerHTML = '-- Choose an account --';
    sel.appendChild(def);
    for (var prop in googleObj['accounts']) {
      if (googleObj['accounts'].hasOwnProperty(prop)) {
        var opt = document.createElement('option');
        opt.setAttribute('data-id', prop);
        opt.setAttribute('value', googleObj['accounts'][prop]['name']);
        opt.innerHTML = googleObj['accounts'][prop]['name'];
        sel.appendChild(opt);
      }
    }
    info.innerHTML = '';
    accounts.appendChild(lab);
    accounts.appendChild(sel);
    sel.addEventListener('change', queryProperties);
    progress.innerHTML= '';
  };

  // When an account is selected and property/profile hierarchy has not yet been created,
  // queryProperties() first fetches all properties in the account
  var queryProperties = function(e) {
    sel = e.target;
    if (sel.selectedIndex != 0) {
      aid = sel.options[sel.selectedIndex].getAttribute('data-id');
      if (!googleObj['accounts'][aid]['props']) {
        googleObj['accounts'][aid]['props'] = [];
        progress.innerHTML = 'Fetching properties...';
        gapi.client.analytics.management.webproperties.list({
          'accountId' : aid
        }).then(buildPropertyLinks, showError);
      } else {
        buildPropsAndProfiles(aid);
      }
    }
  };

  // Build the googleObj['links'] hierarchy for properties
  var buildPropertyLinks = function(resp) {
    items = resp.result.items;
    if (resp.result && items && items.length) {
      progress.innerHTML = 'Fetching views...';
      for (i = 0, len = items.length; i < len; i += 1) {
        googleObj['links'][items[i].id] = {
          'name' : items[i].name,
          'views' : []
        }
        googleObj['accounts'][aid]['props'].push(
          items[i].id
        );
      }
      queryViews(aid);
    } else {
      showError({
        'reason' : {
          'result' : {
            'error' : {
              'message' : 'No properties in selected account'
            }
          }
        }
      });
    }
  };

  // Fetch all profiles for all properties in the account
  var queryViews = function(aid) {
    if (googleObj['accounts'][aid]['props'].length) {
      propId = googleObj['accounts'][aid]['props'][0];
      gapi.client.analytics.management.profiles.list({
        'accountId' : aid,
        'webPropertyId' : propId
      }).then(buildViewLinks, showError);
    } else {
      buildPropsAndProfiles(aid);
    }
  };

  // Build the googleObj['links'] hierarchy for views
  var buildViewLinks = function(resp) {
    items = resp.result.items;
    for (i = 0, len = items.length; i < len; i += 1) {
      googleObj['links'][propId]['views'].push({
        'id' : items[i].id,
        'name' : items[i].name
      });
    }
    googleObj['accounts'][aid]['props'].shift();
    queryViews(aid);
  };

  // Build the multiple select menu based on the googleObj['links'] hierarhcy
  var buildPropsAndProfiles = function(accountId) {
    lab = document.createElement('label');
    sel = document.createElement('select');
    count = 0;
    progress.innerHTML = 'Loading list...';
    lab.setAttribute('for', 'gaLinks');
    lab.innerHTML = 'Select the profile(s) you want to add the new filters to';
    sel.setAttribute('class', 'form-control');
    sel.setAttribute('id', 'gaLinks');
    sel.setAttribute('multiple', 'true');
    for (var prop in googleObj['links']) {
      if (prop.split('-')[1] === accountId) {
        var optGroup = document.createElement('optGroup');
        count += 1;
        optGroup.label = googleObj['links'][prop]['name'];
        for (i = 0, len = googleObj['links'][prop]['views'].length; i < len; i += 1) {
          count += 1;
          var opt = document.createElement('option');
          opt.setAttribute('data-pid', prop);
          opt.setAttribute('data-vid', googleObj['links'][prop]['views'][i]['id']);
          opt.setAttribute('data-vname', googleObj['links'][prop]['views'][i]['name']);
          opt.value = googleObj['links'][prop]['views'][i]['id'];
          opt.innerHTML = googleObj['links'][prop]['views'][i]['name'];
          optGroup.appendChild(opt);
        }
        sel.appendChild(optGroup);
      }
    }
    count > 5 ? sel.setAttribute('size', '10') : sel.setAttribute('size', '5');
    profiles.innerHTML = '';
    profiles.appendChild(lab);
    profiles.appendChild(sel);
    gaLinks = document.getElementById('gaLinks');
    action.innerHTML = '<button type="button" data-aid="' + accountId + '" data-aname="' + googleObj['accounts'][accountId]['name'] + '" id="actionBtn" class="btn btn-success">Create and apply filters</button>';
    actionBtn = document.getElementById('actionBtn');
    actionBtn.addEventListener('click', buildHierarchy);
    progress.innerHTML = '';
  };

  // When the "Create and link filters" button is clicked, a
  // googleObj['target']['hierarchy'] queue is built for processing
  var buildHierarchy = function(e) {
    if (gaLinks.options.selectedIndex > -1) {
      googleObj['target'] = {
        'hierarchy' : []
      };
      for (i = 0, len = gaLinks.options.length; i < len; i += 1) {
        var thisObj = gaLinks.options[i];
        // Builds a hierarchy of the selected profiles (account, property, profileId, profileName)
        if (thisObj.selected) {
          googleObj['target']['hierarchy'].push([
            e.target.getAttribute('data-aid'),
            thisObj.getAttribute('data-pid'),
            thisObj.getAttribute('data-vid'),
            thisObj.getAttribute('data-vname')
          ]);
        }
      }
      accounts.innerHTML = '';
      profiles.innerHTML = '';
      action.innerHTML = '';
      progress.innerHTML = 'Checking for existing <strong>sa_Spam_filter</strong> filters in account <strong>' + e.target.getAttribute('data-aname') + '</strong><br>';
      gapi.client.analytics.management.filters.list({
        'accountId' : googleObj['target']['hierarchy'][0][0]
      }).then(checkExistingFilters, showError);
    }
  };

  // Checks for existing filters in the account
  var checkExistingFilters = function(resp) {
    filtersToUpdate = [];
    filtersToCreate = [];
    found = {};
    items = resp.result.items;
    for (i = 0, len = items.length; i < len; i += 1) {
      for (j = 1, jlen = filters.length; j <= jlen; j += 1) {
        if (items[i].name === 'sa_Spam_filter_#' + j) {
          if (items[i].excludeDetails.expressionValue !== filters[j - 1]) {
            filtersToUpdate.push(items[i]);
          } else {
            progress.innerHTML += 'Found matching <strong>sa_Spam_filter_#' + j + '</strong>, skipping<br>';
            googleObj['target']['filter' + j] = items[i].id;
          }
          found[j] = true;
        }
      }
    }
    for (i = 1; i <= filters.length; i += 1) {
      if (!(i in found)) {
        filtersToCreate.push(i);
      }
    }
    updateExistingFilters();
  };

  // Update any existing filters if there's a mismatch
  var updateExistingFilters = function(resp) {
    if (resp) {
      googleObj['target']['filter' + resp.result.name.split('#')[1]] = resp.result.id;
    }
    if (filtersToUpdate.length) {
      filterResource = filtersToUpdate[0];
      filtersToUpdate.shift();
      i = filterResource.name.split('#')[1] - 1;
      filterResource.excludeDetails.expressionValue = filters[i];
      progress.innerHTML += 'Found conflicting <strong>' + filterResource.name + '</strong>, updating<br>';
      gapi.client.analytics.management.filters.update({
        'accountId' : filterResource.accountId,
        'filterId' : filterResource.id,
        'resource' : filterResource
      }).then(updateExistingFilters, showError);
    } else {
      createNewFilters();
    }
  };

  // Create new filters if they don't exist yet
  var createNewFilters = function(resp) {
    if (resp) {
      googleObj['target']['filter' + resp.result.name.split('#')[1]] = resp.result.id;
    }
    if (filtersToCreate.length) {
      filterResource = {
        'name' : 'sa_Spam_filter_#' + filtersToCreate[0],
        'type' : 'EXCLUDE',
        'excludeDetails' : {
          'caseSensitive' : false,
          'expressionValue' : filters[filtersToCreate[0] - 1],
          'field' : 'CAMPAIGN_SOURCE',
          'kind' : 'analytics#filterExpression',
          'matchType' : 'MATCHES'
        }
      };
      progress.innerHTML += 'Creating filter <strong>' + filterResource.name + '</strong><br>';
      filtersToCreate.shift();
      gapi.client.analytics.management.filters.insert({
        'accountId' : googleObj['target']['hierarchy'][0][0],
        'resource' : filterResource
      }).then(createNewFilters, showError);
    } else {
      gapi.client.analytics.management.profileFilterLinks.list({
        'accountId' : googleObj['target']['hierarchy'][0][0],
        'webPropertyId' : googleObj['target']['hierarchy'][0][1],
        'profileId' : googleObj['target']['hierarchy'][0][2]
      }).then(checkExistingLinks, showError);
    }
  };

  // Check for existing filter links in the given profile
  var checkExistingLinks = function(resp) {
    progress.innerHTML += 'Linking filters to profile <strong>' + googleObj['target']['hierarchy'][0][3] + '</strong> (' + googleObj['target']['hierarchy'][0][1] + ')<br>';
    linksToSkip = {};
    if (resp && resp.result.items) {
      items = resp.result.items;
      for (i = 0, len = items.length; i < len; i += 1) {
        if (items[i].filterRef.name.indexOf('sa_Spam_filter_#') > -1) {
          progress.innerHTML += 'Found existing link for <strong>' + items[i].filterRef.name + '</strong>, skipping<br>';
          linksToSkip[items[i].filterRef.name.split('#')[1]] = true;
        }
      }
    }
    linkFiltersToProfiles();
  };

  // Recursively create the links between filters and profiles
  var linkFiltersToProfiles = function(resp) {
    counter = (googleObj['target']['counter'] = googleObj['target']['counter'] || 1);
    if (googleObj['target']['hierarchy'].length) {
      aid = googleObj['target']['hierarchy'][0][0];
      pid = googleObj['target']['hierarchy'][0][1];
      vid = googleObj['target']['hierarchy'][0][2];
      vname = googleObj['target']['hierarchy'][0][3];
      if (counter > filters.length) {
        googleObj['target']['hierarchy'].shift();
        googleObj['target']['counter'] = 1;
        if (googleObj['target']['hierarchy'].length) {
          gapi.client.analytics.management.profileFilterLinks.list({
            'accountId' : googleObj['target']['hierarchy'][0][0],
            'webPropertyId' : googleObj['target']['hierarchy'][0][1],
            'profileId' : googleObj['target']['hierarchy'][0][2]
          }).then(checkExistingLinks, showError);
        } else {
          linkFiltersToProfiles();
        }
      } else {
        googleObj['target']['counter'] += 1;
        if (!(counter in linksToSkip)) {
          gapi.client.analytics.management.profileFilterLinks.insert({
            'accountId' : aid,
            'webPropertyId' : pid,
            'profileId' : vid,
            'resource' : {
              'filterRef' : {
                'id' : googleObj['target']['filter' + counter]
              }
            }
          }).then(linkFiltersToProfiles, showError);
        } else {
          linkFiltersToProfiles();
        }
      }
    } else {
      progress.innerHTML += 'Filters linked successfully, all done!';
    }
  };

  // Generic error function
  var showError = function(reason) {
    info.innerHTML = '<div class="alert alert-danger" role="alert">' + reason.result.error.message + '</div>';
  };

  // Expose public methods
  return {
    initialize : initialize,
    showError : showError
  };
})();
