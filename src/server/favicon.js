import path from 'path';
import send from 'koa-send';

export default async (ctx, next) => {
    if (ctx.url.match(/favicon\.ico/)) {
        // dist/../static
        await send(ctx, ctx.url, { root: path.join(__dirname, '..', 'static') });
    } else {
        await next();
    }
};
