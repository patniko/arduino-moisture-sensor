import { v1 } from 'uuid'

class DeviceInfo {
    AppVersion: string; // "3.0.0", "3.0.0", "3.0.0", "1.0.0", "1.1.0", "1.0.0-beta", "3.1.9-alpha"
    AppSecret: string;
    CarrierCountry: string; // "US", "US", "US", "CA", "FR", "FR", "KP", "CN"
    CarrierName: string; // "AT&T", "Verizon", "Verizon", "Cricket"
    Locale: string; // "ES", "FR", "EN", "EN", "EN", "ZH"
    Model: string; // "PC", "X10", "iPhone1,1", "iPod5,1", "iPad4,5"
    OemName: string; // "Dell", "Samsung", "Lenovo"
    OsApiLevel: string; // 1, 3
    OsName: string; // "Android", "Android", "Android", "Android", "iOS", "iOS", "iOS"
    OsVersion: string; // "8.0.0", "8.1.0", "10.0.0"
    OsBuild: string; // "", "1", "2"
    ScreenSize: string; // "1024x768", "1024x768", "1024x768", "320x240", "860x640"
    TimeZoneOffset: string; // -4, 4
    AppBuild: string; // "1", "2", "3"
    AppNamespace: string; // "com.microsoft.bing", "com.microsoft.test", null
    SdkName: string; // "appcenter.android" | "appcenter.ios";
    SdkVersion: string; // "appcenter.android" | "appcenter.ios";
    WrapperSdkName: "appcenter.xamarin" | "hockeysdk.cordova"; // "appcenter.xamarin", "hockeysdk.cordova", null
    WrapperSdkVersion: string; // "1.0"
    LiveUpdateReleaseLabel: string; // "1.0", "2.0"
    LiveUpdatePackageHash: string; // "1234564654654546", "dsadsdasd3211321233"
    LiveUpdateDeploymentKey: string; // "prod", "stage"
}

class StartServiceLog {
    SessionId: string;
    Timestamp: string = new Date().toUTCString();
    Device: DeviceInfo;
    Services: string[] = ["analytics"];
}

class EventLog {
    Id: string;
    Name: string;
    Timestamp: string = new Date().toUTCString();
    Sid: string;
    Properties: EventProperties[];
    Device: DeviceInfo;
}

interface EventProperties {
    [key: string]: string;
 }

class WeightedString {
    Weight: number;
    Value: string;
    constructor(weight: number, value: string)
    {
        this.Weight = weight;
        this.Value = value;
    }
}

class NumberProperty {
    Name: string;
    Value: number;
    constructor(name: string, value: number)
    {
        this.Name = name;
        this.Value = value;
    }
}

class StringProperty {
    Name: string;
    Value: string;
    constructor(name: string, value: string)
    {
        this.Name = name;
        this.Value = value;
    }
}

class DateTimeProperty {
    Name: string;
    Value: string;
    constructor(name: string, value: string)
    {
        this.Name = name;
        this.Value = value;
    }
}

class BooleanProperty {
    Name: string;
    Value: boolean;
    constructor(name: string, value: boolean)
    {
        this.Name = name;
        this.Value = value;
    }
}

class AppCenterClient {
    ingestionUrl: string = "https://in.appcenter.ms/logs?Api-version=1.0.0";
    appSecret: string;
    installId: string;

    constructor(appSecret: string, installId: string) {
        this.appSecret = appSecret;
        this.installId = installId;
    }

    async startSession(session: StartServiceLog[]) {
        return await this.sendRequest(JSON.stringify(session), session.length);
    }

    async eventLog(event: EventLog[]) {
        return await this.sendRequest(JSON.stringify(event), event.length);
    }

    async sendRequest(body: string, logCount: number) {
        var url: string = this.ingestionUrl;
        var requestInfo: any = { 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json",
                "App-Secret": this.appSecret,
                "Install-ID": this.installId,
                "LogCount": logCount,
                "X-Correlation-ID": v1()
            },
            body: body
        };
        try {
            let res = await fetch(url, requestInfo)
            let response = await res.json();
        } catch (exception) {
            console.log(`Send Log Error: ${exception}`);
        }
    }
}
