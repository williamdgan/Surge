/*
QuantumultX格式转换为Surge

[MITM]
hostname = %APPEND% github.com:443, raw.githubusercontent.com:443

Surge:
[Script]
Qx_Surge = type=http-request,pattern=qx$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Mubdao/Surge/main/js/Qx_surge.js
*/

let req = $request.url.replace(/qx$/,'')
let name = '#!name= ' + (req.match(/.+\/(.+)\.(conf|js)/)?.[1] || '无名')
!(async () => {
  let body = await http(req);

	body = body.match(/[^\n]+/g);
	
let script = [];
let URLRewrite = [];
let HeaderRewrite = [];
let MapLocal = [];
let MITM = "";

body.forEach((x, y, z) => {
	let type = x.match(
		/script-|enabled=|url\sreject|echo-response|\-header|hostname|url\s(302|307)|\s(request|response)-body/
	)?.[0];
	if (type) {
		switch (type) {
			case "script-":
			if (x.match('echo')) {throw '脚本不支持通用'}
				z[y - 1]?.match("#") && script.push(z[y - 1]);
				
let requires =	x.match('-header') ? "0" : "1";
let proto = x.match('proto.js') ? ',binary-body-mode=1' : '' ;
				script.push(
					x.replace(
						/([^\s]+)\surl\sscript-(response|request)[^\s]+\s(http.+\/(.+)\.js)/,
						`$4 = type=http-$2,pattern=$1,requires-body=${requires}${proto},max-size=0,script-path=$3,script-update-interval=0`,
					),
				);
				break;

			case "enabled=":
				z[y - 1]?.match("#") && script.push(z[y - 1]);
				script.push(
					x.replace(
						/(.+\*)\s([^\,]+).+?\=([^\,]+).+/,
						`$3 = type=cron,script-path=$2,timeout=60,cronexp=$1,wake-system=1`,
					),
				);
				break;

			case "url reject":
			let url = x.match(/[^\s]+/)[0];
			let jct = x.match(/reject?[^\s]+/)[0];
				let obj = {
				"reject-200" : 'https://raw.githubusercontent.com/Mubdao/Surge/main/js/reject-200.txt',
				"reject-img" : 'https://raw.githubusercontent.com/Mubdao/Surge/main/js/reject-img.gif',
				"reject-dict" : 'https://raw.githubusercontent.com/Mubdao/Surge/main/js/reject-dict.json',
				"reject-array" : 'https://raw.githubusercontent.com/Mubdao/Surge/main/js/reject-array.json',
			   pp : function (){
				return this[jct]}
				}
				if (obj = obj.pp()){
					z[y - 1]?.match("#") && MapLocal.push(z[y - 1]);
					MapLocal.push(`${url} data="${obj}"`);
				}else{
					z[y - 1]?.match("#") && URLRewrite.push(z[y - 1]);
				URLRewrite.push(x.replace(/([^\s]+).+/, "$1 - reject"));
				}
				break;

			case "-header":
			if (x.match(/\(\\r\\n\)/g).length === 2){			
				z[y - 1]?.match("#") &&  HeaderRewrite.push(z[y - 1]);
let op = x.match(/\sresponse-header/) ?
'http-response ' : '';
     if(x.match(/\$1\$2/)){
		  HeaderRewrite.push(x.replace(/([^\s]+).+?n\)([^\:]+).+/,`${op}$1 header-del $2`))	
		}else{
				HeaderRewrite.push(
					x.replace(
						/(http[^\s]+)[^\)]+\)([^:]+):([^\(]+).+\$1\s?\2?\:?([^\$]+)?\$2/,
						`${op}$1 header-replace-regex $2 $3 $4''`,
					),
				);
				}
				}else{
	$notification.post('不支持这条规则转换,已跳过','',`${x}`);
				}
				break;

			case "echo-response":
				z[y - 1]?.match("#") && MapLocal.push(z[y - 1]);
				MapLocal.push(x.replace(/([^\s]+).+(http.+)/, '$1 data="$2"'));
				break;
			case "hostname":
				MITM = x.replace(/hostname\s?=(.*)/, `[MITM]\nhostname = %APPEND% $1`);
				break;
			default:
				if (type.match("url ")) {
					z[y - 1]?.match("#") && URLRewrite.push(z[y - 1]);
					URLRewrite.push(x.replace(/([^\s]+).+(302|307).+(http.+)/, "$1 $3 $2"));
				} else {
					z[y - 1]?.match("#") && script.push(z[y - 1]);
					script.push(
						x.replace(
							/([^\s]+)\surl\s(response|request)-body\s(.+)\2-body(.+)/,
							`test = type=$2,pattern=$1,requires-body=1,script-path=https://raw.githubusercontent.com/Mubdao/Surge/main/js/replace-body.js, argument=$3->$4`,
						),
					);
				}
		} //switch结束
	}
}); //循环结束

script = (script[0] || '') && `[Script]\n${script.join("\n")}`;

URLRewrite = (URLRewrite[0] || '') && `[URL Rewrite]\n${URLRewrite.join("\n")}`;

HeaderRewrite = (HeaderRewrite[0] || '') && `[Header Rewrite]\n${HeaderRewrite.join("\n")}`;

MapLocal = (MapLocal[0] || '') && `[MapLocal]\n${MapLocal.join("\n")}`;

body = `${name}

${script}
${URLRewrite}
${HeaderRewrite}
${MapLocal}
${MITM}`.replace(/\;/g,'#')



 $done({ response: { status: 200 ,body:body } });

})()
.catch((e) => {
		e && $notification.post(`${e}`,'','');
		$done()
	})




function http(req) {
  return new Promise((resolve, reject) =>
    $httpClient.get(req, (err, resp,data) => {
resp.status === 200 ? resolve(data) : reject();

  
  })
)
}
