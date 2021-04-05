// my-wc/components/config.js

let _options = {}

export function setOptions(options) {
    if (options) {
        if (options.prefix && typeof options.prefix === 'string') {
            _options.prefix = options.prefix || 'prefix'
            console.log(`Options.prefix: "${options.prefix}"`)
        }
    }
}

export function getOptions() {
    return _options
}
