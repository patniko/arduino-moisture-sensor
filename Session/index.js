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
        const MOISTURE_ANALYTICS_FIELD_ID = process.env['MOISTURE_ANALYTICS_FIELD_ID'];
        const MOISTURE_ANALYTICS_FIELD_NAME = process.env['MOISTURE_ANALYTICS_FIELD_NAME'];
        const client = new analytics_1.AppCenterClient(APPCENTER_APP_SECRET, APPCENTER_INSTALL_ID, getDeviceInfo());
        client.startService();
        client.startSession();
        yield client.flush();
        const description = req.params.description;
        const moisture = Math.round(req.params.measurement);
        if (moisture && description) {
            client.trackEvent(MOISTURE_ANALYTICS_FIELD_NAME, MOISTURE_ANALYTICS_FIELD_ID, {
                "zone1_Value": `${moisture}`,
                "zone1_Description": description.toUpperCase()
            });
            yield client.flush();
        }
        context.log('Measurement: ' + req.params.description);
        context.log('Value: ' + moisture);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: `Received ${req.params.description} : ${moisture}`
        };
        context.done();
    });
};
function getDeviceInfo() {
    let device = {
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
    };
    return device;
}
//# sourceMappingURL=index.js.map