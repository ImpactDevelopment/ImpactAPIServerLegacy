import { basePath } from 'config'
import reqdir from 'utils/reqdir'
const versions = reqdir(module)

export default (server) => {
    server.post({ 'path': basePath('/login'),
        'version': '1.0.0' }, versions.v1)
}
