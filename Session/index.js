"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("./appcenter/analytics");
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const APPCENTER_APP_SECRET = process.env['APPCENTER_APP_SECRET'];
        const APPCENTER_INSTALL_ID = process.env['APPCENTER_INSTALL_ID'];
        const client = new analytics_1.AppCenterClient(APPCENTER_APP_SECRET, APPCENTER_INSTALL_ID, getDeviceInfo());
        yield client.startService();
        const description = req.params.description;
        const moisture = Math.round(req.params.measurement);
        if (moisture) {
            client.trackEvent("Moisture", {
                "Zone1 Reading": `${moisture}`,
                "Zone1 Description": description
            });
            yield client.flush();
        }
        context.log('Measurement: ' + req.params.name);
        context.log('Value: ' + req.params.measurement);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: `Received ${req.params.name} : ${req.params.measurement}`
        };
        context.done();
    });
};
function getDeviceInfo() {
    let device = {
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
    };
    return device;
}
//# sourceMappingURL=index.js.map