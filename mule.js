;(function () {
  var root = this

  function Request(method, url) {
    this.method = method
    this.url = url
    this.withCredentials = false;

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
      if (this.method == 'get') {
        // build query string
        var query = Object.keys(obj).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
        }).join('&')
        this.url += '?' + query
      } else {
        this.body = JSON.stringify(obj)
      }
      return this
    },
    end: function (callback) {
      var self = this,
          xhr = new XMLHttpRequest()
      xhr.withCredentials = this.withCredentials
      xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState != 4) return
        var status = xhr.status
        try {
          var json = JSON.parse(xhr.responseText)
        } catch (err) {
          return callback(err)
        }
        return callback(null, new Response(json, status, xhr))
      })
      xhr.addEventListener('error', function (evt) {
        return callback(new Error('errorz'))
      })
      xhr.open(this.method, this.url, true)
      for (var name in this.headers) {
        xhr.setRequestHeader(name, this.headers[name])
      }
      xhr.send(this.body || null)
    },
    withCredentials: function () {
      this.withCredentials = true
      return this
    }
  }

  function Response(body, status, xhr) {
    this.xhr = xhr
    this.body = body
    this.status = status
  }

  function Mule(host) {
    this.host = host || null
  }
  
  Mule.prototype = {
    endpoint: function (host) {
      host = host.charAt(host.length - 1) == '/' ? host.slice(0, host.length - 1) : host
      return new Mule(host)
    }
  }

  ;['get', 'post', 'put', 'delete', 'head', 'patch'].forEach(function (method) {
    Mule.prototype[method] = function (url) {
      if (this.host) {
        var path = url.charAt(0) == '/'? url : '/' + url
        url = this.host + path
      }
      return new Request(method, url)
    }
  })
  var mule = new Mule()
  if (module != undefined && module.exports) {
    module.exports = mule
  } else if (define) {
    define(function () {
      return mule
    })
  } else {
    root.mule = mule
  }
}).call(this)