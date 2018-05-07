import reqdir from 'require-directory'

const config = {
    // map es6 modules with default exports
    'visit': (mod) => mod.default ? mod.default : mod
}

export default (loader, path) => {
    let options = config
    if (!path) {
        path = options
        options = null
    }
    return reqdir(loader, path, options)
}
