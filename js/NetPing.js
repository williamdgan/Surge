let $ = {
//H:'https://connectivitycheck.platform.hicloud.com/generate_204',
Baidu:'https://www.baidu.com',
YouTube:'https://www.youtube.com',
Google:'https://www.google.com/generate_204'}  
//GH:'https://www.github.com'}
!(async () => {
await Promise.all([http('H'),http('B'),http('Y'),http('G')]).then((x)=>{
	$done({
    title: '𝗡𝗲𝘁𝗣𝗶𝗻𝗴',
    content: x.join(' '),
    //icon: 'timer','icon-color': '#FF5A9AF9',
  })})})();
function http(req) {
    return new Promise((r) => {
			let time = Date.now();
        $httpClient.post($[req], (err, resp, data) => {
            r(req +': ' +(Date.now() - time)+'ms');});});}
