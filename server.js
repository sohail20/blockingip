const { SiteClient } = require('datocms-client');
const { changeCronTiming } = require('./pages/api/cron');
const client = new SiteClient('7ff35345302d3d594080cd643c9486');

(async function getRecordById(recordId) {
    try {
        const record = await client.items.find(recordId);

        if (record) {
            console.log('Retrieved record:', record);
            changeCronTiming(`*/${record.time} * * * *`)
            return record;
        } else {
            console.log('Record not found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving record:', error);
        return null;
    }
})("NhGzknBMRf-QeO1lgKWtBQ");
