
var index = 0;
var my_json;
var im_data;
var tr_data;
var API_KEY = 'YOUR PIXABAY IPA KEY HERE';
var YANTRAN_KEY ='YOUR YANDEX TRANSLATE API KEY HERE';

var $div = $("<div>",{id: "ppp", class:'popup'});

$div.hide();
var $yan_credit = $("<a id='credit' href='http://www.translate.yandex.com'>powered by Yandex Translate</a>");

var $dspan = $("<span>",{id: "mypopup", class:"popuptext"});
var $spandiv = $("<div>");

$cred_div = $("<div>");

var $im_content = $("<div>",{class: "display-container"});

var $pb_logo = $('<img id="pb-logo" src="" height= 20px width= 75px />');
$pb_logo.attr('src',chrome.extension.getURL("pixabay-logo.png"));

var result = $('<img id="payload" src="" />');

var $butt_left = $("<input/>",{class: "ext-left-button", type:"button", value:'previous' });
var $butt_right = $("<input/>", {class:'ext-right-button', type:"button", value:'next'});

$("body").append($div);

$(".popup").append($yan_credit);
$(".popup").append($cred_div);
$(".popup").append($dspan);

$(".popup").append($spandiv);

$(".popup").append(result);
$(".popup").append($pb_logo);


$(".popup").append($im_content);

$(".popup").append($butt_left);
$(".popup").append($butt_right);


$($butt_left).click(function(){advanceIm(-1);});
$($butt_right).click(function(){advanceIm(1);});

$("body").dblclick(function(e){

  if ($(e.target).attr('class') == 'ext-right-button' || $(event.target).attr('class')=='ext-left-button'){return;}

    $(".display-container").attr('src','');
    index = 0;

    var popupd = $(".popup");
    var $popup = $("#mypopup");
    var $payload = $("#payload");

    //is our popup already displayed?
    var isDisplayed = ($popup.attr("Class").split(' '));

    //get the word double clicked on
    var highlighted = window.getSelection().toString().trim();

    //is selection from dblclick a text element? if so show, else close popup box if it is open
    if (highlighted.length < 1 || highlighted == ' ' || window.getSelection().anchorNode.toString() == "[object HTMLBodyElement]"){

      if(isDisplayed.length == 2){
        $popup.toggleClass("Show");
      }
      return;
    }

    else{
      //show popup box
      $(".popup").show();



      var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(highlighted) + "&image_type=photo";
      var yanURL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + YANTRAN_KEY + '&text=' + highlighted +'&lang=ru-en'

      //request json

      $.ajax({
        url:yanURL,
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function(json){
          myCallback(json);
        }
      });

      $.ajax({
        url:URL,
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function(json){
          callback(json);
        }
      });
}
      if(tr_data['code'] == 200){
        $dspan.text(highlighted + ': ' + tr_data['text'][0]);
      }

      else{
        $dspan.text(highlighted + ': ' + 'error: could not translate');
      }

      if (im_data.total == 0){
        result.attr('src','#');
      }
      else{
      result.attr('src',im_data.hits[index].previewURL);}

      //display popup where the mouse was clicked
      popupd.offset({left:e.pageX, top:e.pageY});

      if(isDisplayed.length == 1){
        $popup.toggleClass("show");
    }
      //can't remember why this else if statement is important.
      else if(isDisplayed.length == 2 && isDisplayed[2] == "show"){
        $popup.toggleClass("show");
    }
});

  function advanceIm(n){
    if((index + n) < 0 || (index + n) >= im_data.hits.length){
      index = 0;
    }
    else{
      index = index + n;
    }
    result.attr('src',im_data.hits[index].previewURL);
  };


$(document).click(function(event){

  if ($(event.target).attr('class') == 'ext-right-button' || $(event.target).attr('class')=='ext-left-button'){
  }
  else{
  $(".popup").hide();}
  });

function callback(response){
  im_data = response;
}

function myCallback(data){
  tr_data = data;
}
