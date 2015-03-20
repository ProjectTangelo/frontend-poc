var mongoose = require('mongoose');
// var feathersMongoose = require('feathers-mongoose');

var fileSchema = mongoose.Schema({
	name: String,
	size: Number,
	file: Object,
	content: Buffer
});

/*
fileSchema.plugin(mongooseFS, {
	keys: ['content'],
	mongoose: mongoose
});
*/

var File = mongoose.model('File', fileSchema);
// var File = feathersMongoose('File', fileSchema, mongoose);


var fileService = {
	// Returns a list of all the files.
	find: function( params, callback ) {
		File.find({}, function(err, files) {
			if( err ) {
				console.log('Failed to load files');
				console.log( err );
			}
			callback( null, files );
		});
	},

	remove: function( id, params, callback ) {
		File.findByIdAndRemove(id, function(err, data) {
			if( err ) {
				console.log(err);
				return err;
			}

			console.log("Removed entity: " + id);
		});
	},

	get: function( id, params, callback ) {
		var thing = {
			name: 'Things',
			file: 'Hello Thar'
		};

		console.log('Get Function');

		File.findById(id, function(err, file) {
			if( err ){
				callback( null, thing );
				console.log('Error 1');
				return err;
			}

			/*
			file.retrieveBlobs(function(err, data) {
				if( err ){
					callback( null, thing );
					console.log('Error 2');
					return err;
				}
				callback(null, data);
			});
			*/

			// console.log('This is the data: ' + file.content);
			// callback(null, file.content.toString('binary'));
			// callback(null, new Blob(file.content, {type: file.file.type}));
			
			callback(null, file.content.toString('binary'));
		});
		
	},

	create: function( data, params, callback ) {
		var file = new File({
			name: data.name,
			size: data.size,
			file: data.file,
			// content: new Buffer(data.content, 'base64')
			content: data.content
		});

		// var fs = require('fs');
		// fs.writeFile('thing.md', file.content);

		// console.log("Create Function");

		file.save(function(err) {
			if( err )
				console.log('Failed to save file: ' + data.name + '\n\tError: ' + err);
			
			console.log('Create file with id: ' + file._id);
			// console.log('This is the file received: ' + file.file);
			// console.log('This is the data received: ' + file.content);
		});


		callback( null, file );
	}
};

exports = module.exports = fileService;