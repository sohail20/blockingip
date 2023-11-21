import Datastore from 'nedb';

// Initialize NeDB and create a new datastore
export const db2 = new Datastore({
    filename: './database1.db', // Replace with your desired database file path
    autoload: true, // Automatically load the database
});

// Example function to insert data into the NeDB database
export const insertData = (data) => {
    return new Promise((resolve, reject) => {
        db2.insert(data, (err, newDoc) => {
            if (err) {
                reject(err);
            } else {
                resolve(newDoc);
            }
        });
    });
};

// Example function to find data in the NeDB database
export const findData = (query) => {
    return new Promise((resolve, reject) => {
        db2.find(query, (err, docs) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
};

// Other operations as needed (update, remove, etc.)
