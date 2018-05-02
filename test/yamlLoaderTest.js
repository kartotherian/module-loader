'use strict';

let assert = require('assert'),
	jsYaml = require('js-yaml'),
    YamlLoader = require('..').YamlLoader;

function test(opts, expected) {
    return () => {
        let loader = new YamlLoader(opts, (v, n) => v);
        let actual = loader.update(jsYaml.safeDump(opts.yaml));
        assert.strictEqual(actual, jsYaml.safeDump(expected));
    }
}

describe('yamlLoader', () => {

    it('unmodified', test({yaml: 'abc'}, 'abc'));

    it('yamlSetDataSource', test({
    	yaml: {
			description: "sample tmsource yaml",
			Layer: [
				{
					id: 'landuse',
					Datasource: {
						dbname: 'gis',
						host: '',
						type: 'postgis'
					}
				},
				{
					id: 'other layer',
					Datasource: {
						host: '',
						type: 'postgis'
					}
				}
			]
	    },
    	yamlSetDataSource: {
			'if': {
				dbname: 'gis',
				host: '',
				type: 'postgis'
			},
			'set': {
				host: 'localhost',
				user: 'username',
				password: 'password'
			}
		}
    }, {
		description: "sample tmsource yaml",
		Layer: [
			{
				id: 'landuse',
				Datasource: {
					dbname: 'gis',
					host: 'localhost',
					type: 'postgis',
					user: 'username',
					password: 'password'
				}
			},
			{
				id: 'other layer',
				Datasource: {
					host: '',
					type: 'postgis'
				}
			}
		]
    }));
});
