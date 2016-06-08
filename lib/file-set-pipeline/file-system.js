/**
 * @author Titus Wormer
 * @copyright 2015-2016 Titus Wormer
 * @license MIT
 * @module unified-engine:file-set-pipeline:file-system
 * @fileoverview Find files from the file-system.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var path = require('path');
var Ignore = require('../ignore');
var Finder = require('../finder');

/*
 * Methods.
 */

var relative = path.relative;

/**
 * Find files from the file-system.
 *
 * @param {Object} context - Context object.
 * @param {Object} settings - Configuration.
 * @param {function(Error?)} done - Callback invoked when
 *   done.
 */
function fileSystem(context, settings, done) {
    var ignore = new Ignore({
        'cwd': settings.cwd,
        'detectIgnore': settings.detectIgnore,
        'ignoreName': settings.ignoreName,
        'ignorePath': settings.ignorePath
    });

    context.finder = new Finder({
        'cwd': settings.cwd,
        'extensions': settings.extensions,
        'ignore': ignore
    });

    ignore.loadPatterns(function () {
        /*
         * Use the files when they were injected,
         * which we now because there are no globs.
         */

        if (context.files.length) {
            /* Mark as given. */
            context.files.forEach(function (file) {
                file.directory = relative(settings.cwd, file.directory);
                file.history = [file.filePath()];
                file.namespace('unified-engine').given = true;
            });

            done();

            return;
        }

        context.finder.find(settings.globs, function (err, files) {
            context.files = files;

            done(err);
        });
    });
}

/*
 * Expose.
 */

module.exports = fileSystem;
