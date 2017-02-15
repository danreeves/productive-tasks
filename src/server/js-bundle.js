import send from 'koa-send';

export default async (ctx, next) => {
    if (ctx.url.match(/client\.[\w|\d]+\.js/)) {
        await send(ctx, ctx.url.replace('/', ''), { root: __dirname });
    } else {
        await next();
    }
};
