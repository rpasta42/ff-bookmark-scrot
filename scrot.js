
var max_scrots = 30;
var waitTilFinishTimeout = 200;
var scrtDelay = 200;

var fs = require('fs');

function scrot(url, file, onDone, x, firstHalf) {
   var page = require('webpage').create();

   page.open(url, function(status) {
      console.log("Status: " + status);

      if (status === "success")
         page.render(file);

      page.close();
      onDone(x, firstHalf);
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

   /*function waitTillDone() {
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
   }*/

   /*var rec1_start = 0;
   var rec1_end = 15;
   var rec2_start = 15;
   var rec2_end = 30;*/
   //var rec_start = null, rec_end = null;
   var rec1_end = 15;
   var rec2_end = 30;

   var first_done = false, second_done = false;

   function rec_scrt(i, first_half) {
      var local_max_scrots = first_half ? rec1_end : rec2_end;
      if (i >= local_max_scrots || !(i < links_lst.length)) {
         if (first_half) first_done = true;
         if (!first_half) second_done = true;

         //waitTillDone();
         if (first_done && second_done)
            phantom.exit();
         return;
      }

      //console.log(links_lst.length);
      var url = links_lst[i];
      console.log('i:', i, 'url:', url);
      statuses.push(false);

      //function onDone(x) { statuses[x] = true; }
      scrot(url,  'scrots/file' + i.toString() + '.png', rec_scrt, i+1, first_half);//onDone, i);

      //setTimeout(rec_scrt, scrtDelay, i+1);
   }


   rec_scrt(0, true);
   rec_scrt(15, false);
   //waitTillDone();
}

url_lst_scrot('links.txt.lst');


/*1 at a time:
real  0m26.185s
user  0m6.704s
sys   0m0.620s


2 at a time:
real  0m19.300s
user  0m6.692s
sys   0m0.656s

*/
