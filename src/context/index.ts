import express from 'express';

function checkAuth(req: express.Request) {
  // console.log(req.get('Authorization'));
  console.log({ h: req.headers });
}

async function context({ req }: { req: express.Request}) {
  try {
    await checkAuth(req);
    return req.headers;
  } catch (e) {
    console.log('context e()', e);
    throw new Error('context e()');
  }
}

export default context;
