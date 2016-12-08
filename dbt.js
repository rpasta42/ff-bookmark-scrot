var page = require('webpage').create();


//var shim_url = 'phantom-shims.js';//'https://gist.githubusercontent.com/martintrojer/9a8e78126063705fabdb/raw/e1702e13f32ad173f063fb3267b314422b180a58/phantom-shims.js'; //

page.viewportSize = {
  width: 1920, //2560,
  height: 1080
};


page.onError = function(msg) {
   console.log('msg:', msg, 'trace:', trace);
};

page.onInitialized = function() {
   /*if(page.injectJs('phantom-shims.js'))
      console.log('phantom shims loaded');

    if(page.injectJs('core.js')){
        console.log("Polyfills loaded");
    }*/
}

var url = 'https://familyape.com/dbtnext/';
var file = 'work-scrots/work.png';


var fs = require('fs');
var creds = fs.read('work-stuff/creds.txt').split('\n');
var uname = creds[0];
var pass = creds[1];

page.open(url, function(status) {
   console.log("Status: " + status);

   if (status === "success") {} else phantom.exit();

   var jquery_url = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';

   page.includeJs(jquery_url,  function() {

      var ret = page.evaluate(function() {
         $('#btn-login').click();
         setTimeout(function() {
            $('#login-username-email').val(uname);
            $('#login-password').val(pass);


            $('#btn-signin').click();

         }, 800);
         return 'ha';
      });
      console.log('ret:', ret);

   });

   function onDone() {
      setTimeout(function() {
            page.render(file);
            page.close();
            phantom.exit();
      }, 1500);
   }

   setTimeout(function() {
      page.evaluate(function() {
         var reportsUrl = 'https://familyape.com/dbtnext/user/reports';
         window.location.href = reportsUrl;
      });
   }, 1300);


   setTimeout(function() {
     page.includeJs(jquery_url, function() {

         var x = page.evaluate(function() {
            var reportsUrl = window.location.href;
            $('#imgCont').html(reportsUrl);
            alert(reportsUrl); console.log(reportsUrl);

            return $('#frontpage-info').html();
         });
         console.log(x);
         onDone();

      });
   }, 2500);

      //phantom.exit();
});


