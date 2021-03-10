"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheControlScope = exports.RequestedBlockMessage = void 0;
var RequestedBlockMessage;
(function (RequestedBlockMessage) {
    RequestedBlockMessage["PersonalMedicalInformation"] = "PERSONAL_MEDICAL_INFORMATION";
    RequestedBlockMessage["InsuranceInformation"] = "INSURANCE_INFORMATION";
    RequestedBlockMessage["MedicalReports"] = "MEDICAL_REPORTS";
})(RequestedBlockMessage = exports.RequestedBlockMessage || (exports.RequestedBlockMessage = {}));
var CacheControlScope;
(function (CacheControlScope) {
    CacheControlScope["Public"] = "PUBLIC";
    CacheControlScope["Private"] = "PRIVATE";
})(CacheControlScope = exports.CacheControlScope || (exports.CacheControlScope = {}));
