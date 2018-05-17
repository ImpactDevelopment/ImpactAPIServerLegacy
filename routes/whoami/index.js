import { basePath } from '~/config'
import reqdir from '~/utils/reqdir'
const versions = reqdir(module)

export default (server) => {
    const PATH = basePath('/whoami/')
    server.get({ 'path': PATH,
        'version': '1.0.0' }, versions.v1)
}
