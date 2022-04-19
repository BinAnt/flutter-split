## Flutter_split

> flutter打包成web的时候main.dart.js文件有点大, 用这个分包成几个小一点的文件, 首页加载快很多





## 安装

~~~shell
npm i flutter_split -g
~~~

## 使用

在你的项目执行build命令结束之后,执行一下命令:

~~~shell
ant -s dist
~~~

## 配合文件

/dist/index.html加载main.dart.js的地方需要修改 

~~~js
 <!--<script src="main.dart.js" type="application/javascript"></script>-->
  <script>
    var serviceWorkerVersion = null;
    var scriptLoaded = false;
    var fileContent = null;
    function loadMainDartJs() {
      if (scriptLoaded) {
        return;
      }
      scriptLoaded = true;
      var scriptTag = document.createElement('script');
      scriptTag.src = 'main.dart.js';
      scriptTag.type = 'application/javascript';
      document.body.append(scriptTag);
    }

    //创建script标签 并加载内容
    function createScript(content) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.onreadystatechange = function () {
        if (this.readyState == 'complete')
          callback();
      }
      script.onload = function () {
        callback();
      }
      // script.src = 'main.dart.js';
      script.textContent = content;
      head.appendChild(script);
    }

    // 请求回每一个文件的内容
    const xhr = new XMLHttpRequest();
    const okStatus = document.location.protocol === "file:" ? 0 : 200;

    function load(name) {
      xhr.open('GET', name, false);
      xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
      xhr.send(null);
      const result = xhr.status === okStatus ? xhr.responseText : null;
      if(xhr.status === okStatus) {
        fileContent = Promise.resolve(xhr.responseText)
        return true
      }
      return false;
      // return result ? Promise.resolve(result) : false
    }

    // 判断文件是否存在
    function isExistFile(filepath, filename) {
      console.log(filepath, filename);
      if (filepath == null || filename == null || filepath === "" || filename === "") {
        return false
      }
      var xmlhttp;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.open("GET", filepath + '/' + filename, false);
      xmlhttp.send();
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) return true; //url存在
        else if (xmlhttp.status === 404) return false; //url不存在
        else return false;//其他状态
      }
    }
    // 加载文件夹
    function loadDir(dir = '/part') {
      let num = 0;
      let result = [];
      let resultStr = '';

      while (load(dir + '/' + num + '.txt')) {
        result.push(fileContent)
        num++
      }

      Promise.all([...result]).then((resArr) => {
        resArr.forEach(text => {
          resultStr += `
      ${text}`
        })
        // console.log(resultStr, 'resultStrresultStr');
        if (resultStr.length === 0) {
          // 还是加载main.dart.js
          loadMainDartJs();
        } else {
          createScript(resultStr)
        }
      })

      // return resultStr
    }

    loadDir()
  </script>
~~~

