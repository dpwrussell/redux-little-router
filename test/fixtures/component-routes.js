import { assembleComponentRoute as assemble } from '../../src';

const root = { path: '/', name: 'root' };
const home = { path: 'home', name: 'home' };
const messages = { path: 'messages', name: 'messages' };
const team = { path: ':team', name: 'team' };
const channel = { path: ':channel', name: 'channel' };
const spookyparam = { path: ':spookyparam', name: '3spooky5me' };
const global = { path: 'global', name: 'global' };
const absolute = { path: 'a/b/c/:d', name: 'absolute' };

const routes =
assemble(root,
  assemble(home,
    assemble(messages,
      assemble(team,
        assemble(channel)
      )
    ),
    assemble(global,
      assemble(channel)
    ),
    assemble(spookyparam)
  ),
  assemble(absolute)
);

export default routes;
