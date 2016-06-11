/**
 * @author Titus Wormer
 * @copyright 2015-2016 Titus Wormer
 * @license MIT
 * @module unified-engine:file-set-pipeline:transform
 * @fileoverview Transform all files.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var FileSet = require('../file-set');
var filePipeline = require('../file-pipeline');

/**
 * Transform all files.
 *
 * @param {Object} context - Context object.
 * @param {Object} settings - Configuration.
 * @param {function(Error?)} done - Completion handler.
 */
function transform(context, settings, done) {
    var fileSet = new FileSet();

    context.fileSet = fileSet;

    fileSet
        .on('done', done)
        .on('add', function (file) {
            filePipeline.run({
                'configuration': context.configuration,
                'processor': settings.processor(),
                'cwd': settings.cwd,
                'extensions': settings.extensions,
                'pluginPrefix': settings.pluginPrefix,
                'injectedPlugins': settings.injectedPlugins,
                'treeIn': settings.treeIn,
                'treeOut': settings.treeOut,
                'out': settings.out,
                'streamOut': settings.streamOut
            }, file, fileSet, function (err) {
                /* istanbul ignore next - doesn’t occur as all
                 * failures in `filePipeLine` are failed on each
                 * file.  Still, just to ensure things work in
                 * the future, we add an extra check. */
                if (err) {
                    file.fail(err);
                }

                fileSet.emit('one', file);
            });
        });


    context.files.forEach(fileSet.add, fileSet);
}

/*
 * Expose.
 */

module.exports = transform;