(function() {
  var CoverArt, CoverImageSearch;
  var __slice = Array.prototype.slice;
  CoverImageSearch = (function() {
    var BASE_URL, DEFAULT_ALLOWED_NAMES, MAX_BUFFER_SIZE;
    MAX_BUFFER_SIZE = 10;
    BASE_URL = 'http://coverartlocator.herokuapp.com/search';
    DEFAULT_ALLOWED_NAMES = ['gbookthumbnail', 'gbookpreview', 'gbsthumbnail'];
    function CoverImageSearch() {
      this.bibkeys = [];
      this.allowed_names = DEFAULT_ALLOWED_NAMES;
    }
    CoverImageSearch.prototype.addBibkey = function(div) {
      var bibkey;
      if (this.isAllowedName(div.className)) {
        if (bibkey = this.parseBibkey(div.getAttribute('bibkey'))) {
            if(bibkey.search(":") > 0){
               bibkey = bibkey.toLowerCase();  
            }
            else{
               bibkey = "isbn:" +  bibkey
            }
          this.bibkeys.push(bibkey);
          this.insertPlaceholder(div, bibkey);
          if (this.bibkeys.length >= MAX_BUFFER_SIZE) {
            return this.submit();
          }
        }
      }
    };
    CoverImageSearch.prototype.submit = function() {
      if (this.bibkeys.length > 0) {
        this.insertScriptTag(document.body);
      }
      return this.bibkeys = [];
    };
    CoverImageSearch.prototype.insertScriptTag = function(ele) {
      var script;
      script = document.createElement('script');
      script.src = "" + BASE_URL + "?q=" + (escape(this.bibkeys.join(','))) + "&callback=gbook_coverart";
      return ele.appendChild(script);
    };
    CoverImageSearch.prototype.insertPlaceholder = function(ele, key) {
      var img;
      ele.id = key.replace(':', '_');
      img = document.createElement('img');
      img.src = 'http://www.sunyconnect.suny.edu/gbs_cover_art/cover.png';
      img.height = '80';
      img.border = '0';
      img.alt = '';
      return ele.appendChild(img);
    };
    CoverImageSearch.prototype.parseBibkey = function(id) {
      if (!id) {
        return '';