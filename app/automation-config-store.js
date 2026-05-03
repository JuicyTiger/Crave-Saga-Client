/**
 * automation-config-store.js — 自动化配置持久化
 *
 * 存储面板用户的筛选参数（Raid 筛选、Quest 设置、炼成设置等），
 * 使配置在应用重启后不丢失。
 *
 * 文件位置：%APPDATA%/crave-saga-client/automation-config.json
 */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const CONFIG_FILENAME = 'automation-config.json';

// 允许持久化的顶层键白名单（防止意外写入无关数据）
const ALLOWED_KEYS = new Set([
    'lastSelectedMode',
    'descentRaidFilter',
    'regularRaidFilter',
    'favoriteQuestFilter',
    'forgingFilter',
    'towerSubjectionFilter'
]);

function getConfigFilePath() {
    return path.join(app.getPath('userData'), CONFIG_FILENAME);
}

function readConfig() {
    const filePath = getConfigFilePath();
    try {
        if (!fs.existsSync(filePath)) return {};
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        console.warn(`[AutomationConfigStore] 读取失败，返回空配置:`, e.message);
        return {};
    }
}

function writeConfig(config) {
    const filePath = getConfigFilePath();
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error(`[AutomationConfigStore] 写入失败:`, e.message);
        return false;
    }
}

/**
 * 获取全部配置
 * @returns {object}
 */
function getAll() {
    return readConfig();
}

/**
 * 合并写入配置（只更新传入的键，不覆盖其他键）
 * @param {object} partial - 要更新的键值对
 * @returns {boolean} 是否写入成功
 */
function merge(partial) {
    if (!partial || typeof partial !== 'object') return false;
    const current = readConfig();

    // 只写入白名单内的键
    for (const key of Object.keys(partial)) {
        if (ALLOWED_KEYS.has(key)) {
            current[key] = partial[key];
        }
    }

    return writeConfig(current);
}

module.exports = { getAll, merge, ALLOWED_KEYS };
