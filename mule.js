;(function () {
  var root = this

  function Request(method, url) {
    var self = this
    this.headers = {
      'Accept': 'application/json'
    }
    this.xhr = new XMLHttpRequest()
    this.xhr.open(method, url, true)
    this.xhr.onreadystatechange = function () {
      if (self.xhr.readyState === 4) {
        return self.callback.call(null, new Response(self.xhr))
      }
    }
  }
  Request.prototype = {
    set: function (name, value) {
      this.headers[name] = value
      return this
    },
    body: function (obj) {
      this.body = obj
      return this
    },
    end: function (callback) {
      for (var name in this.headers) {
        this.xhr.setRequestHeader(name, this.headers[name])
      }
      this.callback = callback
      this.xhr.send(this.body || null)
    },
    withCredentials: function () {
      this.xhr.withCredentials = true
      return this
    }
  }

  function Response(xhr) {
    this.xhr = xhr
    this.status = xhr.status
    this.body = JSON.parse(xhr.responseText)
  }

  var mule = root.mule = {}
  ;['get', 'post', 'put', 'delete'].forEach(function (method) {
    mule[method] = function (url) {
      return new Request(method, url)
    }
  })
}).call(window)