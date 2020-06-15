var getHTML = function ( url, callback ) {
    // Feature detection
    if ( !window.XMLHttpRequest ) return;
    // Create new request
    var xhr = new XMLHttpRequest();
    // Setup callback
    xhr.onload = function() {
        if ( callback && typeof( callback ) === 'function' ) {
            callback( this.responseXML );
        }
    }
    // Get the HTML
    xhr.open( 'GET', url );
    xhr.responseType = 'document';
    xhr.send();
};

var sites = ["./index.html", "./people.html", "./outreach.html", "./publications.html", "./media.html"];

var pagejson = {};
for (const site of sites){
    getHTML(site, function(page){
        pagejson[site] = {
            "title": page.title,
            "content": page.getElementById("content").innerHTML.replace(/(<([^>]+)>)/ig,"").replace(/(\n)/ig,""),
            "url": page.URL,
            "path": site
            };

        var searchIndex = lunr(function() {
            this.ref("id");
            this.field("title", { boost: 10 });
            this.field("content");
            for (var key in pagejson) {
                this.add({
                    "id": key,
                    "title": pagejson[key].title,
                    "content": pagejson[key].content
                });
            }
        });

        function getQueryVariable(variable) {
          var query = window.location.search.substring(1);
          var vars = query.split("&");
          for (var i = 0; i < vars.length; i++) {
              var pair = vars[i].split("=");
              if (pair[0] === variable) {
                  return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
              }
          }
        }

        var searchTerm = getQueryVariable("q");
        // creation of searchIndex from earlier example
        var results = searchIndex.search(searchTerm);
        var resultPages = results.map(function (match) {
          return pagejson[match.ref];
        });

        // resultPages from previous example
        resultsString = "";
        resultPages.forEach(function (r) {
            console.log(r);
            resultsString += "<li>";
            resultsString +=   "<a class='result' href='" + r.url + "'><b>" + r.path.substring(2, r.path.length-5) + "</b></a>";
            resultsString +=   "<div class='snippet'><p>" + r.content.substring(r.content.indexOf(searchTerm), r.content.indexOf(searchTerm)+200) + "</p></div>";
            resultsString += "</li>"
        });
        resultsString.replace(new RegExp(searchTerm, "g"), "<b>"+searchTerm+"</b>");
        document.getElementById("search-results").innerHTML = resultsString;
    });
}