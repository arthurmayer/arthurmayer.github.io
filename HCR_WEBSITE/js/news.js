function displayNews(XML){
    parser = new DOMParser();
    xml = parser.parseFromString(XML, "text/xml");
    titles = [];
    dates = [];
    extern = [];

    news = xml.getElementsByTagName("news-item");
    for (const new in news){
        children = new.childNodes;
        dates.append(children[0]);
        titles.append(children[1]);
        extern.append(children[2]);
    }

    HTML = "";

    for (let i=0; i<news.length; i++) {
        HTML += "<li><h5>"+titles[i].nodeValue+"</h5><p>";
        if (extern[i] !== ""){
            HTML += "See the full article <a href=\""+extern[i].nodeValue+"\">here</a>.<br />";
        }
        HTML += dates[i].nodeValue+"</p></li>";
    }

    document.getElementById("news-items").innerHTML = HTML;
}

fetch("./newsfeed/news-items.xml")
  .then(response => response.text())
  .then(text => displayNews(text))