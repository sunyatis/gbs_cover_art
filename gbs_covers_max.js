var MAXBUFFER = 10;

function gbook_coverart(data) {
  for (i in data) {
    var book = data[i];
    if (book.thumbnail_url != undefined) {
      updateCover(book.bib_key.replace(':', '_'), book);
    }
  }
}
function gbookScript(bibkeys, callback) {
  var script = document.createElement("script");
  src = "http://books.google.com/books?jscmd=viewapi&bibkeys="+escape(bibkeys.join(','))+"&callback="+callback;
  script.src = src;
  document.body.appendChild(script);
}
function updateCover(bibkey, book) {
  gbook_div = document.getElementById(bibkey);
  if (gbook_div.className == 'gbookthumbnail' && book.thumbnail_url) {
    gbook_div.innerHTML =  '<img src="'+book.thumbnail_url+'" border="0" alt="" />';
  }  else if (gbook_div.className == 'gbookpreview' && book.preview_url) {
    link_text = 'More Info';
    if(book.preview == 'partial') { link_text = 'Preview'; }
    if(book.preview == 'full') { link_text = 'Full Text'; }
    gbook_div.innerHTML =
        '<a href="'+book.preview_url+'" class="thumbnail" target="_blank">'
      + '<img src="'+book.thumbnail_url+'" border="0" alt="" />'
      + '<span style="padding-top: 3px; display: block;">' + link_text + '</span></a>';
  } else if (gbook_div.className == 'gbookfull') {
  }
}

function parseBibkey(bibkey) {
  if (!bibkey) return '';
  return bibkey.replace(/[^\d]/g, '');
}

window.onload = function() {
  allDivs = document.getElementsByTagName('div');
  bibkeys = [];
  for (i in allDivs) {
    var div = allDivs[i];
    if (div.className == 'gbookthumbnail' || div.className == 'gbookpreview' || div.className == 'gbsthumbnail') {
      var bibkey = parseBibkey(div.getAttribute('bibkey'));
      if (bibkey != '') {
        bibkeys.push(bibkey);
        div.setAttribute('id', bibkey.replace(':', '_'));
        div.innerHTML = '<img src="http://www.sunyconnect.suny.edu/gbs_cover_art/cover.png" height="80" border="0" alt="" />';
      }
    }
    if (bibkeys.length >= MAXBUFFER) {
      gbookScript(bibkeys, 'gbook_coverart');
      bibkeys = [];
    }
  }
  if (bibkeys.length > 0) {
    gbookScript(bibkeys, 'gbook_coverart');
  }
}