fetch("../newsfeed/news-items.xml")
  .then(response => response.text())
  .then(text => console.log(text))