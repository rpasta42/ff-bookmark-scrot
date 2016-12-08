
var fs = require('fs');
var page = require('webpage').create();


//var shim_url = 'phantom-shims.js';//'https://gist.githubusercontent.com/martintrojer/9a8e78126063705fabdb/raw/e1702e13f32ad173f063fb3267b314422b180a58/phantom-shims.js'; //

page.viewportSize = {
  width: 1080, //1920, //2560,
  height: 3000 //860, //1080
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
var file = 'work-stuff/work.png';

var uname = null,  passwd = null;
function read_creds() {
   var creds = fs.read('work-stuff/creds.txt').split('\n');
   uname = creds[0];
   passwd = creds[1];
   //console.log('uname:', uname, 'pass:', passwd);
}
read_creds();

page.open(url, function(status) {
   console.log('starting');

   console.log("Status: " + status);
   if (status === "success") {} else phantom.exit();

   var jquery_url = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';

   page.includeJs(jquery_url,  function() {

      var ret = page.evaluate(function(uname, passwd) {
         $('#btn-login').click();
         setTimeout(function() {
            $('#login-username-email').val(uname);
            $('#login-password').val(passwd);

            $('#btn-signin').click();
         }, 400);
      }, uname, passwd);
      console.log('ret:', ret);

   });


   setTimeout(function() {
      page.evaluate(function() {
         var reportsUrl = 'https://familyape.com/dbtnext/user/reports';
         window.location.href = reportsUrl;
      });
   }, 800);

   function onDone() {
      console.log('scheduling onDone');

      setTimeout(function() {
         page.evaluate(function() {
            $('#blueprint-btn-print').click();
         });
      }, 1000);

      setTimeout(function() {
         console.log('running onDone');

         page.render(file);
         page.close();
         phantom.exit();
      }, 1300);
   }


   setTimeout(function() {
     //page.includeJs(jquery_url, function() {
         var x = page.evaluate(function() {
            var reportsUrl = window.location.href;
            $('#imgCont').html(reportsUrl);
            //alert(reportsUrl); console.log(reportsUrl);

            $('#collapse-main-menu-btn').click();

            //$('#surveyList tbody tr').first().click();

            //$('#surveyList > tbody > tr').first().find('button').click();
            var goodBtn = $('#surveyList button').first();
            goodBtn.click();


            return $('#react-survey-viewer').html(); //$('#frontpage-info').html();
         });
         console.log(x);
         onDone();
      //});

   }, 1900);



      //phantom.exit();
});

