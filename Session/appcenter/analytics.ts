import { v1 } from 'uuid'
import { Session } from 'inspector';

const request = require('request-promise');

function UTCNow() : Date {
    const date = new Date(); 
    return new Date(
        date.getUTCFullYear(), 
        date.getUTCMonth(), 
        date.getUTCDate(), 
        date.getUTCHours(), 
        date.getUTCMinutes(), 
        date.getUTCSeconds()
    ); 
}

export class DeviceInfo {
    AppNamespace: string; // "com.microsoft.bing", "com.microsoft.test", null
    AppVersion: string; // "3.0.0", "3.0.0", "3.0.0", "1.0.0", "1.1.0", "1.0.0-beta", "3.1.9-alpha"
    AppBuild: string; // "1", "2", "3"
    CarrierCountry: string; // "US", "US", "US", "CA", "FR", "FR", "KP", "CN"
    CarrierName: string; // "AT&T", "Verizon", "Verizon", "Cricket"
    Locale: string;
    Model: string; // "PC", "X10", "iPhone1,1", "iPod5,1", "iPad4,5"
    OemName: string; // "Dell", "Samsung", "Lenovo"
    OsApiLevel: string; // 1, 3
    OsName: string; // "Android", "Android", "Android", "Android", "iOS", "iOS", "iOS"
    OsVersion: string; // "8.0.0", "8.1.0", "10.0.0"
    OsBuild: string; // "", "1", "2"
    ScreenSize: string; // "1024x768", "1024x768", "1024x768", "320x240", "860x640"
    TimeZoneOffset: number; // -4, 4
    SdkName: "appcenter.node";
    SdkVersion: string; // "0.0.1";
}

export class SessionLogs {
    logs: any;
}

export class StartServiceLog {
    Type: "startService";
    Timestamp: string = UTCNow().toJSON();
    Device: DeviceInfo;
    Services: string[] = ["analytics"];
}

export class StartSessionLog {
    Type: "startSession";
    Sid: string;
    Timestamp: string = UTCNow().toJSON();
    Device: DeviceInfo;
    Services: string[] = ["analytics"];
}

export class EventLog {
    Type: "event";
    Sid: string;
    Id: string;
    Name: string;
    Timestamp: string = UTCNow().toJSON();
    Properties: any;
    Device: DeviceInfo;
}

export class AppCenterClient {
    ingestionUrl: string = "https://in.appcenter.ms/logs?Api-version=1.0.0";
    appSecret: string;
    installId: string;
    device: DeviceInfo;
    sessionId: string;

    queue: any[];
    processor: any;

    constructor(appSecret: string, installId: string, deviceInfo: DeviceInfo) {
        this.appSecret = appSecret;
        this.installId = installId;

        this.device = deviceInfo;
        this.sessionId = v1();
        this.queue = [];
    }

    public async startService() {
        let serviceLog = new StartSessionLog();
        serviceLog.Device = this.device;
        await this.flushEvent(serviceLog);
        
        this.processor = setInterval(() => {
            this.flush();
        }, 5000);
    }

    public startSession() {
        let eventLog = new StartSessionLog();
        eventLog.Device = this.device;
        eventLog.Sid = this.sessionId;
        this.queue.push(eventLog);
    }

    public trackEvent(name: string, properties: any) {
        let eventLog = new EventLog();
        eventLog.Device = this.device;
        eventLog.Sid = this.sessionId;
        eventLog.Properties = properties;
        this.queue.push(eventLog);
    }

    public stopService() {
        clearInterval(this.processor);
    }

    public async flushEvent(event: StartServiceLog | StartSessionLog | EventLog) {
        const logs: SessionLogs = {
            logs: [event]
        }
        await this.sendRequest(JSON.stringify(logs), 1)
    }

    public async flush() {
        let records: any[] = [];
        while (this.queue.length) records.push(this.queue.splice(0,1)[0]);
        if(records.length > 0) {
            const logs: SessionLogs = {
                logs: records
            }
            await this.sendRequest(JSON.stringify(logs), records.length)
        }
    }

    async sendRequest(body: string, logCount: number) {
        const correlationId = v1();
        const url: string = this.ingestionUrl;
        const requestInfo: any = { 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
                "App-Secret": this.appSecret,
                "Install-ID": this.installId,
                "LogCount": logCount,
                "X-Correlation-ID": correlationId
            },
            body: body
        };
        try {
            const response = await request(url, requestInfo);
            console.log(response);
        } catch (exception) {
            console.log(`Send Log Error: ${exception}`);
        }
    }
}
