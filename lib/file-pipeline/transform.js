/**
 * @author Titus Wormer
 * @copyright 2015-2016 Titus Wormer
 * @license MIT
 * @module unified-engine:file-pipeline:transform
 * @fileoverview Transform an AST associated with a file.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var debug = require('debug')('unified-engine:file-pipeline:transform');

/**
 * Transform the `ast` associated with a file with
 * configured plug-ins.
 *
 * @param {Object} context - Context.
 * @param {File} file - File.
 * @param {FileSet} fileSet - Set.
 * @param {function(Error?)} done - Completion handler.
 */
function transform(context, file, fileSet, done) {
    if (file.hasFailed()) {
        done();
        return;
    }

    debug('Transforming document `%s`', file.filePath());

    context.processor.run(context.tree, file, function (err, node) {
        debug('Transformed document (error: %s)', err);

        context.tree = node;

        done(err);
    });
}

/*
 * Expose.
 */

module.exports = transform;