const cron = require('node-cron');
const { SiteClient } = require('datocms-client');
const client = new SiteClient('7ff35345302d3d594080cd643c9486', {
    envoirnment: "development"
});

let scheduledTask = null;

// Function to start a cron job
function startCronJob(schedule) {
    console.log("scheduledTask", scheduledTask)
    if (scheduledTask) {
        // Stop the previously scheduled task
        scheduledTask.stop();
    }

    scheduledTask = cron.schedule(schedule, async () => {
        try {

            const response = await fetch('http://localhost:3000/api/unblockIp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            console.log("response.ok", data)
            if (response.ok) {
                const data = await response.json();
            } else {
                console.error('API request failed');
            }
        } catch (error) {
        }
        // Your task logic here
    });

    console.log(`Cron job scheduled for ${schedule}`);
}

// Function to dynamically change cron job timing
async function changeCronTiming(newSchedule) {
    const record = await client.items.find("E5yEtaK0QGq4tALAzDdfYw");

    console.log("record", record)
    startCronJob(newSchedule);
}

// (async function getRecordById(recordId) {
//     try {
//         const record = await client.items.find(recordId);

//         if (record) {
//             console.log('Retrieved record:', record);
//             changeCronTiming(`*/${record.time} * * * *`)
//             return record;
//         } else {
//             console.log('Record not found');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error retrieving record:', error);
//         return null;
//     }
// })("NhGzknBMRf-QeO1lgKWtBQ");

exports.changeCronTiming = changeCronTiming