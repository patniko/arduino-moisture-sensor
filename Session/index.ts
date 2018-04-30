import { AppCenterClient, DeviceInfo } from "./appcenter/analytics";
import { getDefaultSettings } from "http2";

module.exports = async function (context: any, req: any) {

    const APPCENTER_APP_SECRET = process.env['APPCENTER_APP_SECRET']; 
    const APPCENTER_INSTALL_ID = process.env['APPCENTER_INSTALL_ID'];

    const client = new AppCenterClient(
        APPCENTER_APP_SECRET, 
        APPCENTER_INSTALL_ID, 
        getDeviceInfo()
    );
    await client.startService();

    const description = req.params.description;
    const moisture = Math.round(req.params.measurement);
    if(moisture) {
        client.trackEvent("Moisture", {
            "Zone1 Reading": `${moisture}`, 
            "Zone1 Description": description
        });
        await client.flush();
    }

    context.log('Measurement: ' + req.params.name);
    context.log('Value: ' + req.params.measurement);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: `Received ${req.params.name} : ${req.params.measurement}`
    };
    context.done();
};

function getDeviceInfo() : DeviceInfo {
    let device: DeviceInfo = {
      AppNamespace: "moisture.sensor",
      AppVersion: "0.0.2",
      AppBuild: "1",
      CarrierCountry: "US",
      CarrierName: "Azure",
      Locale: "en_US",
      Model: "Arduino MEGA 2560",
      OemName: "Arduino",
      OsApiLevel: "1",
      OsName: "PatrickOS",
      OsVersion: "0.0.1",
      OsBuild: "1",
      ScreenSize: "16x2",
      TimeZoneOffset: -8,
      SdkName: "appcenter.node",
      SdkVersion: "0.0.1"
    }
    return device;
}