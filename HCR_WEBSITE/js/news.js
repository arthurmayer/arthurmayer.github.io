function displayNews(XML){
    parser = new DOMParser();
    xml = parser.parseFromString(XML, "text/xml");
    titles = [];
    dates = [];
    extern = [];

    news = xml.getElementsByTagName("news-item");
    for (let n=0; n<news.length; n++){
        children = news[n].childNodes;
        dates.push(children[1]);
        titles.push(children[3]);
        extern.push(children[5]);
    }

    HTML = "";

    for (let i=0; i<news.length; i++) {
        HTML += "<li><h5>"+titles[i].innerHTML+"</h5><p>";
        if (extern[i].innerHTML !== ""){
            HTML += "See the full article <a href=\""+extern[i].innerHTML+"\">here</a>.<br />";
        }
        HTML += dates[i].innerHTML+"</p></li>";
    }

    document.getElementById("news-items").innerHTML = HTML;
}

fetch("./newsfeed/news-items.xml")
  .then(response => response.text())
  .then(text => displayNews(text))