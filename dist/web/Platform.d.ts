/**
* Platform.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of Platform interface.
*/
import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export declare class Platform extends RX.Platform {
    getType(): Types.PlatformType;
    select<T>(specifics: {
        [platform in Types.PlatformType | 'default']?: T;
    }): T | undefined;
}
declare const _default: Platform;
export default _default;
