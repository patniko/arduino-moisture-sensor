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
class DeviceInfo {
}
class StartServiceLog {
    constructor() {
        this.Timestamp = new Date().toUTCString();
        this.Services = ["analytics"];
    }
}
class EventLog {
    constructor() {
        this.Timestamp = new Date().toUTCString();
    }
}
class WeightedString {
    constructor(weight, value) {
        this.Weight = weight;
        this.Value = value;
    }
}
class NumberProperty {
    constructor(name, value) {
        this.Name = name;
        this.Value = value;
    }
}
class StringProperty {
    constructor(name, value) {
        this.Name = name;
        this.Value = value;
    }
}
class DateTimeProperty {
    constructor(name, value) {
        this.Name = name;
        this.Value = value;
    }
}
class BooleanProperty {
    constructor(name, value) {
        this.Name = name;
        this.Value = value;
    }
}
class AppCenterClient {
    constructor(appSecret, installId) {
        this.ingestionUrl = "https://in.appcenter.ms/logs?Api-version=1.0.0";
        this.appSecret = appSecret;
        this.installId = installId;
    }
    startSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendRequest(JSON.stringify(session), session.length);
        });
    }
    eventLog(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendRequest(JSON.stringify(event), event.length);
        });
    }
    sendRequest(body, logCount) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = this.ingestionUrl;
            var requestInfo = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "App-Secret": this.appSecret,
                    "Install-ID": this.installId,
                    "LogCount": logCount,
                    "X-Correlation-ID": uuid_1.v1()
                },
                body: body
            };
            try {
                let res = yield fetch(url, requestInfo);
                let response = yield res.json();
            }
            catch (exception) {
                console.log(`Send Log Error: ${exception}`);
            }
        });
    }
}
//# sourceMappingURL=analytics.js.map