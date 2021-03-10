"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationContract {
    constructor() {
        this.error = '';
        this.isRequired = (value, message) => {
            if (!value || value.length <= 0)
                this.error = message;
        };
        this.hasMinLen = (value, min, message) => {
            if (!value || value.length < min)
                this.error = message;
        };
        this.hasMaxLen = (value, max, message) => {
            if (!value || value.length > max)
                this.error = message;
        };
        this.isFixedLen = (value, len, message) => {
            if (value.length !== +len)
                this.error = message;
        };
        this.isEmail = (value, message) => {
            const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
            if (!reg.test(value))
                this.error = message;
        };
        this.errors = () => this.error;
        this.clear = () => {
            this.error = '';
        };
        this.isValid = () => this.error.length === 0;
    }
}
exports.default = ValidationContract;
