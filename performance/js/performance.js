;(function() {
  document.querySelector('#show').addEventListener('click', function() {
    httpPerformance.clear();
    var img = document.createElement('img');
    img.src = 'images/badgesbg.png';
    document.querySelector('body').appendChild(img);
    setTimeout(function() {
      console.log(httpPerformance.getByName('http://localhost:3012/performance/images/badgesbg.png'));
    }, 1000)
  }, false)
})(window);