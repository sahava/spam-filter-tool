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
    '0n-line.tv|100dollars-seo.com|12masterov.com|1pamm.ru|4webmasters.org|5forex.ru|76brighton.com|7makemoneyonline.com|7zap.com|abovetherivernc.com|acads.net|acunetix-referrer.com|adcash.com|adelly.bg|adspart.com|adventureparkcostarica.com|adviceforum.info',
    'advokateg.ru|affordablewebsitesandmobileapps.com|afora.ru|akuhni.by|alessandraleone.com|aliexpress.com|allknow.info|allnews.md|allwomen.info|alpharma.net|altermix.ua|amanda-porn.ga|amt-k.ru|anal-acrobats.hol.es|anapa-inns.ru|android-style.com',
    'anticrawler.org|aosheng-tech.com|arendakvartir.kz|arkkivoltti.net|artparquet.ru|aruplighting.com|audiobangout.com|autovideobroadcast.com|aviva-limoux.com|avkzarabotok.info|azartclub.org|bablonow.ru|backgroundpictures.net|baixar-musicas-gratis.com',
    'baladur.ru|balitouroffice.com|bard-real.com.ua|bbtec.net|best-seo-offer.com|best-seo-solution.com|bestmobilityscooterstoday.com|bestwebsitesawards.com|bif-ru.info|biglistofwebsites.com|billiard-classic.com.ua|bioca.org|bizru.info|bkns.vn|blackhatworth.com',
    'blogtotal.de|blue-square.biz|bluerobot.info|bmw.afora.ru|boleznikogi.com|bookmark4you.com.biz|brakehawk.com|break-the-chains.com|bristolhotel.com.ua|brk-rti.ru|brothers-smaller.ru|budmavtomatika.com.ua|burger-imperia.com|buttons-for-website.com',
    'buttons-for-your-website.com|buy-cheap-online.info|buy-forum.ru|buyantiviralwp.com|buypharmacydrug.com|callejondelpozo.es|cardiosport.com.ua|cartechnic.ru|cbcseward.com|cenokos.ru|cenoval.ru|cezartabac.ro|cherrypointplace.ca|cherubinimobili.it|ci.ua',
    'cityadspix.com|civilwartheater.com|clicksor.com|clmforexeu.com|coderstate.com|codysbbq.com|conciergegroup.org|connectikastudio.com|constantaservice.net|covadhosting.biz|cubook.supernew.org|customsua.com.ua|dailyrank.net|darodar.com|delfin-aqua.com.ua',
    'demenageur.com|depositfiles-porn.(com|ga)|descargar-musica-gratis.net|detskie-konstruktory.ru|dipstar.org|djekxa.ru|dojki-hd.com|domination.ml|doska-vsem.ru|dostavka-v-krym.com|drupa.com|dvr.biz.ua|e-buyeasy.com|e-kwiaciarz.pl|ecomp3.ru|econom.co',
    'edakgfvwql.ru|edelstahlschornstein-123.de|egovaleo.it|ekto.ee|elitesportsadvisor.com|elmifarhangi.com|embedle.com|erot.co|escort-russian.com|este-line.com.ua|euromasterclass.ru|europages.com.ru|eurosamodelki.ru|event-tracking.com|extener.com|extremez.net',
    'family1st.ca|fbdownloader.com|fbfreegifts.com|feedouble.(com|net)|filmetricsasia.com|fitness-video.net|fiverr.com|floating-share-buttons.com|forex-procto.ru|forsex.info|forum20.smailik.org|forum69.info|foxtechfpv.com|free-share-buttons.com',
    'freeseedsonline.com|freewhatsappload.com|fsalas.com|ftns.ru|fungirlsgames.net|funnypica.com|generalporn.org|germes-trans.com|get-free-traffic-now.com|ghazel.ru|girlporn.ru|gkvector.ru|glavprofit.ru|gobongo.info|goodprotein.ru|googlsucks.com|gototal.co.nz',
    'guardlink.org|h2monline.com|handicapvantoday.com|hazardky.net|hol.es|hostcritique.com|hostingclub.lk|houseofrose.com|howopen.ru|howtostopreferralspam.eu|hulfingtonpost.com|humanorightswatch.org|hundejo.com|hvd-store.com|ico.re|igru-xbox.net',
    'ilovevitaly.(com|co|ro|ru|org|info)|iminent.com|imperiafilm.ru|inboxdollars.com|investpamm.ru|invivo.hu|iskalko.ru|ispaniya-costa-blanca.ru|istanbulit.com|it-max.com.ua|itronics.ca|itsdp3.com|jasonpartington.com|jjbabskoe.ru|joinandplay.me|joingames.org',
    'kabbalah-red-bracelets.com|kambasoft.com|kazrent.com|kino-fun.ru|kino-key.info|kinopolet.net|knigonosha.net|konkursov.net|kosova.de|laxdrills.com|leadwayau.com|littleberry.ru|livefixer.com|lmrauction.com|lol-smurfs.com|lombia.(com|co)|lumb.co|luxup.ru',
    'm1media.net|mainlinehobby.net|make-money-online.com|makemoneyonline.com|malls.com|manualterap.roleforum.ru|maridan.com.ua|masterseek.com|maxthon.com|mebelcomplekt.ru|mebeldekor.com.ua|med-zdorovie.com.ua|medi-fitt.hu|medicovi.com|medispainstitute.com.au',
    'meendo-free-traffic.ga|mericanmopedstore.com|micasainvest.com|microsearch.ru|minegam.com|mini.7zap.com|mir-betting.ru|mirobuvi.com.ua|mirtorrent.net|mobilemedia.md|motion-interactive.com|mountainstream.ms|moyakuhnia.ru|mpftpupload.com|msk.afora.ru',
    'muscle-factory.com.ua|musicas.baixar-musicas-gratis.com|musicprojectfoundation.com|myftpupload.com|myprintscreen.com|niki-mlt.ru|notaria-desalas.com|noumeda.com|novosti-hi-tech.ru|o-o-6-o-o.(com|ru)|o-o-8-o-o.(com|ru)|offers.bycontext.com|ok.ru',
    'online-hit.info|onlywoman.org|ooo-olni.ru|openfrost.com|openmediasoft.com|osoznanie-narkotikam.net|ozas.net|palvira.com.ua|paparazzistudios.com.au|petrovka-online.com|photokitchendesign.com|pizza-tycoon.com|pochemychka.net|poisk-zakona.ru',
    'pornhub-forum.(ga|uni.me)|pornhub-ru.com|pornoforadult.com|portnoff.od.ua|powitania.pl|pozdravleniya-c.ru|priceg.com|pricheski-video.com|princeadvantagesales.com|prlog.ru|producm.ru|prodvigator.ua|prohoster.info|prointer.net.ua|promoforum.ru|psa48.ru',
    'putitin.me|pyrodesigns.com.au|qitt.ru|qwesa.ru|ranksonic.(info|org)|rapidgator-porn.ga|rcb101.ru|realting-moscow.ru|rentalmaty.kz|research.ifmo.ru|resellerclub.com|retreatia.com|reversing.cc|rightenergysolutions.com.au|rospromtest.ru|sady-urala.ru',
    'salutmontreal.com|sanjosestartups.com|savetubevideo.com|screentoolkit.com|search-error.com|semalt.com|semalt.semalt.com|semaltmedia.com|seo-smm.kz|seoanalyses.com|seoexperimenty.ru|seopub.net|setioweb.com|sexyteens.hol.es|sharebutton.(net|to)',
    'shop.xz618.com|sibecoprom.ru|simple-share-buttons.com|siteripz.net|sitevaluation.com|sklad-24.ru|sledstvie-veli.net|slftsdybbg.ru|slkrm.ru|smailik.org|soaksoak.ru|social-buttons.com|socialseet.ru|softomix.(com|ru|org|net)|sohoindia.net|solnplast.ru',
    'sonyelektronik.com|sosdepotdebilan.com|soundfrost.org|spb.afora.ru|spravka130.ru|srecorder.com|steame.ru|streha-metalko.si|success-seo.com|superiends.org|susanholtphotography.com|taihouse.ru|tastyfoodideas.com|tattooha.com|teastory.co|tedxrj.com',
    'thecoral.com.br|theguardlan.com|thepokertimer.com|tomck.com|torture.ml|touchmods.fr|toyota.7zap.com|trafficmonetizer.org|trion.od.ua|twincitiescarservice.com|uasb.ru|uni.me|urlopener.blogspot.com.au|uzungil.com|vapmedia.org|video-woman.com',
    'videofrost.(com|net)|videos-for-your-business.com|viel.su|viktoria-center.ru|vodaodessa.com|vodkoved.ru|web-betting.ru|webmaster-traffic.com|webmonetizer.net|website-errors-scanner.com|websites-reviews.com|websocial.me|williamrobsonproperty.com',
    'wmasterlead.com|ykecwqlixx.ru|youporn-forum.(ga|uni.me)|youporn-ru.com|youtubedownload.org|yurgorod.ru|zastroyka.org|zazagames.org|zverokruh-shop.cz'
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
