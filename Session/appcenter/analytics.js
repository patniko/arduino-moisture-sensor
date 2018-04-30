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
const uuid_1 = require("uuid");
const request = require('request-promise');
function UTCNow() {
    const date = new Date();
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
class DeviceInfo {
}
exports.DeviceInfo = DeviceInfo;
class SessionLogs {
}
exports.SessionLogs = SessionLogs;
class StartServiceLog {
    constructor() {
        this.type = "startService";
        this.timestamp = UTCNow().toJSON();
        this.services = ["analytics"];
    }
}
exports.StartServiceLog = StartServiceLog;
class StartSessionLog {
    constructor() {
        this.type = "startSession";
        this.timestamp = UTCNow().toJSON();
        this.services = ["analytics"];
    }
}
exports.StartSessionLog = StartSessionLog;
class EventLog {
    constructor() {
        this.type = "event";
        this.timestamp = UTCNow().toJSON();
    }
}
exports.EventLog = EventLog;
class AppCenterClient {
    constructor(appSecret, installId, deviceInfo) {
        this.ingestionUrl = "https://in.appcenter.ms/logs?Api-version=1.0.0";
        this.appSecret = appSecret;
        this.installId = installId;
        this.device = deviceInfo;
        this.sessionId = uuid_1.v1();
        this.queue = [];
    }
    startService() {
        return __awaiter(this, void 0, void 0, function* () {
            let serviceLog = new StartSessionLog();
            serviceLog.device = this.device;
            this.queue.push(serviceLog);
            this.processor = setInterval(() => {
                this.flush();
            }, 5000);
        });
    }
    startSession() {
        let eventLog = new StartSessionLog();
        eventLog.device = this.device;
        eventLog.sid = this.sessionId;
        this.queue.push(eventLog);
    }
    trackEvent(name, fieldId, properties) {
        let eventLog = new EventLog();
        eventLog.name = name;
        eventLog.id = fieldId;
        eventLog.device = this.device;
        eventLog.sid = this.sessionId;
        eventLog.properties = properties;
        this.queue.push(eventLog);
    }
    stopService() {
        clearInterval(this.processor);
    }
    flushEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const logs = {
                logs: [event]
            };
            yield this.sendRequest(JSON.stringify(logs), 1);
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            let records = [];
            while (this.queue.length)
                records.push(this.queue.splice(0, 1)[0]);
            if (records.length > 0) {
                const logs = {
                    logs: records
                };
                yield this.sendRequest(JSON.stringify(logs), records.length);
            }
        });
    }
    sendRequest(body, logCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const correlationId = uuid_1.v1();
            const url = this.ingestionUrl;
            const requestInfo = {
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
                const response = yield request(url, requestInfo);
                console.log(response);
            }
            catch (exception) {
                console.log(`Send Log Error: ${exception}`);
            }
        });
    }
}
exports.AppCenterClient = AppCenterClient;
//# sourceMappingURL=analytics.js.map