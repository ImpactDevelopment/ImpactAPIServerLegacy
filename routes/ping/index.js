import { basePath } from '~/config'
import reqdir from '~/utils/reqdir'
const versions = reqdir(module)

export default (server) => {
    server.get({ 'path': basePath('/ping'),
        'version': '1.0.0' }, versions.v1)
}
