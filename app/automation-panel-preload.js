const { contextBridge, ipcRenderer } = require('electron');

const ALLOWED_COMMANDS = new Set([
    'GET_STATE',
    'START_AUTOMATION',
    'STOP_AUTOMATION',
    'SCAN_FAVORITE_QUESTS',
    'GET_FAVORITE_SCAN_RESULT',
    'CRAVE_SAGA_DUMP_UI',
    'GET_AUTOMATION_CONFIG',
    'SET_AUTOMATION_CONFIG',
    'SHOW_PANEL',
    'HIDE_PANEL',
    'TOGGLE_PANEL'
]);

function normalizeCommand(command) {
    if (typeof command !== 'string') return '';
    return command.trim();
}

contextBridge.exposeInMainWorld('panelAPI', {
    runCommand: (command, payload) => {
        const normalized = normalizeCommand(command);
        if (!ALLOWED_COMMANDS.has(normalized)) {
            return Promise.resolve({
                ok: false,
                error: 'PANEL_COMMAND_NOT_ALLOWED',
                command: normalized || command || null
            });
        }
        return ipcRenderer
            .invoke('run-command', { command: normalized, payload })
            .catch(error => ({
                ok: false,
                error: 'PANEL_RUN_COMMAND_FAILED',
                command: normalized,
                message: error?.message || String(error)
            }));
    },
    onFavoriteScanResult: (callback) => {
        if (typeof callback !== 'function') return;
        ipcRenderer.on('favorite-scan-result', (event, items) => {
            callback(items);
        });
    }
});

