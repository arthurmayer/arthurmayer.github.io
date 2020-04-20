$(document).ready(function(){

document.getElementsByTagName("header")[0].innerHTML = `
    <div id="logo">
      <div id="logo_text">
        <h1><a href="index.html"><strong>Human-Centered Robotics Lab</strong></a></h1>
        <h4>Lifelong collaborative autonomy, robot adaptation, multisensory perception, and human-robot/swarm teaming</h2>
      </div>
    </div>
    <nav class="navbar navbar-expand-md navbar-light sticky-top">
      <button class="navbar-toggler pull-right" type="button" data-toggle="collapse" data-target="#links" aria-controls="links" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse navbar-ex3-collapse" id="links">
        <ul class="navbar-nav">
          <li class="nav-item" id="nav-index"><a class="nav-link" href="index.html">Home</a></li>
          <li class="nav-item" id="nav-people"><a class="nav-link" href="people.html">People</a></li>
          <li class="nav-item" id="nav-research"><a class="nav-link" href="research.html">Research</a></li>
          <li class="nav-item" id="nav-outreach"><a class="nav-link" href="outreach.html">Outreach</a></li>
          <li class="nav-item" id="nav-publications"><a class="nav-link" href="publications.html">Publications</a></li>
          <li class="nav-item" id="nav-media"><a class="nav-link" href="media.html">Media</a></li>
          <li class="nav-item" id="nav-news"><a class="nav-link" href="news.html">News</a></li>
          <li class="nav-item" id="nav-contact"><a class="nav-link" href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="pull-right">
        <form class="navbar-form" role="search" action="./search.html" method="GET">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Search" required type="search" name="q" />
            <div class="input-group-btn">
              <button class="btn btn-default" type="submit">Search</button>
            </div>
          </div>
        </form>
      </div>
    </nav>
`;
try {
  document.getElementById("nav-"+document.URL.substring(document.URL.lastIndexOf("/")+1, document.URL.indexOf(".html"))).classList.add("active");
}
catch(err){
}

document.getElementsByTagName("footer")[0].innerHTML = `
    <div id="contact">
      <h4>Contact</h4>
      <hr>
      <div class="row">
        <div class="col-sm-4" style="text-align: center;">
          <img src="images/people/hzhang.jpg" style="width: 50%; margin: 0 auto;">
          <p>
            <a href="http://inside.mines.edu/~hzhang/" target="_blank" style="color: #333399;">Dr. Hao Zhang</a>
          </p>
        </div>
        <div class="col-sm-4" style="text-align: center;">
           <p>
            Dept. of Computer Science <br>
            Colorado School of Mines <br>
            1610 Illinois Street <br>
            Golden, CO 80401
          </p>
        </div>
        <div class="col-sm-4" style="text-align: center;">
          <p>
            Lab: Brown Hall BBW 325 <br>
            Office: Brown Hall 250 <br>
            Email: hzhang@mines.edu <br>
            Phone: (303) 273-3581 <br>
            Fax: (303) 273-3602
          </p>
        </div>
      </div>
    </div>
    <div id="footer-external">
      <p><a href="index.html">HCRobotics Lab</a> | <a href="http://inside.mines.edu/CS-home">Department of Computer Science</a> | <a href="http://mines.edu">Colorado School of Mines</a></p>
    </div>
`;

});