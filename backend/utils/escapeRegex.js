// Makes user text safe to use inside a RegExp (so "a+b" is searched as plain text).
module.exports = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
