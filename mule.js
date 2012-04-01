;(function () {
  var root = this

  function Request(method, url) {
    var self = this

    // request headers
    this.headers = {
      'accept': 'application/json'
    }
    if (method == 'post' || method == 'put') {
      this.headers['content-type'] = 'application/json'
    }

    this.xhr = new XMLHttpRequest()
    this.xhr.open(method, url, true)
  }
  Request.prototype = {
    set: function (name, value) {
      if (arguments.length == 2) {
        this.headers[name.toLowerCase()] = value
      } else {
        for (var key in name) {
          this.headers[key.toLowerCase()] = name[key]
        }
      }
      return this
    },
    body: function (obj) {
      this.body = JSON.stringify(obj)
      return this
    },
    end: function (callback) {
      // set headers
      for (var name in this.headers) {
        this.xhr.setRequestHeader(name, this.headers[name])
      }
      var response = new Response(this.xhr, callback)
      this.xhr.send(this.body || null)
    },
    withCredentials: function () {
      this.xhr.withCredentials = true
      return this
    }
  }

  function Response(xhr, callback) {
    this.xhr = xhr
    xhr.onreadystatechange = this.handleResponse
  }
  Response.prototype.handleResponse = function () {
    var self = this
    if (self.xhr.readyState == 4) {
      try {
        self.body = JSON.parse(xhr.responseText)
      } catch (e) {
        return callback(e);
      }
      self.status = self.xhr.status
      return callback(null, self)
    }
  }

  var mule = root.mule = {}
  ;['get', 'post', 'put', 'delete'].forEach(function (method) {
    mule[method] = function (url) {
      return new Request(method, url)
    }
  })
}).call(window)