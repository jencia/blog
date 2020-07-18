import { camelCase } from 'lodash-es'
import { log } from './logger'
import messages from './messages'
import { name, version } from '../package.json'
import cjs from './cjs-module'

const msg = messages.hi

log(msg)

log(name)
log(version)
log(camelCase('hello world'))
log(cjs)