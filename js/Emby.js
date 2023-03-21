/*
EmbyPremium = type=http-response,pattern=^https?:\/\/mb3admin.com\/admin\/service\/registration\/validateDevice,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Mubdao/Example/main/emby.js
hostname= %APPEND% mb3admin.com
*/
if ($request.url.indexOf('mb3admin.com/admin/service/registration/validateDevice') != -1) {
      if($response.status!=200){
          $notification.post("", "", "");
          $done({status: 200, headers: $response.headers, body: '{"cacheExpirationDays":999,"resultCode":"GOOD","message":"Device Valid"}' })
      }else{
          $done({})
      }
  }else{
      $done({})
  }
