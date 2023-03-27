/*
引用：https://github.com/app2smile/rules/blob/master/js/baidu-no-redirect.js

[MITI]
hostname = boxer.baidu.com

QuantumultX：
^https?:\/\/boxer\.baidu\.com\/scheme\?scheme url script-response-header https://gitlab.com/RuCu6/QuanX/-/raw/main/Scripts/baidu/baiduNoRedirect.js

Surge：
百度防跳转 = type=http-response,pattern=^https?:\/\/boxer\.baidu\.com\/scheme\?scheme,script-path=https://gitlab.com/lodepuly/vpn_tool/-/raw/main/Resource/Script/BaiduSearch/RemoveBaiduSearchRedirect.js
*/


const method = $request.method;
const statusCode = $response.statusCode;
const url = $request.url;
let headers = $response.headers;

if (method === "GET" && statusCode === "HTTP/1.1 302 Found" && headers.hasOwnProperty("Location")) {
  if (headers.Location.includes(".apple.com")) {
    let tokenData = getUrlParamValue(url, "tokenData");
    if (tokenData !== null) {
      let tokenDataObj = JSON.parse(decodeURIComponent(tokenData));
      headers.Location = tokenDataObj.url;
    }
  }
}
$done({ headers: headers });

function getUrlParamValue(url, queryName) {
  return Object.fromEntries(
    url
      .substring(url.indexOf("?") + 1)
      .split("&")
      .map((pair) => pair.split("="))
  )[queryName];
}
