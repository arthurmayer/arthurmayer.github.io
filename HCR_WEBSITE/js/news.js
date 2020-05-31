function displayNews(XML){
    parser = new DOMParser();
    xml = parser.parseFromString(XML, "text/xml");
    titles = [];
    dates = [];
    extern = [];

    news = xml.getElementsByTagName("news-item");
    news_list = document.getElementById("news-items");
    num_to_display = parseInt(news_list.getAttribute("count"));
    if (Number.isNaN(num_to_display) || num_to_display < 1){
        num_to_display = news.length;
    }
    num_to_display = Math.min(num_to_display, news.length);
    for (let n=0; n<num_to_display; n++){
        children = news[n].childNodes;
        dates.push(children[1]);
        titles.push(children[3]);
        extern.push(children[5]);
    }

    HTML = "";

    for (let i=0; i<num_to_display; i++) {
        HTML += "<li><p>"+titles[i].innerHTML+"</p><p>";
        if (extern[i].innerHTML !== ""){
            HTML += "See the full article <a href=\""+extern[i].innerHTML+"\">here</a>.<br />";
        }
        HTML += dates[i].innerHTML+"</p></li>";
    }

    news_list.innerHTML = HTML;
}

$(document).ready(function(){
    fetch("./newsfeed/news-items.xml")
      .then(response => response.text())
      .then(text => displayNews(text))
});