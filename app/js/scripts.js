(function() {
  var flickityOptions = {
    imagesLoaded: true,
    // enable keyboard navigation, pressing left & right keys
    adaptiveHeight: true,
    accessibility: true,
    autoPlay: false,
    // alignment of cells, 'center', 'left', or 'right
    cellAlign: 'center',
    cellSelector: '.gallery-cell',
    contain: true,
    draggable: true,
    // enables content to be freely scrolled and flicked
    // without aligning cells
    freeScroll: true,
    friction: 0.2,
    percentPosition: false,
    prevNextButtons: false,
    pageDots: false,
    resize: true,
    // listens to window resize events to adjust size & positions
    rightToLeft: false,
    // enables right-to-left layout
    setGallerySize: true,
    watchCSS: false,
    wrapAround: true
  };

  function initGallery() {
    var sources = app.routeElem.querySelectorAll('.gallery-cell *[data-srcset]');
    if (sources.length) {
      var promises = [];
      for (var i=0; i < sources.length; i++) {
        var item = sources[i];
        item.setAttribute('srcset', item.dataset.srcset);
        if (item.tagName === 'IMG') {
          promises.push(new RSVP.Promise(function(resolve, reject) {
            var listener = function(ev) {
              item.removeEventListener('load', listener);
              console.log('loaded');
              resolve();
            };
            item.addEventListener('load', listener);
          }));
        }
      }
      picturefill({elements: sources});

      RSVP.all(promises).finally(function() {
        window.setTimeout(function() {
          app.lastFlickity = new Flickity('#' + app.routeID, flickityOptions);
        }, 40);
      });
      // window.requestAnimationFrame(
      //   function() {
      //     app.lastFlickity = new Flickity('#' + app.routeID, flickityOptions);
      //   }
      // );

    }
  }

  function teardownGallery() {
    if (app.lastFlickity) {
      app.lastFlickity.destroy();
      app.lastFlickity = null;
    }
  }

  var app = {
      // routes (i.e. views and their functionality) defined here
      'routes': {
        'home': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        '404':{
        },
        'comissioned': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'comissioned-1': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'comissioned-2': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'comissioned-3': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'comissioned-4': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'comissioned-5': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'editorial': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'editorial-1': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'editorial-2': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'portrait': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'portrait-1': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'portrait-2': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'portrait-3': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'fashion-2': {
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'music':{
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'personal':{
          'rendered': initGallery,
          'exited': teardownGallery
        },
        'about': {},
        'menu': {}
      },
      // The default view is recorded here. A more advanced implementation
      // might query the DOM to define it on the fly.
      'default': 'home',
      'notfound': '404',
      routeChange: function() {
          app.routeID = location.hash.slice(1);
          app.route = app.routes[app.routeID];
          app.routeElem = document.getElementById(app.routeID);

          //console.log(app.prevRouteID + ' exited');

          if (app.prevRoute && app.prevRoute.exited) {
            app.prevRoute.exited();
          }

          if (app.route) {
            if (app.route.rendered) {
              app.route.rendered();
            }
            //console.log(app.routeID + ' entered');
          } else {
            window.location.hash = app.notfound;
          }
      },
      // The function to start the app
      init: function() {
          window.addEventListener('hashchange', function(e) {
              app.prevRouteID = e.oldURL.split("#")[1];
              app.prevRoute = app.routes[app.prevRouteID];
              app.routeChange();
          });
          // If there is no hash in the URL, change the URL to
          // include the default view's hash.
          if (!window.location.hash) {
              window.location.hash = app.default;
          } else {
              // Execute routeChange() for the first time
              app.routeChange();
          }
      }
  };

  window.app = app;

})();

app.init();
