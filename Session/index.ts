import { AppCenterClient, DeviceInfo } from "./appcenter/analytics";
import { getDefaultSettings } from "http2";

module.exports = async function (context: any, req: any) {

    const APPCENTER_APP_SECRET = process.env['APPCENTER_APP_SECRET']; 
    const APPCENTER_INSTALL_ID = process.env['APPCENTER_INSTALL_ID'];
    const MOISTURE_ANALYTICS_FIELD_ID = process.env['MOISTURE_ANALYTICS_FIELD_ID'];
    const MOISTURE_ANALYTICS_FIELD_NAME = process.env['MOISTURE_ANALYTICS_FIELD_NAME'];

    const client = new AppCenterClient(
        APPCENTER_APP_SECRET, 
        APPCENTER_INSTALL_ID, 
        getDeviceInfo()
    );
    client.startService();
    client.startSession();
    await client.flush();

    const description = req.params.description;
    const moisture = Math.round(req.params.measurement);
    if(moisture && description) {
        client.trackEvent(MOISTURE_ANALYTICS_FIELD_NAME, MOISTURE_ANALYTICS_FIELD_ID, {
            "Zone1 Reading": `${moisture}`, 
            "Zone1 Description": description.toUpperCase()
        });
        await client.flush();
    }

    context.log('Measurement: ' + req.params.description);
    context.log('Value: ' + moisture);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: `Received ${req.params.description} : ${moisture}`
    };
    context.done();
};

function getDeviceInfo() : DeviceInfo {
    let device: DeviceInfo = {
      appNamespace: "moisture.sensor",
      appVersion: "0.0.2",
      appBuild: "1",
      carrierCountry: "US",
      carrierName: "Azure",
      locale: "en_US",
      model: "Arduino MEGA 2560",
      oemName: "Arduino",
      osApiLevel: "1",
      osName: "PatrickOS",
      osVersion: "0.0.1",
      osBuild: "1",
      screenSize: "16x2",
      timeZoneOffset: -8,
      sdkName: "appcenter.node",
      sdkVersion: "0.0.1"
    }
    return device;
}