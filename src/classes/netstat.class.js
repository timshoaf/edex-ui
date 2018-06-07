class Netstat {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        this.si = require("systeminformation");

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_netstat">
            <div id="mod_netstat_inner">
                <h1>NETWORK STATUS</h1>
                <div id="mod_netstat_innercontainer">
                    <div>
                        <h1>STATE</h1>
                        <h2>UNKNOWN</h2>
                    </div>
                    <div>
                        <h1>IPv4</h1>
                        <h2>--.--.--.--</h2>
                    </div>
                    <div>
                        <h1>PING</h1>
                        <h2>--ms</h2>
                    </div>
                </div>
            </div>
        </div>`;


        // Init updaters
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 1000);
    }
    updateInfo() {
        this.si.networkInterfaces((data) => {
            // Find the first external network networkInterface
            let net = data[0];
            let netID = 0;
            while (net.internal === true) {
                netID++;
                if (data[netID] !== undefined) {
                    net = data[netID];
                } else {
                    // No external connection!
                    break;
                }
            }

            if (net.ip4 === "127.0.0.1") {
                // We're offline.
                document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "OFFLINE";
                document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = "--.--.--.--";
                document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = "--ms";
                return;
            } else {
                document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "ONLINE";

                document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = net.ip4;

                this.si.inetLatency((data) => {
                    let ping;
                    if (data === -1) {
                        ping = "--ms";
                    } else {
                        ping = Math.round(data)+"ms";
                    }
                    document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = ping;
                });
            }
        });
    }
}

module.exports = {
    Netstat
};