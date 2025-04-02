const mongoose = require('mongoose');

const trackByTypeSchema = new mongoose.Schema({
  type: {type: String, required: true},
  links: [{type: String, required: true}],
});

const artistSchema = new mongoose.Schema({
  artist: {type: String, required: true},
  tracks: [trackByTypeSchema],
});

const lst = [
  './app/Keertan/TimeBasedRaagKeertan/TRACKS.js',
  './app/Keertan/DarbarSahibPuratanKeertanSGPC/TRACKS.js',
  './app/Keertan/RandomRadio/TRACKS.js',
  './app/Keertan/AkhandKeertan/TRACKS.js',
  './app/Keertan/AllKeertan/TRACKS.js',
  './app/Paath/TRACKS.js',
  './app/Katha/GianiSherSinghJi/TRACKS.js',
  './app/Katha/MiscellaneousTopics/TRACKS.js',
  './app/Katha/SantGianiGurbachanSinghJiSGGSKatha/TRACKS.js',
  './app/Katha/BhagatJaswantSinghJi/TRACKS.js',
  './app/Katha/SantWaryamSinghJi/TRACKS.js',
  './app/Katha/BhSukhaS/TRACKS.js',
];

async function insertTracks(the_tracks, tablename) {
  const Table = mongoose.model(tablename, artistSchema, tablename);
  for (const [artist, trackData] of Object.entries(the_tracks)) {
    const schemeaaa = new Table({
      artist,
      tracks: trackData,
    });

    try {
      await schemeaaa.save();
    } catch (err) {
      console.error('Error inserting artist', err);
    }
  }
}

mongoose
  .connect('mongodb://localhost/keeratxyz', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(async () => {
    console.log('Connected to MongoDB');
    for (const file of lst) {
      let collection = file.split('/')[3];
      if (collection.endsWith('.js')) {
        collection = file.split('/')[2];
      }
      const {ALL_OPTS} = require(file); // Assuming your TRACKS.js file is in the same directory
      await insertTracks(ALL_OPTS, collection);
    }
    console.log('Data inserted successfully');
    mongoose.connection.close();
  })
  .catch(err => console.error('Could not connect to MongoDB', err));
