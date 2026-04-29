(function (context) {
    try {
        var info = {
            href: context && context.window && context.window.location ? context.window.location.href : '',
            hasCanvas: !!(context && context.gameCanvas),
            hasRequire: !!(context && context.engine && context.engine.require),
            hasCc: !!(context && context.engine && context.engine.cc),
            hasMasterData: !!(context && context.masterData)
        };

        console.log('[MF TEST] subframe custom script executed', info);
        window.__mfSubframeCustomLoaded = true;
        window.__mfSubframeCustomInfo = info;

        if (context && typeof context.sendNotification === 'function') {
            context.sendNotification('MF TEST', 'subframe custom script executed');
        }
    } catch (error) {
        console.error('[MF TEST] subframe custom script failed', error);
    }
})(context);

