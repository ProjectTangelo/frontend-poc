var mongoose = require('mongoose');
var mongooseFS = require('mongoose-fs');

var fileSchema = mongoose.Schema({
	name: String,
	size: Number
});

fileSchema.plugin(mongooseFS, {
	keys: ['content', 'complement'],
	mongoose: mongoose
});

var File = mongoose.model('File', fileSchema);


var fileService = {
	// Returns a list of all the files.
	find: function( params, callback ) {
		console.log('Find Method');
		File.find({}, function(err, files) {
			if( err ) {
				console.log('Failed to load files');
				console.log( err );
			}
			console.log("Files: " + files);
			callback( null, files );
		});
	},

	get: function( id, params, callback ) {
		var thing = {
			name: 'Things',
			content: 'Hello Thar'
		};

		console.log('Get Function');

		File.findById(id, function(err, file) {
			if( err ){
				callback( null, thing );
				console.log('Error 1');
				return err;
			}

			file.retrieveBlobs(function(err, data) {
				if( err ){
					callback( null, thing );
					console.log('Error 2');
					return err;
				}

				console.log('This is the data: ' + data);
				callback(null, {
					name: data.name,
					size: data.size,
					content: data
				});
			})
		});
		
	},

	create: function( data, params, callback ) {
		var file = new File({
			name: data.name,
			size: data.size,
			content: data.file
		});

		file.save(function(err) {
			if( err )
				console.log('Failed to save file: ' + data.name + '\n\tError: ' + err);
		});

		console.log("Create Function");

		console.log( 'This is the file received: ' + file );
		callback( null, file );
	}
};

exports = module.exports = fileService;