var cookieParser = require('cookie-parser');

var user = function(req, res, next) {
  if(req.headers.cookie) {
    var _cookies = cookieParser(req.headers.cookie);
    if(_cookies)

  } else {
    res.send(401, 'unauthorized');
  }

}

module.exports = {
  user: user
}
