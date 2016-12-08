
var max_scrots = 1000;
var waitTilFinishTimeout = 200;
var scrtDelay = 200;

var fs = require('fs');

function scrot(url, file, onDone, x) {
   var page = require('webpage').create();

   page.open(url, function(status) {
      console.log("Status: " + status);

      if (status === "success")
         page.render(file);

      page.close();
      onDone(x);
      //phantom.exit();
   });
}

//scrot('http://google.com', 'test.png');

var statuses = [];
//for (var i = 0; i < max_scrots; i++) statuses[i] = false;

function url_lst_scrot(links_path) {
   console.log('starting reading of a file');
   var data = fs.read(links_path);
   var links_lst = data.split('\n');
   console.log('starting screenshots');

   /*for (var i in links_lst) {
      if (i >= max_scrots) break;
      //console.log(links_lst.length);
      var url = links_lst[i];
      console.log(url);
      statuses.push(false);

      //setTimeout(function() {
         function onDone(x) {
            statuses[x] = true;
         }

         scrot(url,  'scrots/file' + i.toString() + '.png', onDone, i);
      //}, i*500);
   }*/

   function waitTillDone() {
      var bad = false;

      for (var i in statuses.length) {
         if (statuses[i] != true)
            bad = true;
      }

      if (statuses.length+1 < max_scrots)
         bad = true; else console.log('got enough scrots to exit');

      if (bad)
         setTimeout(waitTillDone, waitTilFinishTimeout);
      else
         phantom.exit();
   }

   function rec_scrt(i) {
      if (i >= max_scrots || !(i < links_lst.length)) {
         waitTillDone();
         return;
      }

      //console.log(links_lst.length);
      var url = links_lst[i];
      console.log(url);
      statuses.push(false);

      function onDone(x) { statuses[x] = true; }
      scrot(url,  'scrots/file' + i.toString() + '.png', onDone, i);

      setTimeout(rec_scrt, scrtDelay, i+1);
   }

   rec_scrt(0);
   //waitTillDone();
}

url_lst_scrot('links.txt.lst');

