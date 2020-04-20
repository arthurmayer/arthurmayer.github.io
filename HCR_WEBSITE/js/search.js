var getHTML = function ( url, callback, pagejson ) {
    // Feature detection
    if ( !window.XMLHttpRequest ) return;
    // Create new request
    var xhr = new XMLHttpRequest();
    // Setup callback
    xhr.onload = function() {
        if ( callback && typeof( callback ) === 'function' ) {
            callback( this.responseXML, pagejson );
        }
    }
    // Get the HTML
    xhr.open( 'GET', url );
    xhr.responseType = 'document';
    xhr.send();
};

/*function getHTML(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}*/

var sites = ["./index.html", "./people.html", "./outreach.html", "./publications.html", "./media.html"];

var PJ = {};
for (const site of sites){
    getHTML(site, function(page, pagejson){
        pagejson[site] = {
            "title": page.title,
            "content": page.getElementById("main_content").innerHTML.replace(/(<([^>]+)>)/ig,"").replace(/(\n)/ig,""),
            "url": page.URL,
            "path": site
            };
    }, PJ);
}


var searchIndex = lunr(function() {
    this.ref("id");
    this.field("title", { boost: 10 });
    this.field("content");
    for (var key in PJ) {
        this.add({
            "id": key,
            "title": pages[key].title,
            "content": pages[key].content
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
  return pages[match.ref];
});

// resultPages from previous example
resultsString = "";
resultPages.forEach(function (r) {
    resultsString += "<li>";
    resultsString +=   "<a class='result' href='" + r.url + "?q=" + searchTerm + "'><h3>" + r.title + "</h3></a>";
    resultsString +=   "<div class='snippet'>" + r.content.substring(0, 200) + "</div>";
    resultsString += "</li>"
});
document.getElementById("search-results").innerHTML = resultsString;