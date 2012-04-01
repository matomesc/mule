;(function () {
  var root = this

  function Request(method, url) {
    this.method = method
    this.url = url

    // request headers
    this.headers = {
      'accept': 'application/json'
    }
    if (method == 'post' || method == 'put') {
      this.headers['content-type'] = 'application/json'
    }
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
      var xhr = new XMLHttpRequest()
      xhr.open(this.method, this.url, true)

      // set headers
      for (var name in this.headers) {
        xhr.setRequestHeader(name, this.headers[name])
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
          return
        }
        var status = xhr.status,
            body
        try {
          body = JSON.parse(xhr.responseText)
        } catch (err) {
          return callback(err)
        }
        return callback(null, new Response(body, status, xhr))
      }

      // send the request
      xhr.send(this.body || null)
    },
    withCredentials: function () {
      this.xhr.withCredentials = true
      return this
    }
  }

  function Response(body, status, xhr) {
    this.xhr = xhr
    this.body = body
    this.status = status
  }

  var mule = root.mule = {}
  ;['get', 'post', 'put', 'delete'].forEach(function (method) {
    mule[method] = function (url) {
      return new Request(method, url)
    }
  })
}).call(window)